import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function AdmissionSettings({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    requiredDocuments: ['Birth Certificate', 'Address Proof', 'Medical Certificate'],
    optionalDocuments: ['Previous School Certificate', 'Transfer Certificate'],
    customFields: [],
    approvalWorkflow: 'manual'
  });

  useEffect(() => {
    if (data) setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  const handleDocumentChange = (type, index, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((doc, i) => i === index ? value : doc)
    }));
  };

  const handleAddDocument = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const handleRemoveDocument = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleAddCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { fieldName: '', fieldType: 'text', required: false }]
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
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Approval Workflow</label>
        <select
          value={formData.approvalWorkflow}
          onChange={(e) => setFormData(prev => ({ ...prev, approvalWorkflow: e.target.value }))}
          className="w-full md:w-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="auto-approve">Auto Approve</option>
          <option value="manual">Manual Review</option>
          <option value="multi-level">Multi-level Approval</option>
        </select>
      </div>

      <div className="border-t-2 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Required Documents</h3>
          <button
            type="button"
            onClick={() => handleAddDocument('requiredDocuments')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add Document
          </button>
        </div>
        <div className="space-y-3">
          {formData.requiredDocuments.map((doc, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={doc}
                onChange={(e) => handleDocumentChange('requiredDocuments', index, e.target.value)}
                placeholder="Document name"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveDocument('requiredDocuments', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Optional Documents</h3>
          <button
            type="button"
            onClick={() => handleAddDocument('optionalDocuments')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add Document
          </button>
        </div>
        <div className="space-y-3">
          {formData.optionalDocuments.map((doc, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={doc}
                onChange={(e) => handleDocumentChange('optionalDocuments', index, e.target.value)}
                placeholder="Document name"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveDocument('optionalDocuments', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
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
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
