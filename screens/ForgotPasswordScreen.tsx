
import React, { useState, useContext } from 'react';
import { Screen, Input, Button, Icon } from '../components';
import { AppContext } from '../App';

interface ForgotPasswordScreenProps {
  switchToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ switchToLogin }) => {
  const { handlePasswordReset } = useContext(AppContext);
  const [step, setStep] = useState<'email' | 'confirm' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = () => {
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    // In a real app, this would send an email. Here we simulate it.
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setStep('confirm');
    }, 1000);
  };
  
  const handleResetSubmit = () => {
    setError('');
    if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = handlePasswordReset(email, password);
      if (success) {
        setStep('success');
      } else {
        setError('Could not reset password for this email. Please check the email and try again.');
      }
      setLoading(false);
    }, 1000);
  };
  
  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <p className="text-blue-100 mt-2 text-center mb-6">Enter your email to reset your password.</p>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="bg-white/80 border-transparent focus:bg-white"/>
            <Button fullWidth onClick={handleEmailSubmit} disabled={loading} className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-bold">{loading ? 'Sending...' : 'Send Reset Link'}</Button>
          </>
        );
      case 'confirm':
          return (
            <>
                <div className="bg-green-500/20 rounded-full p-4 mx-auto w-fit mb-4">
                    <Icon name="check" className="w-12 h-12 text-green-300" />
                </div>
                <p className="text-white mt-4 text-center mb-6">A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.</p>
                <Button fullWidth onClick={() => setStep('reset')} className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-bold">Proceed to Reset</Button>
            </>
          );
      case 'reset':
        return (
            <>
                <p className="text-blue-100 mt-2 text-center mb-6">Enter your new password.</p>
                <div className="space-y-4">
                    <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="bg-white/80 border-transparent focus:bg-white"/>
                    <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="bg-white/80 border-transparent focus:bg-white"/>
                </div>
                <Button fullWidth onClick={handleResetSubmit} disabled={loading} className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-bold">{loading ? 'Resetting...' : 'Reset Password'}</Button>
            </>
        );
      case 'success':
        return (
            <>
                <div className="bg-green-500/20 rounded-full p-4 mx-auto w-fit mb-4">
                     <Icon name="check" className="w-12 h-12 text-green-300" />
                </div>
                <p className="text-white mt-4 text-center mb-6 font-medium">Your password has been reset successfully!</p>
                <Button fullWidth onClick={switchToLogin} className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-bold">Back to Login</Button>
            </>
        )
    }
  }

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="w-full max-w-sm animate-scaleIn">
           <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
                </div>
                
                {error && <p className="text-red-200 bg-red-900/20 p-2 rounded text-center my-4 text-sm">{error}</p>}
                
                {renderContent()}
            </div>

          {step !== 'success' && (
             <div className="text-center mt-6 text-white text-sm font-medium">
                <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }} className="hover:text-blue-200 transition-colors">
                Back to Login
                </a>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
};

export default ForgotPasswordScreen;
