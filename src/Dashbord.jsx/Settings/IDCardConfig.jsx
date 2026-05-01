import React, { useState, useEffect, useRef } from 'react';
import {
  FaUpload, FaMousePointer, FaTextHeight,
  FaSave, FaEye, FaCheck, FaTimes,
  FaBold, FaBorderAll, FaIdCard, FaSpinner
} from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const FIELDS_BY_ROLE = {
  student: [
    { id: 'student_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'student_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'admission_no', label: 'Adm No', type: 'text', placeholder: '[ ADM NO ]' },
    { id: 'roll_no', label: 'Roll No', type: 'text', placeholder: '[ ROLL NO ]' },
    { id: 'class_section', label: 'Class/Sec', type: 'text', placeholder: '[ CLASS/SEC ]' },
    { id: 'dob', label: 'DOB', type: 'text', placeholder: '[ DD/MM/YYYY ]' },
    { id: 'blood_group', label: 'Blood Group', type: 'text', placeholder: '[ B+ ]' },
    { id: 'student_phone', label: 'Student Mobile', type: 'text', placeholder: '[ STUDENT MOBILE ]' },
    { id: 'guardian_contact', label: 'Guardian Phone', type: 'text', placeholder: '[ GUARDIAN PHONE ]' },
    { id: 'emergency_contact', label: 'Emergency Contact', type: 'text', placeholder: '[ EMERGENCY CONTACT ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'email', label: 'Email', type: 'text', placeholder: '[ EMAIL ]' },
    { id: 'address', label: 'Address', type: 'text', placeholder: '[ ADDRESS ]' },
    { id: 'father_name', label: 'Father Name', type: 'text', placeholder: '[ FATHER NAME ]' },
    { id: 'mother_name', label: 'Mother Name', type: 'text', placeholder: '[ MOTHER NAME ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' },
    { id: 'qr_code', label: 'QR Code', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STU-1046' }
  ],
  staff: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Emp ID', type: 'text', placeholder: '[ EMP-ID ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'designation', label: 'Desig', type: 'text', placeholder: '[ DESIGNATION ]' },
    { id: 'department', label: 'Dept', type: 'text', placeholder: '[ DEPT ]' },
    { id: 'staff_phone', label: 'Phone', type: 'text', placeholder: '[ PHONE ]' },
    { id: 'staff_email', label: 'Email', type: 'text', placeholder: '[ EMAIL ]' },
    { id: 'staff_address', label: 'Address', type: 'text', placeholder: '[ ADDRESS ]' },
    { id: 'blood_group', label: 'Blood', type: 'text', placeholder: '[ B+ ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' },
    { id: 'qr_code', label: 'QR', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EMP-1001' }
  ],
  teacher: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Tch ID', type: 'text', placeholder: '[ TCH-ID ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'designation', label: 'Desig', type: 'text', placeholder: '[ TEACHER ]' },
    { id: 'school_name', label: 'School', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' }
  ],
  driver: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Drv ID', type: 'text', placeholder: '[ DRV-ID ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'designation', label: 'Desig', type: 'text', placeholder: '[ DRIVER ]' },
    { id: 'school_name', label: 'School', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' }
  ],
  warden: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Wdn ID', type: 'text', placeholder: '[ WDN-ID ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'designation', label: 'Desig', type: 'text', placeholder: '[ WARDEN ]' },
    { id: 'school_name', label: 'School', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' }
  ],
  librarian: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Lib ID', type: 'text', placeholder: '[ LIB-ID ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'designation', label: 'Desig', type: 'text', placeholder: '[ LIBRARIAN ]' },
    { id: 'school_name', label: 'School', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' }
  ],
  feeadmin: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Fee ID', type: 'text', placeholder: '[ FEE-ID ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'designation', label: 'Desig', type: 'text', placeholder: '[ FEE ADMIN ]' },
    { id: 'school_name', label: 'School', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' }
  ]
};

const ROLE_PANEL_MAP = {
  student: 'parent',
  staff: 'staff',
  teacher: 'teacher',
  driver: 'transport',
  warden: 'warden',
  librarian: 'library',
  feeadmin: 'fee'
};

export default function IDCardConfig({ data, onSave, saving, branchId, purchasedPanels = [] }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedRole, setSelectedRole] = useState('student');
    const [templateUrl, setTemplateUrl] = useState('');
    const [fields, setFields] = useState([]);
    const [design, setDesign] = useState({
      cardWidth: 350,
      cardHeight: 550,
      backgroundColor: '#ffffff'
    });
    const [selectedField, setSelectedField] = useState(null);
    const [showGrid, setShowGrid] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const mapperRef = useRef(null);
  
    const allowedRoles = Object.keys(FIELDS_BY_ROLE).filter(role => {
      const requiredPanel = ROLE_PANEL_MAP[role];
      return purchasedPanels.includes(requiredPanel) || purchasedPanels.includes('school') || purchasedPanels.length === 0; // Added fallback for empty purchasedPanels
    });
  
    useEffect(() => {
      if (allowedRoles.length > 0 && !allowedRoles.includes(selectedRole)) {
        setSelectedRole(allowedRoles[0]);
      }
    }, [purchasedPanels]);
  
    useEffect(() => {
      if (!selectedRole || !FIELDS_BY_ROLE[selectedRole]) return;
      const roleData = data?.[selectedRole] || {};
      setTemplateUrl(roleData.template || '');
      if (roleData.design) setDesign(prev => ({ ...prev, ...roleData.design }));
  
      const availableFields = FIELDS_BY_ROLE[selectedRole];
      const existingFields = roleData.fields || [];
  
      const mergedFields = availableFields.map(af => {
        const existing = (roleData.fields || []).find(f => f.id === af.id);
        return {
          ...af, // Start with defaults from registry (includes label, placeholder, type)
          ...(existing || {}), // Overwrite with saved coordinates/styles
          label: af.label, // HARD OVERRIDE: Always use registry label
          placeholder: af.placeholder, // HARD OVERRIDE
          visible: existing ? existing.visible : false,
          x: existing ? existing.x : 20,
          y: existing ? existing.y : 20,
          fontSize: existing ? existing.fontSize : 14,
          bold: existing ? existing.bold : false,
          color: existing ? existing.color : '#000000',
          width: existing ? existing.width : (af.type === 'image' ? 100 : 200),
          height: existing ? existing.height : (af.type === 'image' ? 120 : 24)
        };
      });
      setFields(mergedFields);
    }, [data, selectedRole]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('template', file);
    formData.append('role', selectedRole);

    try {
      Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await axios.post(`${BASE_URL}/api/client-settings/idcard/upload-template?branchId=${branchId}`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTemplateUrl(res.data.templateUrl);
      Swal.fire('Uploaded!', `${selectedRole.toUpperCase()} template uploaded!`, 'success');
      setActiveTab('design');
    } catch (err) {
      Swal.fire('Error', 'Upload failed', 'error');
    }
  };

  const handleFieldToggle = (id) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
    if (selectedField === id) setSelectedField(null);
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setSelectedField(id);
    setIsDragging(true);

    const field = fields.find(f => f.id === id);
    const rect = mapperRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - field.x,
      y: e.clientY - rect.top - field.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedField) return;

    const rect = mapperRef.current.getBoundingClientRect();
    let newX = e.clientX - rect.left - dragOffset.x;
    let newY = e.clientY - rect.top - dragOffset.y;

    newX = Math.max(0, Math.min(newX, design.cardWidth - 20));
    newY = Math.max(0, Math.min(newY, design.cardHeight - 20));

    setFields(prev => prev.map(f => f.id === selectedField ? { ...f, x: newX, y: newY } : f));
  };

  const handleMouseUp = () => setIsDragging(false);

  const updateFieldProperty = (id, prop, value) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, [prop]: value } : f));
  };

  const currentField = fields.find(f => f.id === selectedField);

  return (
    <div className="bg-white border rounded-xl shadow-xl flex flex-col h-[750px] text-xs overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Role Selection Bar */}
      <div className="bg-slate-50 border-b p-3 flex items-center justify-between">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
          {allowedRoles.map(role => (
            <button
              key={role}
              onClick={() => { setSelectedRole(role); setActiveTab('upload'); }}
              className={`px-4 py-1.5 rounded-md font-black uppercase tracking-widest transition-all ${selectedRole === role ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {role}
            </button>
          ))}
        </div>
        <button
          onClick={() => onSave({ 
            role: selectedRole, 
            template: templateUrl, 
            fields: fields.map(({ placeholder, label, type, ...rest }) => rest),
            design: design
          })}
          disabled={saving || !templateUrl}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-black uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50 shadow-lg shadow-green-200"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? 'Syncing...' : 'Save Configuration'}
        </button>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-8 py-3 font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'upload' ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400'}`}
        >
          1. Template Branding
        </button>
        <button
          onClick={() => setActiveTab('design')}
          disabled={!templateUrl}
          className={`px-8 py-3 font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'design' ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400 disabled:opacity-30'}`}
        >
          2. Logic Mapping
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'upload' ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-10">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
                <FaUpload />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Background Design</h3>
              <p className="text-slate-400 text-xs mb-8">Upload the base design for {selectedRole.toUpperCase()} ID cards. <br/>Recommended Size: 350x500px</p>

              <label className="block w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest cursor-pointer hover:bg-black transition-all shadow-xl shadow-slate-200">
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                Select File
              </label>

              {templateUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3 justify-center">
                  <FaCheck className="text-green-600" />
                  <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Active Template Loaded</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Field List Sidebar */}
            <div className="w-64 border-r bg-slate-50 flex flex-col">
              <div className="p-4 border-b bg-white text-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Attributes</h4>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {fields.map(field => (
                  <button
                    key={field.id}
                    onClick={() => handleFieldToggle(field.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border font-bold transition-all ${field.visible ? 'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                  >
                    <span className="text-left font-bold">{field.label || field.id}</span>
                    {field.visible && <FaCheck size={10} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-slate-200 flex items-center justify-center relative p-8">
              <div
                ref={mapperRef}
                className="relative bg-white shadow-2xl overflow-hidden shrink-0 border-4 border-white rounded-sm"
                style={{ width: `${design.cardWidth}px`, height: `${design.cardHeight}px`, backgroundImage: `url('${templateUrl}')`, backgroundSize: '100% 100%' }}
              >
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
                )}

                {fields.filter(f => f.visible).map(field => (
                  <div
                    key={field.id}
                    onMouseDown={(e) => handleMouseDown(e, field.id)}
                    className={`absolute cursor-move px-1 select-none ${selectedField === field.id ? 'ring-2 ring-blue-500 bg-blue-50/50 rounded' : ''}`}
                    style={{ top: field.y, left: field.x, color: field.color, fontSize: `${field.fontSize}px`, fontWeight: field.bold ? 'bold' : 'normal', width: field.type === 'image' ? field.width : 'auto', height: field.type === 'image' ? field.height : 'auto' }}
                  >
                    {field.type === 'image' ? (
                      <div className="w-full h-full border-2 border-dashed border-slate-400 flex items-center justify-center bg-slate-50/80 rounded">
                        <img src={field.placeholder} className="w-full h-full object-contain pointer-events-none opacity-40" alt={field.id} />
                      </div>
                    ) : (
                      <span className="whitespace-nowrap">{field.placeholder}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                <button onClick={() => setShowGrid(!showGrid)} className="flex items-center gap-2 hover:text-blue-400 transition-all">
                  <FaBorderAll /> Toggle Grid
                </button>
                <span className="opacity-30">|</span>
                <span>{design.cardWidth} x {design.cardHeight} px</span>
              </div>
            </div>

            {/* Property Editor Sidebar */}
            <div className={`w-72 border-l bg-white transition-all ${selectedField ? 'translate-x-0 shadow-2xl' : 'translate-x-full absolute right-0'}`}>
              {currentField ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate mr-2">{currentField.label} Settings</span>
                    <button onClick={() => setSelectedField(null)} className="hover:text-red-400 transition-colors"><FaTimes size={14} /></button>
                  </div>
                  <div className="p-5 space-y-8 overflow-y-auto">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensions</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">X Axis</p>
                          <input type="number" value={Math.round(currentField.x)} onChange={(e) => updateFieldProperty(currentField.id, 'x', parseInt(e.target.value))} className="w-full border rounded-lg p-2.5 font-black text-xs bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Y Axis</p>
                          <input type="number" value={Math.round(currentField.y)} onChange={(e) => updateFieldProperty(currentField.id, 'y', parseInt(e.target.value))} className="w-full border rounded-lg p-2.5 font-black text-xs bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        {currentField.type === 'image' && (
                          <>
                            <div className="space-y-1">
                              <p className="text-[9px] text-slate-500 font-bold uppercase">Width</p>
                              <input type="number" value={currentField.width} onChange={(e) => updateFieldProperty(currentField.id, 'width', parseInt(e.target.value))} className="w-full border rounded-lg p-2.5 font-black text-xs bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] text-slate-500 font-bold uppercase">Height</p>
                              <input type="number" value={currentField.height} onChange={(e) => updateFieldProperty(currentField.id, 'height', parseInt(e.target.value))} className="w-full border rounded-lg p-2.5 font-black text-xs bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {currentField.type === 'text' && (
                      <div className="space-y-6 pt-6 border-t">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typography & Color</label>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="text-[9px] text-slate-500 font-bold uppercase">Scale</p>
                              <span className="text-xs font-black text-blue-600">{currentField.fontSize}px</span>
                            </div>
                            <input type="range" min="8" max="40" value={currentField.fontSize} onChange={(e) => updateFieldProperty(currentField.id, 'fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                          </div>
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Text Color</span>
                            <input type="color" value={currentField.color} onChange={(e) => updateFieldProperty(currentField.id, 'color', e.target.value)} className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" />
                          </div>
                          <button onClick={() => updateFieldProperty(currentField.id, 'bold', !currentField.bold)} className={`w-full py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${currentField.bold ? 'bg-blue-600 text-white border-blue-700 shadow-lg' : 'bg-white text-slate-500 border-slate-200'}`}>
                            {currentField.bold ? 'Bold Active' : 'Apply Bold'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-10 text-center text-slate-300">
                  <div className="space-y-2">
                    <FaMousePointer className="mx-auto text-xl opacity-20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Select an attribute <br/> to customize</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
