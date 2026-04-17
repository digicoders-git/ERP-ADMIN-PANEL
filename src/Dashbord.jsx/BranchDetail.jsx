import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api';

function BranchDetail() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(null);
  const [branchAdmin, setBranchAdmin] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { if (branchId) fetchBranchData(); }, [branchId]);

  const fetchBranchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/school-admin/branch/${branchId}`);
      setBranch(data.data.branch);
      setTeachers(data.data.teachers || []);
      setStudents(data.data.students || []);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to load branch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    try {
      const { data } = await api.patch(`/api/branch/toggle-status/${branchId}`);
      setBranch(prev => ({ ...prev, status: data.status }));
    } catch (err) {
      Swal.fire('Error', 'Status update failed', 'error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  if (!branch) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Branch not found</p>
        <button onClick={() => navigate('/dashbord/branches')} className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Back to Branches
        </button>
      </div>
    </div>
  );

  const tabs = ['overview', 'admin'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashbord/branches')} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <FaArrowLeft />
          </button>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">{branch.branchName?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{branch.branchName}</h1>
            <p className="text-gray-500 text-sm">{branch.branchCode} {branch.location ? `• ${branch.location}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${branch.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {branch.status ? 'Active' : 'Inactive'}
          </span>
          <button onClick={toggleStatus}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${branch.status ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
            {branch.status ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: students.length, color: 'text-blue-600' },
          { label: 'Teachers', value: teachers.length, color: 'text-purple-600' },
          { label: 'Classes', value: branch.classes ?? 0, color: 'text-green-600' },
          { label: 'Capacity', value: branch.capacity ?? 0, color: 'text-orange-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-6 flex gap-6 overflow-x-auto">
          {['overview', 'teachers', 'students', 'admin'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'overview' ? '📊 Overview' : tab === 'teachers' ? '👨‍🏫 Teachers' : tab === 'students' ? '👨‍🎓 Students' : '👤 Branch Admin'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Branch Info */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">Branch Information</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Branch Name', value: branch.branchName },
                    { label: 'Branch Code', value: branch.branchCode },
                    { label: 'Principal', value: branch.principalName },
                    { label: 'Phone', value: branch.phone },
                    { label: 'Email', value: branch.email },
                    { label: 'Location', value: branch.location },
                    { label: 'Address', value: branch.address },
                    { label: 'Established Year', value: branch.establishedYear },
                  ].map(({ label, value }) => value ? (
                    <div key={label} className="flex justify-between gap-4 py-2 border-b border-gray-50">
                      <span className="text-gray-500 flex-shrink-0">{label}</span>
                      <span className="font-medium text-gray-800 text-right">{value}</span>
                    </div>
                  ) : null)}
                </div>
              </div>

              {/* Stats Info */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">Statistics</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Total Students', value: students.length },
                    { label: 'Total Teachers', value: teachers.length },
                    { label: 'Total Classes', value: branch.classes ?? 0 },
                    { label: 'Capacity', value: branch.capacity ?? 0 },
                    { label: 'Rating', value: branch.rating ?? 0 },
                    { label: 'Fees', value: branch.fees ? `₹${branch.fees}` : '0' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 py-2 border-b border-gray-50">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-bold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-4">Teachers ({teachers.length})</h3>
              {teachers.length === 0 ? (
                <p className="text-gray-400 text-sm">No teachers found for this branch.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Subjects</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teachers.map((teacher, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{teacher.name}</td>
                          <td className="px-4 py-3 text-gray-700">{teacher.email}</td>
                          <td className="px-4 py-3 text-gray-700">{teacher.phone}</td>
                          <td className="px-4 py-3 text-gray-700">{teacher.subjects?.join(', ') || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {teacher.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-4">Students ({students.length})</h3>
              {students.length === 0 ? (
                <p className="text-gray-400 text-sm">No students found for this branch.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Roll No</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Class</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-3 text-gray-700">{student.rollNo}</td>
                          <td className="px-4 py-3 text-gray-700">{student.class}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-md">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Branch Admin Details</h3>
              <p className="text-gray-400 text-sm">Admin information not available in current view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BranchDetail;
