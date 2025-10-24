import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, LockIcon, HomeIcon, UserPlusIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.password || !formData.fullName || !formData.address) {
      setError('All fields are required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    try {
      const success = await signup(formData);
      if (success) {
        navigate('/');
      } else {
        setError('Username already exists');
      }
    } catch (err) {
      setError('An error occurred during sign up');
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
        React.createElement('h2', { className: 'text-3xl font-extrabold text-gray-900' }, 'Create your account'),
        React.createElement(
          'p',
          { className: 'mt-2 text-sm text-gray-600' },
          'Already have an account? ',
          React.createElement(
            Link,
            { to: '/login', className: 'font-medium text-blue-600 hover:text-blue-500' },
            'Sign in'
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
      // Sign Up Form
      React.createElement(
        'form',
        { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
        React.createElement(
          'div',
          { className: 'space-y-4' },
          // Full Name
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'fullName', className: 'block text-sm font-medium text-gray-700' },
              'Full Name'
            ),
            React.createElement(
              'div',
              { className: 'mt-1 relative' },
              React.createElement(
                'div',
                { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                React.createElement(UserPlusIcon, { className: 'h-5 w-5 text-gray-400' })
              ),
              React.createElement('input', {
                id: 'fullName',
                name: 'fullName',
                type: 'text',
                autoComplete: 'name',
                required: true,
                value: formData.fullName,
                onChange: handleChange,
                className: 'pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                placeholder: 'John Doe'
              })
            )
          ),
          // Address
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'address', className: 'block text-sm font-medium text-gray-700' },
              'Address'
            ),
            React.createElement(
              'div',
              { className: 'mt-1 relative' },
              React.createElement(
                'div',
                { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                React.createElement(HomeIcon, { className: 'h-5 w-5 text-gray-400' })
              ),
              React.createElement('textarea', {
                id: 'address',
                name: 'address',
                required: true,
                value: formData.address,
                onChange: handleChange,
                rows: 2,
                className: 'pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                placeholder: '123 Main St, City, Country'
              })
            )
          ),
          // Username
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
                value: formData.username,
                onChange: handleChange,
                className: 'pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                placeholder: 'johndoe'
              })
            )
          ),
          // Password
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
                autoComplete: 'new-password',
                required: true,
                value: formData.password,
                onChange: handleChange,
                className: 'pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                placeholder: 'Password (min 6 characters)'
              })
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
            isLoading ? 'Creating account...' : 'Sign up'
          )
        )
      )
    )
  );
};

export default SignUp;