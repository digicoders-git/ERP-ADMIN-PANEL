import React, { useState, useEffect } from 'react';
import { FaUpload, FaImage } from 'react-icons/fa';

export default function BrandingSettings({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    logo: null,
    logoPreview: null,
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    fontFamily: 'Inter'
  });

  useEffect(() => {
    if (data) {
      setFormData(prev => ({
        ...prev,
        ...data,
        logoPreview: data.logo
      }));
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    if (formData.logo instanceof File) {
      submitData.append('logo', formData.logo);
    }
    submitData.append('schoolName', formData.schoolName);
    submitData.append('address', formData.address);
    submitData.append('phone', formData.phone);
    submitData.append('email', formData.email);
    submitData.append('website', formData.website);
    submitData.append('primaryColor', formData.primaryColor);
    submitData.append('secondaryColor', formData.secondaryColor);
    submitData.append('accentColor', formData.accentColor);
    submitData.append('fontFamily', formData.fontFamily);

    onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Logo Section */}
      <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 bg-blue-50">
        <div className="flex items-center gap-8">
          <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            {formData.logoPreview ? (
              <img src={formData.logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <FaImage className="text-4xl text-gray-300" />
            )}
          </div>
          <div className="flex-1">
            <label className="block">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium">
                <FaUpload /> Choose Logo
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-600 mt-2">JPG, PNG • Max 5MB</p>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">School Name *</label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            placeholder="Enter school name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter complete address"
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
          />
        </div>
      </div>

      {/* Color Scheme */}
      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Color Scheme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleColorChange}
                className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-300"
              />
              <div>
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleColorChange}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Main brand color</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleColorChange}
                className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-300"
              />
              <div>
                <input
                  type="text"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleColorChange}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Secondary color</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleColorChange}
                className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-300"
              />
              <div>
                <input
                  type="text"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleColorChange}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Accent color</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Font Family */}
      <div className="border-t-2 pt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
        <select
          name="fontFamily"
          value={formData.fontFamily}
          onChange={handleInputChange}
          className="w-full md:w-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>

      {/* Preview */}
      <div className="border-t-2 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Preview */}
          <div
            style={{
              backgroundColor: formData.primaryColor,
              fontFamily: formData.fontFamily
            }}
            className="p-6 rounded-xl text-white shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              {formData.logoPreview && (
                <img src={formData.logoPreview} alt="Logo" className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div>
                <h2 className="text-2xl font-bold">{formData.schoolName || 'School Name'}</h2>
                <p className="text-sm opacity-90">{formData.address || 'School Address'}</p>
              </div>
            </div>
            <div className="border-t border-white/30 pt-4">
              <p className="text-xs opacity-75 mb-3">Contact: {formData.email || 'email@school.com'} | {formData.phone || '+91 XXXXXXXXXX'}</p>
              <div className="flex gap-2">
                <div
                  style={{ backgroundColor: formData.secondaryColor }}
                  className="px-3 py-1 rounded text-xs font-medium"
                >
                  Secondary
                </div>
                <div
                  style={{ backgroundColor: formData.accentColor }}
                  className="px-3 py-1 rounded text-xs font-medium"
                >
                  Accent
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4">Color Palette</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: formData.primaryColor }}
                  className="w-12 h-12 rounded-lg shadow"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">Primary</p>
                  <p className="text-xs text-gray-500">{formData.primaryColor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: formData.secondaryColor }}
                  className="w-12 h-12 rounded-lg shadow"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">Secondary</p>
                  <p className="text-xs text-gray-500">{formData.secondaryColor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: formData.accentColor }}
                  className="w-12 h-12 rounded-lg shadow"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">Accent</p>
                  <p className="text-xs text-gray-500">{formData.accentColor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 border-t-2 pt-8">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Branding'}
        </button>
      </div>
    </form>
  );
}
