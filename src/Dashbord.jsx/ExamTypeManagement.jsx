import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCogs, FaCalculator } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api';

export default function ExamTypeManagement({ branchId: propBranchId }) {
  const [examTypes, setExamTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState(propBranchId || localStorage.getItem('selectedBranch') || '');

  // Keep branchId in sync with props
  useEffect(() => {
    if (propBranchId) {
      setBranchId(propBranchId);
    }
  }, [propBranchId]);

  const [formData, setFormData] = useState({
    examTypeName: '',
    examTypeCode: '',
    description: '',
    marksType: 'theory',
    theoryMarks: 100,
    practicalMarks: 0,
    passingPercentage: 33
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branchId) {
      fetchData();
    }
  }, [branchId]);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/branch/all?limit=100');
      const branchList = res.data.branches || [];
      setBranches(branchList);
      if (!branchId && branchList.length > 0) {
        setBranchId(branchList[0]._id);
        localStorage.setItem('selectedBranch', branchList[0]._id);
      }
    } catch (err) {
      console.error('Fetch branches error:', err);
    }
  };

  const fetchData = async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/exam-type?branchId=${branchId}`);
      setExamTypes(res.data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire('Error', 'Failed to load exam types', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.examTypeName || !formData.examTypeCode) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    try {
      const submitData = {
        ...formData,
        totalMarks: Number(formData.theoryMarks) + (formData.marksType === 'theory+practical' ? Number(formData.practicalMarks) : 0),
        branchId
      };

      if (editingId) {
        await api.put(`/api/exam-type/${editingId}`, submitData);
        Swal.fire('Updated!', 'Exam type updated.', 'success');
      } else {
        await api.post('/api/exam-type', submitData);
        Swal.fire('Created!', 'Exam type created.', 'success');
      }

      resetForm();
      setShowForm(false);
      fetchData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleEdit = (examType) => {
    setFormData({
      examTypeName: examType.examTypeName,
      examTypeCode: examType.examTypeCode,
      description: examType.description || '',
      marksType: examType.marksType || 'theory',
      theoryMarks: examType.theoryMarks || 100,
      practicalMarks: examType.practicalMarks || 0,
      passingPercentage: examType.passingPercentage || 33
    });
    setEditingId(examType._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Exam Type?',
      text: 'Associated schedules might be affected',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/exam-type/${id}`);
        Swal.fire('Deleted', 'Exam type removed', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      examTypeName: '',
      examTypeCode: '',
      description: '',
      marksType: 'theory',
      theoryMarks: 100,
      practicalMarks: 0,
      passingPercentage: 33
    });
    setEditingId(null);
  };

  const filteredExamTypes = examTypes.filter(et =>
    et.examTypeName.toLowerCase().includes(search.toLowerCase()) ||
    et.examTypeCode.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse text-blue-600 font-bold">Initializing Master Data...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Premium Header */}
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-50 border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <FaCogs size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">EXAM MASTER CONFIG</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Centralized Marks Structure Control</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="px-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest focus:border-blue-500 outline-none transition-all"
          >
            {branches.map(b => <option key={b._id} value={b._id}>{b.branchName}</option>)}
          </select>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-2"
          >
            <FaPlus /> {showForm ? 'Close Form' : 'Add New Exam'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Exam Name</label>
                <input
                  type="text"
                  value={formData.examTypeName}
                  onChange={(e) => setFormData({ ...formData, examTypeName: e.target.value })}
                  placeholder="e.g. Mid-Term 2024"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unique Code</label>
                <input
                  type="text"
                  value={formData.examTypeCode}
                  onChange={(e) => setFormData({ ...formData, examTypeCode: e.target.value })}
                  placeholder="MID-24"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Marks Format</label>
                <select
                  value={formData.marksType}
                  onChange={(e) => setFormData({ ...formData, marksType: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-black text-xs uppercase tracking-widest transition-all"
                >
                  <option value="theory">Theory Only</option>
                  <option value="theory+practical">Theory + Practical</option>
                  <option value="full">Full Marks (Grade Based)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Passing %</label>
                <input
                  type="number"
                  value={formData.passingPercentage}
                  onChange={(e) => setFormData({ ...formData, passingPercentage: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Theory Marks</label>
                <input
                  type="number"
                  value={formData.theoryMarks}
                  onChange={(e) => setFormData({ ...formData, theoryMarks: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                  required
                />
              </div>

              {formData.marksType === 'theory+practical' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Practical Marks</label>
                  <input
                    type="number"
                    value={formData.practicalMarks}
                    onChange={(e) => setFormData({ ...formData, practicalMarks: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                    required
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50/50 p-6 rounded-3xl border-2 border-dashed border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                  <FaCalculator />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Aggregate Score System</p>
                  <p className="text-xl font-black text-blue-900">Total: {Number(formData.theoryMarks) + (formData.marksType === 'theory+practical' ? Number(formData.practicalMarks) : 0)} Marks</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 font-black text-[10px] uppercase tracking-widest text-slate-400">Discard</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700">Save Exam Config</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* List Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExamTypes.map(et => (
          <div key={et._id} className="group bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-50 transition-all relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FaCogs size={20} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(et)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><FaEdit /></button>
                <button onClick={() => handleDelete(et._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><FaTrash /></button>
              </div>
            </div>
            
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{et.examTypeName}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">{et.examTypeCode}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                <span className="text-slate-400">Total Marks</span>
                <span className="text-slate-900">{et.totalMarks}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                <span className="text-slate-400">Structure</span>
                <span className="text-blue-600">{et.theoryMarks}T {et.marksType === 'theory+practical' ? `+ ${et.practicalMarks}P` : ''}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                <span className="text-slate-400">Pass Criteria</span>
                <span className="text-emerald-500">{et.passingPercentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExamTypes.length === 0 && !loading && (
        <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <p className="text-slate-400 font-black uppercase tracking-widest">No Exam Configs Found</p>
           <p className="text-[10px] font-bold text-slate-300 mt-2">Click 'Add New Exam' to initialize your first exam structure.</p>
        </div>
      )}
    </div>
  );
}
