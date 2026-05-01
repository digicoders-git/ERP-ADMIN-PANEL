import React, { useState, useEffect } from 'react';
import { FaUpload, FaImage, FaCheck, FaTrash, FaDownload } from 'react-icons/fa';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function IDCardTemplateUpload({ data, onSave, saving, branchId }) {
  const [formData, setFormData] = useState({
    studentTemplate: null,
    staffTemplate: null,
    teacherTemplate: null,
    driverTemplate: null,
    wardenTemplate: null,
    studentTemplatePreview: null,
    staffTemplatePreview: null,
    teacherTemplatePreview: null,
    driverTemplatePreview: null,
    wardenTemplatePreview: null
  });

  const [uploadingRole, setUploadingRole] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData(prev => ({
        ...prev,
        studentTemplatePreview: data.studentTemplate,
        staffTemplatePreview: data.staffTemplate,
        teacherTemplatePreview: data.teacherTemplate,
        driverTemplatePreview: data.driverTemplate,
        wardenTemplatePreview: data.wardenTemplate
      }));
    }
  }, [data]);

  const handleTemplateUpload = (e, role) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [`${role}Template`]: file,
          [`${role}TemplatePreview`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTemplate = (role) => {
    setFormData(prev => ({
      ...prev,
      [`${role}Template`]: null,
      [`${role}TemplatePreview`]: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();

    if (formData.studentTemplate) submitData.append('studentTemplate', formData.studentTemplate);
    if (formData.staffTemplate) submitData.append('staffTemplate', formData.staffTemplate);
    if (formData.teacherTemplate) submitData.append('teacherTemplate', formData.teacherTemplate);
    if (formData.driverTemplate) submitData.append('driverTemplate', formData.driverTemplate);
    if (formData.wardenTemplate) submitData.append('wardenTemplate', formData.wardenTemplate);
    submitData.append('branchId', branchId);

    onSave(submitData);
  };

  const TemplateCard = ({ role, label, icon: Icon, color }) => (
    <div className={`border-2 border-${color}-200 rounded-2xl p-6 bg-${color}-50`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{label} ID Card Template</h3>
      </div>

      {formData[`${role}TemplatePreview`] ? (
        <div className="space-y-4">
          <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
            <img
              src={formData[`${role}TemplatePreview`]}
              alt={`${label} template`}
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRemoveTemplate(role)}
              className={`flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold flex items-center justify-center gap-2`}
            >
              <FaTrash /> Remove
            </button>
            <label className={`flex-1 px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition font-semibold flex items-center justify-center gap-2 cursor-pointer`}>
              <FaUpload /> Change
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleTemplateUpload(e, role)}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <label className={`border-2 border-dashed border-${color}-300 rounded-xl p-8 text-center cursor-pointer hover:bg-${color}-100 transition`}>
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 bg-${color}-100 rounded-full`}>
              <FaImage className={`text-${color}-600 text-3xl`} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Upload Template</p>
              <p className="text-sm text-gray-600">PNG, JPG • Max 5MB</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleTemplateUpload(e, role)}
            className="hidden"
          />
        </label>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ID Card Templates</h2>
        <p className="text-gray-600">Upload custom ID card templates for each role. These will be used as backgrounds when generating ID cards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TemplateCard role="student" label="Student" icon={FaImage} color="blue" />
        <TemplateCard role="staff" label="Staff" icon={FaImage} color="green" />
        <TemplateCard role="teacher" label="Teacher" icon={FaImage} color="purple" />
        <TemplateCard role="driver" label="Driver" icon={FaImage} color="red" />
        <TemplateCard role="warden" label="Warden" icon={FaImage} color="cyan" />
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-900 mb-2">Template Guidelines</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>✓ Recommended size: 350x550 pixels (ID card aspect ratio)</li>
          <li>✓ Format: PNG or JPG with transparent areas for data fields</li>
          <li>✓ Leave space for: Name, ID, Photo, Contact Info, etc.</li>
          <li>✓ High resolution recommended for better print quality</li>
        </ul>
      </div>

      <div className="flex justify-end gap-3 border-t-2 pt-8">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-60 shadow-lg flex items-center gap-2"
        >
          <FaCheck /> {saving ? 'Saving...' : 'Save Templates'}
        </button>
      </div>
    </form>
  );
}
