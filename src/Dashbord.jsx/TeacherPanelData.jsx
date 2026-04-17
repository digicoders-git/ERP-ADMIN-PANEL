import React, { useState, useEffect, useCallback } from 'react';
import { FaChalkboardTeacher, FaSearch, FaSpinner } from 'react-icons/fa';
import api from '../api';

const TeacherPanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/school-admin/teachers?search=${search}`);
      setData(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Teachers error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaChalkboardTeacher className="text-3xl text-red-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-500 text-sm">Faculty information and assignments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Teachers', value: stats.total || 0 },
          { label: 'Active', value: stats.active || 0 },
          { label: 'On Leave', value: stats.onLeave || 0 },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input type="text" placeholder="Search by name or subject..."
          value={search} onChange={e => { setSearch(e.target.value); }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <FaSpinner className="animate-spin text-red-500 text-3xl" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No teachers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Mobile', 'Subjects', 'Experience', 'Branch', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(t => (
                  <tr key={t._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.mobile || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.qualification || t.experience || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.branch?.branchName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {t.status ? 'Active' : 'Inactive'}
                      </span>
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
};

export default TeacherPanelData;
