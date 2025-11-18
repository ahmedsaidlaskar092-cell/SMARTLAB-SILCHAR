import React, { useState } from 'react';
import { Screen, Input, Button, Icon } from '../components';
import type { User } from '../types';
import SignUpScreen from './SignUpScreen';

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
  const [view, setView] = useState<'login' | 'signup'>('login');

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

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-primary to-secondary">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <Icon name="logo" className="w-24 h-24 mx-auto text-white" />
            <h1 className="text-4xl font-bold text-white mt-4">SMARTLAB AI</h1>
            <p className="text-accent mt-2">Your Health, Smarter.</p>
          </div>
          
          <div className="space-y-6">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
            />
            <Input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-300 text-center mt-4">{error}</p>}
          
          <div className="mt-8">
            <Button fullWidth onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-6 text-white text-sm">
            <a href="#" className="hover:underline">Forgot Password?</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('signup'); }} className="hover:underline">Create Account</a>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LoginScreen;