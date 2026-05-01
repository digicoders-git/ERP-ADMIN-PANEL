import React, { useState, useEffect } from 'react';
import { FaUpload, FaImage, FaCheck, FaTrash, FaArrowsAlt, FaFont, FaFillDrip } from 'react-icons/fa';
import api from '../../api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const DEFAULT_FIELDS = [
  { id: 'student_name', label: 'Student Name', x: 50, y: 50, fontSize: 16, bold: true, color: '#000000', visible: true },
  { id: 'roll_no', label: 'Roll Number', x: 50, y: 80, fontSize: 14, bold: false, color: '#000000', visible: true },
  { id: 'class_section', label: 'Class & Section', x: 50, y: 110, fontSize: 14, bold: false, color: '#000000', visible: true },
  { id: 'receipt_no', label: 'Receipt No', x: 600, y: 50, fontSize: 14, bold: true, color: '#000000', visible: true },
  { id: 'date', label: 'Date', x: 600, y: 80, fontSize: 14, bold: false, color: '#000000', visible: true },
  { id: 'total_amount', label: 'Total Amount', x: 600, y: 350, fontSize: 18, bold: true, color: '#000000', visible: true },
  { id: 'amount_in_words', label: 'Amount in Words', x: 50, y: 350, fontSize: 12, bold: false, color: '#000000', visible: true },
];

export default function FeeSlipDesign({ data, onSave, saving, branchId }) {
  const [formData, setFormData] = useState({
    template: 'custom',
    backgroundImage: '',
    cardWidth: 800,
    cardHeight: 400,
    fields: DEFAULT_FIELDS
  });
  const [uploading, setUploading] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    if (data) {
        setFormData(prev => ({
            ...prev,
            ...data,
            fields: data.fields?.length > 0 ? data.fields : DEFAULT_FIELDS
        }));
    }
  }, [data]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('template', file);

    try {
      const res = await api.post(`/api/client-settings/feeslip/upload-template?branchId=${branchId}`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData(prev => ({ ...prev, backgroundImage: res.data.templateUrl }));
        toast.success('Background uploaded successfully');
      }
    } catch (err) {
      toast.error('Failed to upload background');
    } finally {
      setUploading(false);
    }
  };

  const handleFieldUpdate = (id, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const handleDrag = (id, e) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    // Constraints
    const boundedX = Math.max(0, Math.min(x, formData.cardWidth - 50));
    const boundedY = Math.max(0, Math.min(y, formData.cardHeight - 20));

    handleFieldUpdate(id, { x: boundedX, y: boundedY });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Fee Slip Visual Designer (Admin)</h2>
          <p className="text-blue-100 opacity-90">Upload your physical fee slip scan and position data fields precisely.</p>
        </div>
        <FaFillDrip className="absolute -right-10 -bottom-10 text-white/10 text-[200px] rotate-12" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Controls */}
        <div className="xl:col-span-1 space-y-6">
          {/* Template Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaImage className="text-blue-600" /> Background Template
            </h3>
            
            {formData.backgroundImage ? (
              <div className="space-y-4">
                <div className="relative group rounded-xl overflow-hidden border-2 border-blue-100">
                  <img src={formData.backgroundImage.startsWith('http') ? formData.backgroundImage : `${BASE_URL}${formData.backgroundImage}`} alt="Template" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => setFormData(prev => ({ ...prev, backgroundImage: '' }))} className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Width (px)</label>
                    <input type="number" value={formData.cardWidth} onChange={e => setFormData(prev => ({ ...prev, cardWidth: parseInt(e.target.value) }))} className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Height (px)</label>
                    <input type="number" value={formData.cardHeight} onChange={e => setFormData(prev => ({ ...prev, cardHeight: parseInt(e.target.value) }))} className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-bold" />
                  </div>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all block group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FaUpload className="text-blue-600 text-2xl" />
                </div>
                <p className="font-bold text-gray-900">Upload Slip Scan</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            )}
          </div>

          {/* Fields List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 pb-2">
                <FaFont className="text-blue-600" /> Data Fields
            </h3>
            <div className="space-y-3">
              {formData.fields.map(field => (
                <div 
                  key={field.id} 
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedField === field.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                  onClick={() => setSelectedField(field.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800 text-sm">{field.label}</span>
                    <input 
                      type="checkbox" 
                      checked={field.visible} 
                      onChange={e => handleFieldUpdate(field.id, { visible: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </div>
                  {selectedField === field.id && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-100 animate-slideDown">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Font Size</label>
                        <input type="number" value={field.fontSize} onChange={e => handleFieldUpdate(field.id, { fontSize: parseInt(e.target.value) })} className="w-full bg-white border-none rounded px-2 py-1 text-xs font-bold" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Color</label>
                        <input type="color" value={field.color} onChange={e => handleFieldUpdate(field.id, { color: e.target.value })} className="w-full h-6 rounded border-none cursor-pointer p-0" />
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input type="checkbox" checked={field.bold} onChange={e => handleFieldUpdate(field.id, { bold: e.target.checked })} className="rounded" />
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Bold Text</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Live Layout Preview</h3>
                    <p className="text-sm text-gray-500">Drag fields to position them exactly where you want them to print.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Canvas: {formData.cardWidth}x{formData.cardHeight}px</div>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-auto p-8 flex items-start justify-center">
              <div 
                className="relative bg-white shadow-2xl border border-gray-200 overflow-hidden"
                style={{ 
                  width: formData.cardWidth, 
                  height: formData.cardHeight,
                  backgroundImage: formData.backgroundImage ? `url(${formData.backgroundImage.startsWith('http') ? formData.backgroundImage : BASE_URL + formData.backgroundImage})` : 'none',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {!formData.backgroundImage && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none uppercase font-black text-4xl rotate-12">No Template Uploaded</div>
                )}
                
                {formData.fields.filter(f => f.visible).map(field => (
                  <div
                    key={field.id}
                    draggable
                    onDragEnd={(e) => handleDrag(field.id, e)}
                    onClick={() => setSelectedField(field.id)}
                    className={`absolute cursor-move select-none whitespace-nowrap p-1 rounded hover:bg-blue-50/50 hover:ring-2 hover:ring-blue-400 group transition-all ${selectedField === field.id ? 'ring-2 ring-blue-500 bg-blue-50/80 z-20 shadow-lg' : 'z-10'}`}
                    style={{
                      left: field.x,
                      top: field.y,
                      fontSize: `${field.fontSize}px`,
                      fontWeight: field.bold ? 'bold' : 'normal',
                      color: field.color,
                      border: selectedField === field.id ? '1px solid #3b82f6' : '1px dashed transparent'
                    }}
                  >
                    {field.label}
                    {selectedField === field.id && (
                        <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
                            <FaArrowsAlt /> {field.x}, {field.y}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t pt-8">
              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={saving}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all font-bold shadow-lg shadow-blue-200 disabled:opacity-60 flex items-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <FaCheck /> {saving ? 'Applying...' : 'Save & Deploy Design'}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600 text-xl"><FaImage /></div>
            <div>
                <h4 className="font-bold text-amber-900 mb-1 tracking-tight">Pro-Tip for Designers</h4>
                <p className="text-sm text-amber-800 leading-relaxed opacity-90">For best results, scan your fee slip at 300 DPI and crop it to the exact edges. Use a PNG format to preserve details. The fields you position here will be overlaid during the print process on the real data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
