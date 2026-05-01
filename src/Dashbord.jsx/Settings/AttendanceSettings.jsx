// AttendanceSettings.jsx
import React, { useState, useEffect } from 'react';

export default function AttendanceSettings({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    method: 'manual',
    autoMarkRules: { markAbsentAfter: '09:00', markHalfDayAfter: '11:00', markAbsentFinalAfter: '12:00' },
    latePolicy: { lateAfter: '09:15', halfDayAfter: '11:00', absentAfter: '12:00' }
  });

  useEffect(() => {
    if (data) setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  const handleMethodChange = (e) => {
    setFormData(prev => ({ ...prev, method: e.target.value }));
  };

  const handleTimeChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance Method</h3>
        <div className="space-y-3">
          {['manual', 'biometric', 'mobile-app'].map(method => (
            <label key={method} className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:border-blue-500">
              <input
                type="radio"
                name="method"
                value={method}
                checked={formData.method === method}
                onChange={handleMethodChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 capitalize">{method.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Auto-mark Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mark Absent After</label>
            <input
              type="time"
              value={formData.autoMarkRules.markAbsentAfter}
              onChange={(e) => handleTimeChange('autoMarkRules', 'markAbsentAfter', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mark Half Day After</label>
            <input
              type="time"
              value={formData.autoMarkRules.markHalfDayAfter}
              onChange={(e) => handleTimeChange('autoMarkRules', 'markHalfDayAfter', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mark Absent Final After</label>
            <input
              type="time"
              value={formData.autoMarkRules.markAbsentFinalAfter}
              onChange={(e) => handleTimeChange('autoMarkRules', 'markAbsentFinalAfter', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Late Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Late After</label>
            <input
              type="time"
              value={formData.latePolicy.lateAfter}
              onChange={(e) => handleTimeChange('latePolicy', 'lateAfter', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Half Day After</label>
            <input
              type="time"
              value={formData.latePolicy.halfDayAfter}
              onChange={(e) => handleTimeChange('latePolicy', 'halfDayAfter', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Absent After</label>
            <input
              type="time"
              value={formData.latePolicy.absentAfter}
              onChange={(e) => handleTimeChange('latePolicy', 'absentAfter', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
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
