import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaChevronDown, FaCalendar, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api';

export default function ExamSchedule() {
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [schedules, setSchedules] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState(localStorage.getItem('selectedBranch') || '');

  const [formData, setFormData] = useState({
    examTypeId: '',
    examType: '',
    examTitle: '',
    class: '',
    section: '',
    subject: '',
    examDate: '',
    startTime: '',
    endTime: '',
    roomHall: '',
    invigilatorName: '',
    totalMarks: 100,
    passingMarks: 40,
    specialInstructions: ''
  });

  const [examTypeSearch, setExamTypeSearch] = useState('');
  const [showExamTypeDropdown, setShowExamTypeDropdown] = useState(false);
  const [classSearch, setClassSearch] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  useEffect(() => {
    if (branchId) {
      fetchData();
    }
  }, [branchId]);

  const fetchData = async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      const [examTypesRes, classesRes, schedulesRes] = await Promise.all([
        api.get(`/api/exam-type?branchId=${branchId}`),
        api.get(`/api/class/all?limit=100&branchId=${branchId}`),
        api.get(`/api/exam-schedule?branchId=${branchId}`)
      ]);

      setExamTypes(examTypesRes.data.data || []);
      setClasses(classesRes.data.classes || classesRes.data.data || []);
      setSchedules(schedulesRes.data.examSchedules || schedulesRes.data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = async (classId) => {
    setFormData({ ...formData, class: classId, section: '' });
    setShowClassDropdown(false);
    setClassSearch('');

    try {
      const res = await api.get(`/api/section?classId=${classId}`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error('Fetch sections error:', err);
    }
  };

  const handleExamTypeSelect = (examType) => {
    setFormData({
      ...formData,
      examTypeId: examType._id,
      examType: examType.examTypeCode, // Use the code as the display name
      totalMarks: examType.totalMarks || 100,
      passingMarks: Math.ceil((examType.totalMarks * (examType.passingPercentage || 33)) / 100)
    });
    setShowExamTypeDropdown(false);
    setExamTypeSearch('');
  };

  const filteredExamTypes = examTypes.filter(et =>
    et.examTypeName.toLowerCase().includes(examTypeSearch.toLowerCase()) ||
    et.examTypeCode.toLowerCase().includes(examTypeSearch.toLowerCase())
  );

  const filteredClasses = classes.filter(c =>
    c.className.toLowerCase().includes(classSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.examTypeId || !formData.class || !formData.section) {
      Swal.fire('Error', 'Please select exam type, class, and section', 'error');
      return;
    }

    try {
      const submitData = { ...formData, branchId };

      if (editingId) {
        await api.put(`/api/exam-schedule/${editingId}`, submitData);
        Swal.fire('Success', 'Exam schedule updated', 'success');
      } else {
        await api.post('/api/exam-schedule', submitData);
        Swal.fire('Success', 'Exam schedule created', 'success');
      }

      setFormData({
        examTypeId: '',
        examType: '',
        examTitle: '',
        class: '',
        section: '',
        subject: '',
        examDate: '',
        startTime: '',
        endTime: '',
        roomHall: '',
        invigilatorName: '',
        totalMarks: 100,
        passingMarks: 40,
        specialInstructions: ''
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Schedule?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/exam-schedule/${id}`);
        Swal.fire('Deleted', 'Exam schedule deleted', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Schedule</h2>
            <p className="text-gray-600">Create and manage exam schedules with admin-created exam types</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                examTypeId: '',
                examType: '',
                examTitle: '',
                class: '',
                section: '',
                subject: '',
                examDate: '',
                startTime: '',
                endTime: '',
                roomHall: '',
                invigilatorName: '',
                totalMarks: 100,
                passingMarks: 40,
                specialInstructions: ''
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
          >
            <FaPlus /> New Schedule
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Exam Schedule' : 'Create New Exam Schedule'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exam Type Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExamTypeDropdown(!showExamTypeDropdown)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400"
                  >
                    <span className={formData.examTypeId ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                      {formData.examTypeId ? `${examTypes.find(et => et._id === formData.examTypeId)?.examTypeName}` : 'Select exam type...'}
                    </span>
                    <FaChevronDown className={`transition ${showExamTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showExamTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search exam type..."
                            value={examTypeSearch}
                            onChange={(e) => setExamTypeSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredExamTypes.length > 0 ? (
                          filteredExamTypes.map(et => (
                            <button
                              key={et._id}
                              type="button"
                              onClick={() => handleExamTypeSelect(et)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 transition"
                            >
                              <div className="font-semibold text-gray-900">{et.examTypeName}</div>
                              <div className="text-sm text-gray-600">{et.examTypeCode}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">No exam types found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Class Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Class *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowClassDropdown(!showClassDropdown)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400"
                  >
                    <span className={formData.class ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                      {formData.class ? (() => {
                        const c = classes.find(c => c._id === formData.class);
                        return c ? `${c.className} ${c.stream && c.stream.length > 0 ? `(${Array.isArray(c.stream) ? c.stream.join(', ') : c.stream})` : ''}` : 'Select class...';
                      })() : 'Select class...'}
                    </span>
                    <FaChevronDown className={`transition ${showClassDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showClassDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search class..."
                            value={classSearch}
                            onChange={(e) => setClassSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredClasses.length > 0 ? (
                          filteredClasses.map(c => (
                            <button
                              key={c._id}
                              type="button"
                              onClick={() => handleClassSelect(c)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 transition"
                            >
                              <div className="font-semibold text-gray-900">
                                {c.className} {c.stream && c.stream.length > 0 ? `(${Array.isArray(c.stream) ? c.stream.join(', ') : c.stream})` : ''}
                              </div>
                              <div className="text-sm text-gray-600">{c.classCode}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">No classes found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section *</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                >
                  <option value="">Select section...</option>
                  {sections.map(s => (
                    <option key={s._id} value={s._id}>{s.sectionName}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Exam Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Date *</label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Room/Hall */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room/Hall *</label>
                <input
                  type="text"
                  value={formData.roomHall}
                  onChange={(e) => setFormData({ ...formData, roomHall: e.target.value })}
                  placeholder="e.g., Room 101"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Invigilator */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Invigilator Name *</label>
                <input
                  type="text"
                  value={formData.invigilatorName}
                  onChange={(e) => setFormData({ ...formData, invigilatorName: e.target.value })}
                  placeholder="Invigilator name"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Total Marks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Passing Marks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passing Marks</label>
                <input
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                placeholder="Any special instructions..."
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {editingId ? 'Update' : 'Create'} Schedule
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedules List */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
        {schedules.length === 0 ? (
          <div className="p-12 text-center">
            <FaCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No exam schedules yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Exam Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(schedule => (
                  <tr key={schedule._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{schedule.examType}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{schedule.class?.className}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{schedule.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(schedule.examDate).toLocaleDateString()} {schedule.startTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{schedule.roomHall}</td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setFormData(schedule);
                          setEditingId(schedule._id);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
