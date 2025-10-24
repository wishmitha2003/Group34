import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use navigate instead of Link
import { ArrowLeft, Bell, Shield, Globe, Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    language: 'English'
  });

  const navigate = useNavigate();

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-8">
            {/* Notifications Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              </div>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Email notifications</span>
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Order updates</span>
                  <input 
                    type="checkbox" 
                    checked={settings.orderUpdates}
                    onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Promotional emails</span>
                  <input 
                    type="checkbox" 
                    checked={settings.promotionalEmails}
                    onChange={(e) => handleSettingChange('promotionalEmails', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Privacy & Security */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Privacy & Security</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2 border-b border-gray-200 last:border-b-0 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2 border-b border-gray-200 last:border-b-0 transition-colors">
                  Two-Factor Authentication
                </button>
                <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2 transition-colors">
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Language */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Language & Region</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <select 
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;