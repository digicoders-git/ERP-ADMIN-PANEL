import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function StudentConfiguration({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    idFormat: 'STU-YYYY-0001',
    rollNumberFormat: 'CLASS-SECTION-0001',
    displayFields: ['name', 'email', 'phone', 'fatherName', 'motherName', 'dob', 'gender', 'address'],
    customFields: [],
    idCardFields: ['name', 'id', 'photo', 'rollNumber', 'class']
  });

  useEffect(() => {
    if (data) setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      displayFields: prev.displayFields.includes(field)
        ? prev.displayFields.filter(f => f !== field)
        : [...prev.displayFields, field]
    }));
  };

  const handleAddCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { fieldName: '', fieldType: 'text', required: false, order: prev.customFields.length }]
    }));
  };

  const handleRemoveCustomField = (index) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const handleCustomFieldChange = (index, key, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map((field, i) => i === index ? { ...field, [key]: value } : field)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ID Format</label>
          <input
            type="text"
            name="idFormat"
            value={formData.idFormat}
            onChange={handleInputChange}
            placeholder="e.g., STU-YYYY-0001"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500 mt-1">Use YYYY for year, 0001 for auto-increment</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number Format</label>
          <input
            type="text"
            name="rollNumberFormat"
            value={formData.rollNumberFormat}
            onChange={handleInputChange}
            placeholder="e.g., CLASS-SECTION-0001"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500 mt-1">Format for roll number generation</p>
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Display Fields</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['name', 'email', 'phone', 'fatherName', 'motherName', 'dob', 'gender', 'address'].map(field => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.displayFields.includes(field)}
                onChange={() => handleFieldToggle(field)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Custom Fields</h3>
          <button
            type="button"
            onClick={handleAddCustomField}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add Field
          </button>
        </div>
        <div className="space-y-3">
          {formData.customFields.map((field, index) => (
            <div key={index} className="flex gap-3 items-end">
              <input
                type="text"
                placeholder="Field Name"
                value={field.fieldName}
                onChange={(e) => handleCustomFieldChange(index, 'fieldName', e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg"
              />
              <select
                value={field.fieldType}
                onChange={(e) => handleCustomFieldChange(index, 'fieldType', e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => handleCustomFieldChange(index, 'required', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Required</span>
              </label>
              <button
                type="button"
                onClick={() => handleRemoveCustomField(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t-2 pt-8">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
