
import React, { useState } from 'react';
import { Screen, Input, Button, Icon } from '../components';
import type { User } from '../types';

interface SignUpScreenProps {
  onSignUp: (newUserInfo: Omit<User, 'id' | 'role'>) => boolean;
  switchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setError('');
    if (!name || !email || !password || !confirmPassword || !address) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);

    setTimeout(() => {
      const success = onSignUp({
          name,
          email,
          password,
          address,
      });

      if (!success) {
        setError('A user with this email already exists.');
        setLoading(false);
      }
      // On success, the parent component will handle the state change and unmount this component.
    }, 1000);
  };

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-secondary via-teal-600 to-emerald-500">
        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-8 animate-slideInUp">
            <div className="bg-white/20 backdrop-blur-lg rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-xl">
                <Icon name="user" className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mt-2">Create Account</h1>
            <p className="text-teal-100 mt-1">Join SMARTLAB AI</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 animate-slideInUp space-y-4" style={{animationDelay: '100ms'}}>
            <Input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              disabled={loading}
              className="bg-white/80 border-transparent focus:bg-white"
            />
             <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
              className="bg-white/80 border-transparent focus:bg-white"
            />
            <Input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            <Input 
              type="password" 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="bg-white/80 border-transparent focus:bg-white"
            />

             {error && <p className="text-red-200 bg-red-900/20 p-2 rounded text-center text-sm font-medium">{error}</p>}
             
             <Button fullWidth onClick={handleSignUp} disabled={loading} className="bg-white text-teal-700 hover:bg-teal-50 mt-4 font-bold shadow-lg">
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
          </div>
          
          <div className="text-center mt-6 text-white text-sm font-medium animate-slideInUp" style={{animationDelay: '200ms'}}>
            <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }} className="hover:text-teal-200 transition-colors">
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default SignUpScreen;
