import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ROLE_CONFIGS = {
  student: {
    label: 'Student ID Card',
    headerColor: '#1e40af',
    accentColor: '#2563eb',
    fields: [
      { id: 'schoolLogo', label: 'School Logo', visible: true, position: 1, section: 'header' },
      { id: 'schoolName', label: 'School Name', visible: true, position: 2, fontSize: 14, bold: true, section: 'header' },
      { id: 'studentPhoto', label: 'Student Photo', visible: true, position: 3, section: 'body' },
      { id: 'studentName', label: 'Student Name', visible: true, position: 4, fontSize: 13, bold: true, section: 'body' },
      { id: 'rollNumber', label: 'Roll Number', visible: true, position: 5, fontSize: 11, bold: false, section: 'body' },
      { id: 'class', label: 'Class', visible: true, position: 6, fontSize: 11, bold: false, section: 'body' },
      { id: 'section', label: 'Section', visible: true, position: 7, fontSize: 11, bold: false, section: 'body' },
      { id: 'fatherName', label: 'Father Name', visible: true, position: 8, fontSize: 10, bold: false, section: 'body' },
      { id: 'dob', label: 'Date of Birth', visible: true, position: 9, fontSize: 10, bold: false, section: 'body' },
      { id: 'bloodGroup', label: 'Blood Group', visible: true, position: 10, fontSize: 10, bold: false, section: 'body' },
      { id: 'issueDate', label: 'Issue Date', visible: true, position: 11, fontSize: 9, bold: false, section: 'footer' },
      { id: 'principalSign', label: 'Principal Signature', visible: true, position: 12, section: 'footer' }
    ]
  },
  staff: {
    label: 'Staff ID Card',
    headerColor: '#059669',
    accentColor: '#10b981',
    fields: [
      { id: 'schoolLogo', label: 'School Logo', visible: true, position: 1, section: 'header' },
      { id: 'schoolName', label: 'School Name', visible: true, position: 2, fontSize: 14, bold: true, section: 'header' },
      { id: 'staffPhoto', label: 'Staff Photo', visible: true, position: 3, section: 'body' },
      { id: 'staffName', label: 'Staff Name', visible: true, position: 4, fontSize: 13, bold: true, section: 'body' },
      { id: 'staffId', label: 'Staff ID', visible: true, position: 5, fontSize: 11, bold: false, section: 'body' },
      { id: 'designation', label: 'Designation', visible: true, position: 6, fontSize: 11, bold: false, section: 'body' },
      { id: 'department', label: 'Department', visible: true, position: 7, fontSize: 11, bold: false, section: 'body' },
      { id: 'email', label: 'Email', visible: true, position: 8, fontSize: 10, bold: false, section: 'body' },
      { id: 'phone', label: 'Phone', visible: true, position: 9, fontSize: 10, bold: false, section: 'body' },
      { id: 'issueDate', label: 'Issue Date', visible: true, position: 10, fontSize: 9, bold: false, section: 'footer' },
      { id: 'principalSign', label: 'Principal Signature', visible: true, position: 11, section: 'footer' }
    ]
  },
  teacher: {
    label: 'Teacher ID Card',
    headerColor: '#7c3aed',
    accentColor: '#a855f7',
    fields: [
      { id: 'schoolLogo', label: 'School Logo', visible: true, position: 1, section: 'header' },
      { id: 'schoolName', label: 'School Name', visible: true, position: 2, fontSize: 14, bold: true, section: 'header' },
      { id: 'teacherPhoto', label: 'Teacher Photo', visible: true, position: 3, section: 'body' },
      { id: 'teacherName', label: 'Teacher Name', visible: true, position: 4, fontSize: 13, bold: true, section: 'body' },
      { id: 'teacherId', label: 'Teacher ID', visible: true, position: 5, fontSize: 11, bold: false, section: 'body' },
      { id: 'subject', label: 'Subject', visible: true, position: 6, fontSize: 11, bold: false, section: 'body' },
      { id: 'qualification', label: 'Qualification', visible: true, position: 7, fontSize: 11, bold: false, section: 'body' },
      { id: 'email', label: 'Email', visible: true, position: 8, fontSize: 10, bold: false, section: 'body' },
      { id: 'phone', label: 'Phone', visible: true, position: 9, fontSize: 10, bold: false, section: 'body' },
      { id: 'issueDate', label: 'Issue Date', visible: true, position: 10, fontSize: 9, bold: false, section: 'footer' },
      { id: 'principalSign', label: 'Principal Signature', visible: true, position: 11, section: 'footer' }
    ]
  },
  driver: {
    label: 'Driver ID Card',
    headerColor: '#dc2626',
    accentColor: '#ef4444',
    fields: [
      { id: 'schoolLogo', label: 'School Logo', visible: true, position: 1, section: 'header' },
      { id: 'schoolName', label: 'School Name', visible: true, position: 2, fontSize: 14, bold: true, section: 'header' },
      { id: 'driverPhoto', label: 'Driver Photo', visible: true, position: 3, section: 'body' },
      { id: 'driverName', label: 'Driver Name', visible: true, position: 4, fontSize: 13, bold: true, section: 'body' },
      { id: 'driverId', label: 'Driver ID', visible: true, position: 5, fontSize: 11, bold: false, section: 'body' },
      { id: 'licenseNumber', label: 'License Number', visible: true, position: 6, fontSize: 11, bold: false, section: 'body' },
      { id: 'vehicleNumber', label: 'Vehicle Number', visible: true, position: 7, fontSize: 11, bold: false, section: 'body' },
      { id: 'phone', label: 'Phone', visible: true, position: 8, fontSize: 10, bold: false, section: 'body' },
      { id: 'issueDate', label: 'Issue Date', visible: true, position: 9, fontSize: 9, bold: false, section: 'footer' },
      { id: 'principalSign', label: 'Principal Signature', visible: true, position: 10, section: 'footer' }
    ]
  },
  warden: {
    label: 'Warden ID Card',
    headerColor: '#0891b2',
    accentColor: '#06b6d4',
    fields: [
      { id: 'schoolLogo', label: 'School Logo', visible: true, position: 1, section: 'header' },
      { id: 'schoolName', label: 'School Name', visible: true, position: 2, fontSize: 14, bold: true, section: 'header' },
      { id: 'wardenPhoto', label: 'Warden Photo', visible: true, position: 3, section: 'body' },
      { id: 'wardenName', label: 'Warden Name', visible: true, position: 4, fontSize: 13, bold: true, section: 'body' },
      { id: 'wardenId', label: 'Warden ID', visible: true, position: 5, fontSize: 11, bold: false, section: 'body' },
      { id: 'hostelName', label: 'Hostel Name', visible: true, position: 6, fontSize: 11, bold: false, section: 'body' },
      { id: 'designation', label: 'Designation', visible: true, position: 7, fontSize: 11, bold: false, section: 'body' },
      { id: 'email', label: 'Email', visible: true, position: 8, fontSize: 10, bold: false, section: 'body' },
      { id: 'phone', label: 'Phone', visible: true, position: 9, fontSize: 10, bold: false, section: 'body' },
      { id: 'issueDate', label: 'Issue Date', visible: true, position: 10, fontSize: 9, bold: false, section: 'footer' },
      { id: 'principalSign', label: 'Principal Signature', visible: true, position: 11, section: 'footer' }
    ]
  }
};

export default function IDCardDesign({ data, onSave, saving }) {
  const [roleType, setRoleType] = useState('student');
  const [formData, setFormData] = useState({
    template: 'student',
    cardLayout: 'vertical',
    fields: ROLE_CONFIGS.student.fields,
    design: {
      cardWidth: 350,
      cardHeight: 550,
      backgroundColor: '#ffffff',
      headerColor: ROLE_CONFIGS.student.headerColor,
      accentColor: ROLE_CONFIGS.student.accentColor,
      textColor: '#1f2937',
      borderColor: ROLE_CONFIGS.student.headerColor,
      borderWidth: 3,
      borderRadius: 12,
      logoSize: 50,
      photoSize: 120,
      headerHeight: 80
    },
    printSettings: {
      paperSize: 'A4',
      orientation: 'portrait',
      margins: 10,
      cardsPerPage: 4
    }
  });

  useEffect(() => {
    if (data && data[roleType]) {
      setFormData(prev => ({
        ...prev,
        ...data[roleType],
        design: { ...prev.design, ...(data[roleType].design || {}) },
        printSettings: { ...prev.printSettings, ...(data[roleType].printSettings || {}) },
        fields: data[roleType].fields || prev.fields
      }));
    }
  }, [data, roleType]);

  const handleRoleChange = (newRole) => {
    setRoleType(newRole);
    const config = ROLE_CONFIGS[newRole];
    setFormData({
      template: newRole,
      cardLayout: 'vertical',
      fields: config.fields,
      design: {
        cardWidth: 350,
        cardHeight: 550,
        backgroundColor: '#ffffff',
        headerColor: config.headerColor,
        accentColor: config.accentColor,
        textColor: '#1f2937',
        borderColor: config.headerColor,
        borderWidth: 3,
        borderRadius: 12,
        logoSize: 50,
        photoSize: 120,
        headerHeight: 80
      },
      printSettings: {
        paperSize: 'A4',
        orientation: 'portrait',
        margins: 10,
        cardsPerPage: 4
      }
    });
  };

  const handleDesignChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      design: { ...prev.design, [key]: value }
    }));
  };

  const handlePrintSettingChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      printSettings: { ...prev.printSettings, [key]: value }
    }));
  };

  const handleToggleField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => i === index ? { ...field, visible: !field.visible } : field)
    }));
  };

  const handleMoveField = (index, direction) => {
    const newFields = [...formData.fields];
    if (direction === 'up' && index > 0) {
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    }
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldsToSave = formData.fields.map(field => ({
      id: field.id || '',
      label: field.label || '',
      visible: field.visible !== undefined ? field.visible : true,
      position: field.position || 0,
      fontSize: field.fontSize || 11,
      bold: field.bold !== undefined ? field.bold : false,
      section: field.section || 'body',
      format: field.format || ''
    }));

    const dataToSave = {
      roleType: roleType,
      template: formData.template || roleType,
      cardLayout: formData.cardLayout || 'vertical',
      fields: fieldsToSave,
      design: formData.design || {},
      printSettings: formData.printSettings || {}
    };
    onSave(dataToSave);
  };

  const renderPreview = () => {
    const { design, fields } = formData;
    const bodyFields = fields.filter(f => f.visible && f.section === 'body').sort((a, b) => a.position - b.position);

    return (
      <div
        style={{
          width: `${design.cardWidth}px`,
          height: `${design.cardHeight}px`,
          backgroundColor: design.backgroundColor,
          border: `${design.borderWidth}px solid ${design.borderColor}`,
          borderRadius: `${design.borderRadius}px`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <div style={{ backgroundColor: design.headerColor, height: `${design.headerHeight}px`, padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
          <div style={{ width: `${design.logoSize}px`, height: `${design.logoSize}px`, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>LOGO</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2' }}>School Name</div>
            <div style={{ fontSize: '9px', opacity: 0.9 }}>{ROLE_CONFIGS[roleType].label}</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: `${design.photoSize}px`, height: `${design.photoSize}px`, backgroundColor: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6b7280', border: `2px solid ${design.accentColor}`, fontWeight: 'bold' }}>Photo</div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
            {bodyFields.map((field, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: design.accentColor, fontWeight: 'bold', fontSize: `${field.fontSize}px` }}>{field.label}:</span>
                <span style={{ color: design.textColor, fontSize: `${field.fontSize}px`, fontWeight: field.bold ? 'bold' : 'normal' }}>Sample</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${design.accentColor}`, paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px' }}>
            <div style={{ color: design.accentColor, fontWeight: 'bold' }}>Valid 2024-2025</div>
            <div style={{ color: design.textColor }}>Sign</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Role Selector */}
      <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select ID Card Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(ROLE_CONFIGS).map(([role, config]) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleChange(role)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                roleType === role
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {config.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Dimensions */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Card Dimensions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Width (px)</label>
                <input type="number" value={formData.design.cardWidth} onChange={(e) => handleDesignChange('cardWidth', parseInt(e.target.value))} min="250" max="500" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (px)</label>
                <input type="number" value={formData.design.cardHeight} onChange={(e) => handleDesignChange('cardHeight', parseInt(e.target.value))} min="350" max="700" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Header Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={formData.design.headerColor} onChange={(e) => handleDesignChange('headerColor', e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300" />
                  <input type="text" value={formData.design.headerColor} onChange={(e) => handleDesignChange('headerColor', e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={formData.design.accentColor} onChange={(e) => handleDesignChange('accentColor', e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300" />
                  <input type="text" value={formData.design.accentColor} onChange={(e) => handleDesignChange('accentColor', e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Styling */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Card Styling</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Border Width</label>
                <input type="number" value={formData.design.borderWidth} onChange={(e) => handleDesignChange('borderWidth', parseInt(e.target.value))} min="1" max="10" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Border Radius</label>
                <input type="number" value={formData.design.borderRadius} onChange={(e) => handleDesignChange('borderRadius', parseInt(e.target.value))} min="0" max="30" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Size</label>
                <input type="number" value={formData.design.logoSize} onChange={(e) => handleDesignChange('logoSize', parseInt(e.target.value))} min="30" max="80" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo Size</label>
                <input type="number" value={formData.design.photoSize} onChange={(e) => handleDesignChange('photoSize', parseInt(e.target.value))} min="80" max="150" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Fields Configuration */}
          <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Card Fields</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formData.fields.map((field, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                  <input type="checkbox" checked={field.visible} onChange={() => handleToggleField(index)} className="w-5 h-5 rounded cursor-pointer" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">{field.label}</div>
                    <div className="text-xs text-gray-500">{field.section}</div>
                  </div>
                  <button type="button" onClick={() => handleMoveField(index, 'up')} disabled={index === 0} className="p-2 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50">
                    <FaArrowUp size={14} />
                  </button>
                  <button type="button" onClick={() => handleMoveField(index, 'down')} disabled={index === formData.fields.length - 1} className="p-2 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50">
                    <FaArrowDown size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Print Settings */}
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Print Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paper Size</label>
                <select value={formData.printSettings.paperSize} onChange={(e) => handlePrintSettingChange('paperSize', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg">
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Orientation</label>
                <select value={formData.printSettings.orientation} onChange={(e) => handlePrintSettingChange('orientation', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cards Per Page</label>
                <input type="number" value={formData.printSettings.cardsPerPage} onChange={(e) => handlePrintSettingChange('cardsPerPage', parseInt(e.target.value))} min="1" max="12" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Right - Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 border-4 border-gray-300 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Live Preview</h3>
            <div className="flex justify-center overflow-auto max-h-[600px]">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t-4 pt-8">
        <button type="submit" disabled={saving} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-60 shadow-lg">
          {saving ? 'Saving...' : 'Save Design'}
        </button>
      </div>
    </form>
  );
}
