import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, LockIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-[80vh] flex items-center justify-center py-12 px-4' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg' },
      // Header
      React.createElement(
        'div',
        { className: 'text-center' },
        React.createElement('h2', { className: 'text-3xl font-extrabold text-gray-900' }, 'Sign in to your account'),
        React.createElement(
          'p',
          { className: 'mt-2 text-sm text-gray-600' },
          'Or ',
          React.createElement(
            Link,
            { to: '/signup', className: 'font-medium text-blue-600 hover:text-blue-500' },
            'create a new account'
          )
        )
      ),
      // Error Message
      error &&
        React.createElement(
          'div',
          { className: 'bg-red-50 border-l-4 border-red-500 p-4 mb-4' },
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement(AlertCircleIcon, { className: 'h-5 w-5 text-red-500 mr-2' }),
            React.createElement('p', { className: 'text-sm text-red-700' }, error)
          )
        ),
      // Login Form
      React.createElement(
        'form',
        { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
        React.createElement(
          'div',
          { className: 'space-y-4' },
          // Username Field
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'username', className: 'block text-sm font-medium text-gray-700' },
              'Username'
            ),
            React.createElement(
              'div',
              { className: 'mt-1 relative' },
              React.createElement(
                'div',
                { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                React.createElement(UserIcon, { className: 'h-5 w-5 text-gray-400' })
              ),
              React.createElement('input', {
                id: 'username',
                name: 'username',
                type: 'text',
                autoComplete: 'username',
                required: true,
                value: username,
                onChange: e => setUsername(e.target.value),
                className: 'pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                placeholder: 'Username'
              })
            ),
            // 👇 EXTRA DETAIL ADDED HERE (new help text)
            React.createElement(
              'p',
              { className: 'mt-1 text-xs text-gray-500' },
              'Enter your username or email'
            )
          ),
          // Password Field
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'password', className: 'block text-sm font-medium text-gray-700' },
              'Password'
            ),
            React.createElement(
              'div',
              { className: 'mt-1 relative' },
              React.createElement(
                'div',
                { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                React.createElement(LockIcon, { className: 'h-5 w-5 text-gray-400' })
              ),
              React.createElement('input', {
                id: 'password',
                name: 'password',
                type: 'password',
                autoComplete: 'current-password',
                required: true,
                value: password,
                onChange: e => setPassword(e.target.value),
                className: 'pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                placeholder: 'Password'
              })
            )
          )
        ),
        // Remember Me & Forgot Password
        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'div',
            { className: 'flex items-center' },
            React.createElement('input', {
              id: 'remember-me',
              name: 'remember-me',
              type: 'checkbox',
              className: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            }),
            React.createElement(
              'label',
              { htmlFor: 'remember-me', className: 'ml-2 block text-sm text-gray-900' },
              'Remember me'
            )
          ),
          React.createElement(
            'div',
            { className: 'text-sm' },
            React.createElement(
              'a',
              { href: '#', className: 'font-medium text-blue-600 hover:text-blue-500' },
              'Forgot your password?'
            )
          )
        ),
        // Submit Button
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: isLoading,
              className: 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400'
            },
            isLoading ? 'Signing in...' : 'Sign in'
          )
        )
      )
    )
  );
};

export default Login;