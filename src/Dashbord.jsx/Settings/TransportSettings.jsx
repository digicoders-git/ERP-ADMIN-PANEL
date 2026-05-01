import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function TransportSettings({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    trackingMethod: 'manual',
    alertSettings: {
      delayAlert: 15,
      breakdownAlert: true,
      customAlerts: []
    },
    routeCustomization: {
      allowCustomRoutes: true,
      allowCustomStops: true,
      allowCustomTimings: true
    }
  });

  useEffect(() => {
    if (data) setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  const handleTrackingMethodChange = (e) => {
    setFormData(prev => ({ ...prev, trackingMethod: e.target.value }));
  };

  const handleAlertSettingChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      alertSettings: { ...prev.alertSettings, [key]: value }
    }));
  };

  const handleRouteCustomizationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      routeCustomization: { ...prev.routeCustomization, [key]: value }
    }));
  };

  const handleAddCustomAlert = () => {
    setFormData(prev => ({
      ...prev,
      alertSettings: {
        ...prev.alertSettings,
        customAlerts: [...prev.alertSettings.customAlerts, '']
      }
    }));
  };

  const handleRemoveCustomAlert = (index) => {
    setFormData(prev => ({
      ...prev,
      alertSettings: {
        ...prev.alertSettings,
        customAlerts: prev.alertSettings.customAlerts.filter((_, i) => i !== index)
      }
    }));
  };

  const handleCustomAlertChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      alertSettings: {
        ...prev.alertSettings,
        customAlerts: prev.alertSettings.customAlerts.map((alert, i) => i === index ? value : alert)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking Method</h3>
        <div className="space-y-3">
          {['gps', 'driver-app', 'manual'].map(method => (
            <label key={method} className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:border-blue-500">
              <input
                type="radio"
                name="trackingMethod"
                value={method}
                checked={formData.trackingMethod === method}
                onChange={handleTrackingMethodChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 capitalize">{method.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Delay Alert (minutes)</label>
            <input
              type="number"
              value={formData.alertSettings.delayAlert}
              onChange={(e) => handleAlertSettingChange('delayAlert', parseInt(e.target.value))}
              min="5"
              max="60"
              className="w-full md:w-64 px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-1">Alert if vehicle is delayed by this many minutes</p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.alertSettings.breakdownAlert}
              onChange={(e) => handleAlertSettingChange('breakdownAlert', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Enable Breakdown Alerts</span>
          </label>
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Custom Alerts</h3>
          <button
            type="button"
            onClick={handleAddCustomAlert}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add Alert
          </button>
        </div>
        <div className="space-y-3">
          {formData.alertSettings.customAlerts.map((alert, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={alert}
                onChange={(e) => handleCustomAlertChange(index, e.target.value)}
                placeholder="Alert message"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveCustomAlert(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Route Customization</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.routeCustomization.allowCustomRoutes}
              onChange={(e) => handleRouteCustomizationChange('allowCustomRoutes', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Allow Custom Routes</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.routeCustomization.allowCustomStops}
              onChange={(e) => handleRouteCustomizationChange('allowCustomStops', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Allow Custom Stops</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.routeCustomization.allowCustomTimings}
              onChange={(e) => handleRouteCustomizationChange('allowCustomTimings', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Allow Custom Timings</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t-2 pt-8">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
