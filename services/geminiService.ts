
import { GoogleGenAI } from "@google/genai";
import { type Content } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// ========== ERROR HANDLING & RETRY LOGIC ==========
const RETRYABLE_STATUSES = [429, 503];
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      const status = error?.error?.code || error?.status;
      if (RETRYABLE_STATUSES.includes(status) && attempts < MAX_RETRIES) {
        const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, attempts - 1);
        console.warn(`API call failed with status ${status}. Retrying in ${backoffTime}ms... (Attempt ${attempts}/${MAX_RETRIES})`);
        await sleep(backoffTime);
      } else {
        console.error("API call failed after multiple retries:", error);
        // Re-throw the last error to be caught by the calling function
        throw error;
      }
    }
  }
  // This should not be reachable if MAX_RETRIES > 0
  throw new Error("Exceeded maximum retry attempts.");
}


// ========== GEMINI API FUNCTIONS ==========

export const getHealthAdvice = async (prompt: string, chatHistory: Content[]) => {
  try {
    return await retryWithBackoff(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...chatHistory,
                { role: 'user', parts: [{ text: prompt }] }
            ],
            config: {
                systemInstruction: "You are SmartLab AI's Health Assistant. Be friendly, empathetic, and clear. Explain medical concepts simply for users, but always stress that you are not a doctor and they must consult one for diagnosis. If a user mentions severe symptoms like 'chest pain', 'difficulty breathing', 'severe headache', or 'sudden weakness', you MUST immediately and boldy advise them to seek URGENT MEDICAL ATTENTION. Respond in the user's language (Hindi, English, or Bengali). Recommend tests based on symptoms where appropriate. Keep answers mobile-friendly and concise.",
            }
        });
        return response.text;
    });
  } catch (error) {
    console.error("Error getting health advice:", error);
    return "I'm sorry, the AI assistant is currently busy. Please try again in a few moments.";
  }
};

export const analyzeReport = async (reportContent: string, audience: 'user' | 'technical') => {
  try {
     return await retryWithBackoff(async () => {
        const userPrompt = `Analyze the following diagnostic lab report. Provide a simple, easy-to-understand summary for a patient. Explain what any abnormal values (highlighted with 'HIGH' or 'LOW') might indicate in plain, non-jargon language. Suggest if a doctor consultation is recommended. Start with a clear heading 'AI Report Summary'. Add a disclaimer: 'This is an AI summary, not a medical diagnosis. Please consult your doctor.'\n\nReport:\n${reportContent}`;
        const techPrompt = `Analyze the following diagnostic lab report. Provide a technical summary for a lab administrator. Identify abnormal values, suggest possible correlations, and recommend potential follow-up tests if applicable. Be concise and data-driven.\n\nReport:\n${reportContent}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: audience === 'user' ? userPrompt : techPrompt
        });

        return response.text;
    });
  } catch (error) {
    console.error("Error analyzing report:", error);
    return "The AI analyzer is currently busy. Please try again in a few moments.";
  }
};

export const getAdminSuggestions = async (context: string) => {
    try {
        return await retryWithBackoff(async () => {
            const prompt = `As an AI Admin Advisor for a diagnostic lab, provide concise, data-driven suggestions based on this context: ${context}\n\nSuggestion:`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt
            });
            return response.text;
        });
    } catch (error) {
        console.error("Error getting admin suggestion:", error);
        return "Failed to generate suggestion at this time.";
    }
};
