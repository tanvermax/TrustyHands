// Settings.jsx
import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
    // Call API to save settings here
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="max-w-3xl bg-white p-6 rounded-xl shadow-lg space-y-6">
        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between mb-2">
            <label>Email Notifications</label>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between">
            <label>SMS Notifications</label>
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* Account Management */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">
            Change Password
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete Account
          </button>
        </div>

        <div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
