import React, { useState, useEffect } from 'react';
import { FaUpload, FaImage, FaTrash, FaEye, FaTimes, FaLink, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../api';
import TemplateMappingManagement from './TemplateMappingManagement';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

export default function MarksheetDesign({ branchId }) {
  const [examTypes, setExamTypes] = useState([]);
  const [templates, setTemplates] = useState({});
  const [uploadingType, setUploadingType] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (branchId) {
      fetchExamTypes();
    }
  }, [branchId]);

  const fetchExamTypes = async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/exam-type?branchId=${branchId}`);
      const data = res.data.data || [];
      setExamTypes(data);
      
      const templatesObj = {};
      data.forEach(et => {
        if (et.marksheetTemplate) templatesObj[et._id] = et.marksheetTemplate.templateFile || et.marksheetTemplate;
      });
      setTemplates(templatesObj);
    } catch (err) {
      console.error('Fetch exam types error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateUpload = async (e, examTypeId) => {
    const file = e.target.files[0];
    if (!file) return;

    const examType = examTypes.find(et => et._id === examTypeId);
    setUploadingType(examTypeId);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('templateName', `${examType?.examTypeName || 'Exam'} Template`);
    formDataUpload.append('branchId', branchId);

    try {
      const res = await api.post(
        `/api/marksheet-template`,
        formDataUpload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const templateId = res.data.data?._id;
      
      // Update the exam type with this template
      await api.put(`/api/exam-type/${examTypeId}`, { 
        marksheetTemplate: templateId,
        branchId: branchId 
      });

      fetchExamTypes();
      Swal.fire('Success', 'Template uploaded successfully', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to upload template', 'error');
    } finally {
      setUploadingType(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Visual Assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Visual Identity Section */}
      <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-8 shadow-xl shadow-slate-100/50">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl">
                <FaImage size={24} />
            </div>
            <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Template Assets</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage background designs for each exam</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examTypes.map((examType) => (
            <div key={examType._id} className="group border-2 border-slate-50 rounded-3xl p-6 bg-slate-50/30 hover:bg-white hover:border-indigo-500 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{examType.examTypeName}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{examType.examTypeCode}</p>
                </div>
              </div>

              {templates[examType._id] ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-slate-100 shadow-inner group-hover:border-indigo-100 transition-all flex items-center justify-center">
                    {templates[examType._id]?.match(/\.(pdf|doc|docx)$/i) ? (
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-slate-400">
                          <FaUpload size={24} />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                          {templates[examType._id].split('/').pop()}
                        </p>
                      </div>
                    ) : (
                      <img
                        src={templates[examType._id]?.startsWith('http') ? templates[examType._id] : `${BASE_URL}${templates[examType._id]}`}
                        alt="Template"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="text-slate-300 font-bold uppercase text-[10px]">Document Asset</div>';
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const url = templates[examType._id];
                        const fullUrl = url?.startsWith('http') ? url : `${BASE_URL}${url}`;
                        setPreviewTemplate({ name: examType.examTypeName, url: fullUrl });
                      }}
                      className="flex-1 px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <FaEye /> Preview
                    </button>
                    <label className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer">
                      {uploadingType === examType._id ? '...' : <><FaUpload /> Update</>}
                      <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => handleTemplateUpload(e, examType._id)} className="hidden" disabled={uploadingType === examType._id} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="aspect-[4/3] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white hover:border-indigo-400 transition-all">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-all">
                    <FaPlus className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Template</p>
                    <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase italic">Click to browse images</p>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleTemplateUpload(e, examType._id)} className="hidden" disabled={uploadingType === examType._id} />
                </label>
              )}
            </div>
          ))}

          {examTypes.length === 0 && (
             <div className="col-span-full p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">No Exam Types found to assign templates.</p>
                <p className="text-[10px] font-bold text-slate-300 mt-2">Go to 'Exam Type' menu to create exams first.</p>
             </div>
          )}
        </div>
      </div>

      {/* Mapping Section */}
      <div className="pt-12 border-t-2 border-slate-50">
          <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                  <FaLink size={24} />
              </div>
              <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Smart Mapping System</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assign designs to specific classes and exam combinations</p>
              </div>
          </div>
          <TemplateMappingManagement branchId={branchId} />
      </div>

      {/* Modal Preview */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight italic">{previewTemplate.name} • Master Template</h2>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-600">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-8 flex-1 overflow-auto bg-slate-100/30 flex justify-center items-start">
                {previewTemplate.url.match(/\.(pdf)$/i) ? (
                  <iframe src={previewTemplate.url} className="w-full h-[70vh] rounded-xl border shadow-2xl" title="PDF Preview" />
                ) : previewTemplate.url.match(/\.(doc|docx)$/i) ? (
                  <div className="text-center p-20 bg-white rounded-[2rem] shadow-xl border border-slate-100">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FaUpload size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Word Document</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 italic">Direct preview is not available for Word files</p>
                    <a 
                      href={previewTemplate.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all inline-block shadow-lg"
                    >
                      Download to View
                    </a>
                  </div>
                ) : (
                  <img src={previewTemplate.url} alt="Full view" className="max-w-full shadow-2xl rounded-lg border border-white" />
                )}
            </div>
            <div className="p-6 border-t border-slate-50 flex justify-end">
              <button onClick={() => setPreviewTemplate(null)} className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
