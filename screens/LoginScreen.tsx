
import React, { useState } from 'react';
import { Screen, Input, Button, Icon } from '../components';
import type { User } from '../types';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSignUp: (newUser: Omit<User, 'id' | 'role'>) => boolean;
  users: User[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password'>('login');

  const handleLogin = () => {
    setLoading(true);
    setError('');

    setTimeout(() => {
        // Hardcoded admin check
        if (email.toLowerCase() === 'mrattitude885@gmail.com' && password === 'Ahmed@43211') {
            const adminUser = users.find(u => u.email.toLowerCase() === 'mrattitude885@gmail.com');
            if(adminUser) {
                onLogin(adminUser);
            } else {
                setError('Admin user not found in mock data.');
            }
        } else {
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
            if (user) {
                onLogin(user);
            } else {
                setError('Invalid email or password.');
            }
        }
        setLoading(false);
    }, 1000);
  };

  if (view === 'signup') {
    return <SignUpScreen onSignUp={onSignUp} switchToLogin={() => setView('login')} />;
  }

  if (view === 'forgot_password') {
    return <ForgotPasswordScreen switchToLogin={() => setView('login')} />;
  }

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-10 animate-slideInUp">
            <div className="bg-white/20 backdrop-blur-lg rounded-full w-28 h-28 mx-auto flex items-center justify-center mb-4 shadow-2xl">
                <Icon name="logo" className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mt-4 tracking-tight">SMARTLAB AI</h1>
            <p className="text-blue-100 mt-2 font-medium">Your Health, Smarter.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 animate-slideInUp space-y-6" style={{animationDelay: '200ms'}}>
            <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
              className="bg-white/80 border-transparent focus:bg-white"
            />
            <Input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
               className="bg-white/80 border-transparent focus:bg-white"
            />

            {error && <p className="text-red-200 bg-red-900/20 p-2 rounded text-center text-sm font-medium">{error}</p>}
            
            <Button fullWidth onClick={handleLogin} disabled={loading} className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 shadow-lg">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-8 text-white text-sm font-medium animate-slideInUp px-2" style={{animationDelay: '500ms'}}>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot_password'); }} className="hover:text-blue-200 transition-colors">Forgot Password?</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('signup'); }} className="hover:text-blue-200 transition-colors">Create Account</a>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LoginScreen;
