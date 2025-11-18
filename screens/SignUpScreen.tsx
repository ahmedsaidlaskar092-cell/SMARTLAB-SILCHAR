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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-primary to-secondary">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <Icon name="logo" className="w-24 h-24 mx-auto text-white" />
            <h1 className="text-4xl font-bold text-white mt-4">Create Account</h1>
            <p className="text-accent mt-2">Join SMARTLAB AI</p>
          </div>
          
          <div className="space-y-4">
            <Input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              disabled={loading}
              aria-label="Full Name"
            />
             <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
              aria-label="Email"
            />
            <Input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
              aria-label="Address"
            />
            <Input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-label="Password"
            />
            <Input 
              type="password" 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              aria-label="Confirm Password"
            />
          </div>

          {error && <p className="text-red-300 text-center mt-4">{error}</p>}
          
          <div className="mt-8">
            <Button fullWidth onClick={handleSignUp} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
          
          <div className="text-center mt-6 text-white text-sm">
            <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }} className="hover:underline">
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default SignUpScreen;