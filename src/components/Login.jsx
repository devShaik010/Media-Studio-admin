import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiLock } from 'react-icons/fi';
import { supabase } from '../supabase/client';

const Login = () => {
  const [usernameInput, setUsernameInput] = useState(''); // To capture username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let emailToSubmit;
    if (usernameInput.toLowerCase() === 'mfpadmin') {
      emailToSubmit = 'mediafocuspoint1@gmail.com';
    } else {
      // Assume it's an email if not 'mfpadmin'
      emailToSubmit = usernameInput; 
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToSubmit,
        password: password,
      });

      if (error) {
        setError(error.message || 'Invalid credentials');
        throw error;
      }
      
      // AuthContext will handle navigation if login is successful
      // navigate('/'); 

    } catch (err) {
      if (!error) setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Ensure your redirect URL is correctly configured in Supabase
          redirectTo: window.location.origin + '/dashboard', 
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
      
      // AuthContext will handle user state and navigation for Google login too
      // if (data) {
      //   navigate('/dashboard'); 
      // }

    } catch (err) {
      setError('Google sign in failed. Please try again.');
      console.error('Google Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-color)]">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded-lg border border-[var(--border-color)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[var(--primary-color)] mb-2">
              Media Focus Point
            </h1>
            <p className="text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" // Changed back to text
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Username or Email" // Updated placeholder
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-color)] 
                           rounded-lg focus:outline-none focus:border-[var(--primary-color)]
                           text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-color)] 
                           rounded-lg focus:outline-none focus:border-[var(--primary-color)]
                           text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary-color)] text-white py-2.5 rounded-lg
                       font-medium hover:bg-[var(--primary-hover)] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-2.5
                       border border-[var(--border-color)] rounded-lg text-gray-700
                       hover:bg-gray-50 font-medium transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
