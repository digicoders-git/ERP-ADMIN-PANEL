import React, { useState, useEffect, useCallback } from 'react';
import { FaGraduationCap, FaSearch, FaSpinner, FaEye, FaIdCard } from 'react-icons/fa';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../api';
import IDCardPrint from './IDCardPrint';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentPanelData = () => {
  const { selectedBranch } = useOutletContext() || {};
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const branchParam = selectedBranch && selectedBranch !== 'all' ? `&branchId=${selectedBranch}` : '';
      const res = await api.get(`/api/school-admin/students?search=${search}${branchParam}`);
      setData(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Student error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [search, selectedBranch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaGraduationCap className="text-3xl text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-500 text-sm">Complete student directory with ID card printing</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.total || 0 },
          { label: 'Active', value: stats.active || 0 },
          { label: 'Classes', value: stats.classes || 0 },
          { label: 'Sections', value: stats.sections || 0 },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, roll number or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No students found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Profile', 'Name', 'Roll No', 'Class', 'Section', 'Father Name', 'Email', 'Mobile', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(student => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
                        {student.profileImage ? (
                          <img src={`${BASE_URL}${student.profileImage}`} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-sm">{student.name?.[0]}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.rollNumber || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.class?.className || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.section?.sectionName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.fatherName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.mobile || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {student.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashbord/student-profile/${student._id}`)}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition"
                          title="View Profile"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Print ID Card"
                        >
                          <FaIdCard />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedStudent && (
        <IDCardPrint
          roleType="student"
          staffId={selectedStudent._id}
          staffData={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentPanelData;
