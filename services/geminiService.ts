

import { GoogleGenAI } from "@google/genai";
import { type Content } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getHealthAdvice = async (prompt: string, chatHistory: Content[]) => {
  try {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: chatHistory,
        config: {
            systemInstruction: "You are SmartLab AI's Health Assistant. Be friendly, empathetic, and clear. Explain medical concepts simply for users, but always stress that you are not a doctor and they must consult one for diagnosis. Respond in the user's language (Hindi, English, or Bengali). Recommend tests based on symptoms where appropriate. Keep answers mobile-friendly and concise.",
        }
    });
    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Error getting health advice:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};

export const analyzeReport = async (reportContent: string, audience: 'user' | 'technical') => {
  try {
    const userPrompt = `Analyze the following diagnostic lab report. Provide a simple, easy-to-understand summary for a patient. Explain what any abnormal values (highlighted with 'HIGH' or 'LOW') might indicate in plain, non-jargon language. Suggest if a doctor consultation is recommended. Start with a clear heading 'AI Report Summary'. Add a disclaimer: 'This is an AI summary, not a medical diagnosis. Please consult your doctor.'\n\nReport:\n${reportContent}`;
    const techPrompt = `Analyze the following diagnostic lab report. Provide a technical summary for a lab administrator. Identify abnormal values, suggest possible correlations, and recommend potential follow-up tests if applicable. Be concise and data-driven.\n\nReport:\n${reportContent}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: audience === 'user' ? userPrompt : techPrompt
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing report:", error);
    return "Could not analyze the report due to an error.";
  }
};

export const getAdminSuggestions = async (context: string) => {
    try {
        const prompt = `As an AI Admin Advisor for a diagnostic lab, provide concise, data-driven suggestions based on this context: ${context}\n\nSuggestion:`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error getting admin suggestion:", error);
        return "Failed to generate suggestion.";
    }
};

export const findNearbyLabs = async (latitude: number, longitude: number) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Find diagnostic labs and sample collection centers near my current location. Provide a short, bulleted list with names and a brief one-line description.",
            config: {
              tools: [{googleMaps: {}}],
              toolConfig: {
                  retrievalConfig: {
                      latLng: {
                          latitude: latitude,
                          longitude: longitude
                      }
                  }
              }
            },
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        return { text: response.text, chunks: groundingChunks };

    } catch(error) {
        console.error("Error finding nearby labs:", error);
        return { text: "Sorry, I couldn't find any labs nearby at the moment.", chunks: [] };
    }
}