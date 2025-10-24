import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { CameraIcon, UserIcon, XIcon } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, updateProfilePicture } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    username: user?.username || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || '');
  const fileInputRef = useRef(null);
  const passwordSectionRef = useRef(null);

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        username: user?.username || ''
      });
    }
    setIsEditing(!isEditing);
    setMessage('');
  };

  const handlePasswordEditToggle = () => {
    if (isEditingPassword) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditingPassword(false);
    } else {
      setIsEditingPassword(true);
      // Scroll to password section after a small delay to ensure it's rendered
      setTimeout(() => {
        passwordSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
    setMessage('');
  };

  const handlePictureEditToggle = () => {
    setIsEditingPicture(!isEditingPicture);
    setMessage('');
    setImagePreview(user?.profilePicture || '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (imagePreview) {
        await updateProfilePicture(imagePreview);
        setMessage('Profile picture updated successfully!');
      } else {
        // Remove profile picture
        await updateProfilePicture(null);
        setMessage('Profile picture removed successfully!');
      }
      
      setIsEditingPicture(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile picture. Please try again.');
      console.error('Profile picture update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (!formData.name.trim()) {
        setMessage('Name is required');
        return;
      }

      if (!formData.email.trim()) {
        setMessage('Email is required');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage('Please enter a valid email address');
        return;
      }

      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (!passwordData.currentPassword) {
        setMessage('Current password is required');
        return;
      }

      if (!passwordData.newPassword) {
        setMessage('New password is required');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setMessage('New password must be at least 6 characters long');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage('New passwords do not match');
        return;
      }

      const usersString = localStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      const currentUserIndex = users.findIndex(u => u.username === user.username);
      
      if (currentUserIndex !== -1) {
        if (users[currentUserIndex].password !== passwordData.currentPassword) {
          setMessage('Current password is incorrect');
          return;
        }
        
        users[currentUserIndex].password = passwordData.newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        setMessage('Password updated successfully!');
        setIsEditingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('User not found');
      }
    } catch (error) {
      setMessage('Failed to update password. Please try again.');
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          {/* Profile Header with Action Buttons */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <button
                    onClick={handlePictureEditToggle}
                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    title="Change profile picture"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.name || user?.username || 'User'}
                  </h1>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Member since {user?.joinDate || '2024'}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons - Moved to Top */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={handlePasswordEditToggle}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {isEditingPassword ? 'Cancel Password Change' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            {isEditing ? (
              // Edit Profile Form
              <form onSubmit={handleProfileSubmit}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        disabled
                        title="Username cannot be changed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              // View Profile Mode
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {user?.name || 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {user?.username || 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {user?.phone || 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border min-h-[2.5rem]">
                        {user?.address || 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Type</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {user?.premium ? 'Premium Member' : 'Standard Member'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">8</p>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">4</p>
                      <p className="text-sm text-gray-600">Reviews</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        {isEditingPassword && (
          <div ref={passwordSectionRef} className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength="6"
                    />
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="mt-8 flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Profile Picture Modal */}
        {isEditingPicture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Change Profile Picture</h2>
              </div>
              
              <form onSubmit={handlePictureSubmit}>
                <div className="px-6 py-4">
                  {/* Image Preview */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemovePicture}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* File Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload New Picture
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handlePictureEditToggle}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Picture'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;