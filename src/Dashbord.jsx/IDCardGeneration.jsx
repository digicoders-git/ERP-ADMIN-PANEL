import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaIdCard, FaSearch, FaSpinner, FaDownload, FaTimes, FaCheck, FaUsers, FaArrowRight } from 'react-icons/fa';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

export default function IDCardGeneration() {
  const { allowedPanels = [] } = useOutletContext() || {};
  const [selectedRole, setSelectedRole] = useState('student');
  const [people, setPeople] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [idCardDesign, setIdCardDesign] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');

  const ROLE_PANEL_MAP = {
    student: 'parent',
    staff: 'staff',
    teacher: 'teacher',
    driver: 'transport',
    warden: 'warden',
    librarian: 'library',
    feeadmin: 'fee'
  };

  const availableRoles = Object.keys(ROLE_PANEL_MAP).filter(role =>
    allowedPanels.includes(ROLE_PANEL_MAP[role]) || allowedPanels.includes('school')
  );

  useEffect(() => {
    if (availableRoles.length > 0 && !availableRoles.includes(selectedRole)) {
      setSelectedRole(availableRoles[0]);
    }
  }, [allowedPanels]);

  useEffect(() => {
    fetchPeople();
    fetchIdCardDesign();
  }, [selectedRole, search]);

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = selectedRole === 'student' ? '/api/school-admin/students' : `/api/school-admin/staff?role=${selectedRole}`;
      const res = await api.get(`${endpoint}${endpoint.includes('?') ? '&' : '?'}search=${search}`);
      setPeople(res.data.data || res.data.students || res.data.staff || []);
    } catch (err) {
      console.error('Error fetching people:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, search]);

  const fetchIdCardDesign = async () => {
    try {
      const res = await api.get('/api/client-settings');
      const settings = res.data.settings;
      if (settings?.idCard?.[selectedRole]) {
        setIdCardDesign(settings.idCard[selectedRole]);
      } else {
        setIdCardDesign(null);
      }
    } catch (err) {
      console.error('Error fetching ID card design:', err);
    }
  };

  const toggleId = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === people.length) setSelectedIds([]);
    else setSelectedIds(people.map(p => p._id));
  };

  const handleGenerateAndPreview = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one person');
      return;
    }

    setGenerating(true);
    try {
      const res = await api.post('/api/staff-panel/id-card/generate', {
        role: selectedRole,
        studentIds: selectedRole === 'student' ? selectedIds : [],
        staffIds: selectedRole !== 'student' ? selectedIds : []
      });

      if (res.data.success) {
        setPreviewHtml(res.data.html);
      }
    } catch (err) {
      console.error('Error generating cards:', err);
    } finally {
      setGenerating(false);
    }
  };

  const downloadCards = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedRole.toUpperCase()} ID Cards</title>
          <style>
            body { margin: 0; padding: 20px; background: #f8fafc; font-family: system-ui; }
            #print-content { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
            @media print { body { padding: 0; background: #fff; } }
          </style>
        </head>
        <body>
          <div id="print-content">${previewHtml}</div>
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
            <FaIdCard className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Bulk ID Generator</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">High-Definition Personnel Credentials</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-xl border gap-1">
          {availableRoles.map(role => (
            <button
              key={role}
              onClick={() => { setSelectedRole(role); setSelectedIds([]); setPreviewHtml(''); }}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedRole === role ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Control Center */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FaSearch size={10} /> Active Filter
            </h3>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Search Identifier</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or ID..."
                className="w-full border rounded-xl p-3 text-xs font-black bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl text-white space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Generation Hub</h3>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <span className="text-[9px] font-black uppercase opacity-60">Selected Records</span>
              <span className="text-2xl font-black text-blue-400">{selectedIds.length}</span>
            </div>

            <button
              onClick={handleGenerateAndPreview}
              disabled={selectedIds.length === 0 || generating || !idCardDesign}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
            >
              {generating ? <FaSpinner className="animate-spin" /> : <FaArrowRight />}
              {generating ? 'Processing Data' : 'Initialize Generator'}
            </button>

            {!idCardDesign && (
              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                <p className="text-[9px] font-black text-red-400 uppercase">Configuration Missing</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Stream */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest">Personnel Directory</h2>
              <button onClick={toggleAll} className="text-[9px] font-black text-blue-600 uppercase border border-blue-100 px-5 py-2 rounded-xl bg-white hover:bg-blue-50 transition-all shadow-sm">
                {selectedIds.length === people.length ? 'Deselect Items' : 'Select All In View'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="p-5 w-16 text-center">Select</th>
                    <th className="p-5">Identity Profile</th>
                    <th className="p-5">Contextual Info</th>
                    <th className="p-5">Connectivity</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b">
                  {loading ? (
                    <tr><td colSpan="4" className="p-20 text-center"><FaSpinner className="animate-spin text-blue-500 mx-auto text-3xl" /></td></tr>
                  ) : people.length === 0 ? (
                    <tr><td colSpan="4" className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Zero records synchronized</td></tr>
                  ) : (
                    people.map(person => (
                      <tr key={person._id} onClick={() => toggleId(person._id)} className={`text-xs cursor-pointer hover:bg-blue-50/20 transition-all ${selectedIds.includes(person._id) ? 'bg-blue-50/40' : ''}`}>
                        <td className="p-5 text-center">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(person._id) ? 'bg-blue-600 border-blue-600 shadow-inner' : 'bg-white border-slate-200'}`}>
                            {selectedIds.includes(person._id) && <FaCheck className="text-white text-[10px]" />}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <img src={(person.profileImage || person.studentPhoto) ? ((person.profileImage || person.studentPhoto).startsWith('http') ? (person.profileImage || person.studentPhoto) : `${BASE_URL}/${(person.profileImage || person.studentPhoto).startsWith('/') ? (person.profileImage || person.studentPhoto).slice(1) : (person.profileImage || person.studentPhoto)}`) : 'https://placehold.co/40'} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md object-cover" alt="" />
                            <div>
                              <p className="font-black text-slate-800 text-[13px]">{person.name || `${person.firstName || ''} ${person.lastName || ''}`}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">REF: {person.rollNumber || person.staffId || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="font-black text-slate-700">{person.class?.className || person.designation || 'General Role'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{person.section?.sectionName || person.department || 'N/A'}</p>
                        </td>
                        <td className="p-5 text-slate-500 font-black">
                          <p className="text-[11px]">{person.mobile || person.phone || 'No Contact'}</p>
                          <p className="text-[10px] lowercase opacity-40 font-bold truncate max-w-[180px]">{person.email || ''}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Layer */}
          {previewHtml && (
            <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-1000">
              <div className="p-5 border-b bg-slate-900 flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Master Generation Preview</h2>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setPreviewHtml('')} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">Discard</button>
                  <button onClick={downloadCards} className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-500/40 transition-all">
                    <FaDownload /> Download Final PDF
                  </button>
                </div>
              </div>
              <div className="p-12 bg-slate-50 flex flex-wrap justify-center gap-10 overflow-auto max-h-[700px] border-b">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} className="flex flex-wrap gap-10 justify-center scale-95 origin-top" />
              </div>
              <div className="p-5 bg-white flex justify-center items-center gap-4">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post-Processing optimized for Commercial PVC Printing</p>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

