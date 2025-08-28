import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const EmailPreferences = () => {
  const [preferences, setPreferences] = useState({
    welcomeEmail: true,
    connectionRequests: true,
    loginSuggestions: true,
    marketingEmails: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/email-preferences`, {
        withCredentials: true
      });
      if (response.data.success) {
        setPreferences(response.data.emailPreferences || {
          welcomeEmail: true,
          connectionRequests: true,
          loginSuggestions: true,
          marketingEmails: false
        });
      }
    } catch (error) {
      console.error('Error fetching email preferences:', error);
      setMessage('Error loading preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await axios.patch(`${BASE_URL}/email-preferences`, preferences, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setMessage('Preferences saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">
          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          Email Preferences
        </h2>
        
        <p className="text-base-content/70 mb-6">
          Choose which email notifications you'd like to receive from DevConnect.
        </p>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'} mb-4`}>
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Welcome Emails */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <div className="flex flex-col items-start">
                <span className="label-text font-medium">Welcome Emails</span>
                <span className="label-text-alt text-base-content/60">
                  Receive a welcome email when you first sign up
                </span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={preferences.welcomeEmail}
                onChange={() => handleToggle('welcomeEmail')}
              />
            </label>
          </div>

          {/* Connection Request Notifications */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <div className="flex flex-col items-start">
                <span className="label-text font-medium">Connection Requests</span>
                <span className="label-text-alt text-base-content/60">
                  Get notified when someone sends you a connection request
                </span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={preferences.connectionRequests}
                onChange={() => handleToggle('connectionRequests')}
              />
            </label>
          </div>

          {/* Login Suggestion Emails */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <div className="flex flex-col items-start">
                <span className="label-text font-medium">Connection Suggestions</span>
                <span className="label-text-alt text-base-content/60">
                  Receive suggested connections when you log in
                </span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={preferences.loginSuggestions}
                onChange={() => handleToggle('loginSuggestions')}
              />
            </label>
          </div>

          {/* Marketing Emails */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <div className="flex flex-col items-start">
                <span className="label-text font-medium">Marketing & Updates</span>
                <span className="label-text-alt text-base-content/60">
                  Receive updates about new features and platform news
                </span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={preferences.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
              />
            </label>
          </div>
        </div>

        <div className="card-actions justify-end mt-8">
          <button 
            className={`btn btn-primary ${saving ? 'loading' : ''}`}
            onClick={savePreferences}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        <div className="divider my-6"></div>
        
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-medium mb-2">📧 Email Configuration</h3>
          <p className="text-sm text-base-content/70">
            To set up email functionality, configure your email credentials in the backend:
          </p>
          <div className="mockup-code mt-3 text-xs">
            <pre data-prefix="$"><code>EMAIL_USER=your-email@gmail.com</code></pre>
            <pre data-prefix="$"><code>EMAIL_PASS=your-app-password</code></pre>
          </div>
          <p className="text-xs text-base-content/60 mt-2">
            Note: Use Gmail App Passwords for enhanced security
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferences;
