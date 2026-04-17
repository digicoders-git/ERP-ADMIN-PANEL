import React, { useState, useEffect, useCallback } from 'react';
import { FaMoneyBillWave, FaSearch, FaSpinner } from 'react-icons/fa';
import api from '../api';

const FeePanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/school-admin/fees?search=${search}`);
      setData(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Fee error:', err.response?.data || err.message);
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
        <FaMoneyBillWave className="text-3xl text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-sm">Fee structures and types</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Fee Types', value: stats.total || 0 },
          { label: 'Active', value: stats.active || 0 },
          { label: 'Inactive', value: stats.inactive || 0 },
          { label: 'Total Amount', value: `₹${(stats.totalAmount || 0).toLocaleString()}` },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input type="text" placeholder="Search by fee name or type..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40"><FaSpinner className="animate-spin text-purple-500 text-3xl" /></div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No fee records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>{['Fee Name', 'Type', 'Frequency', 'Amount', 'Branch', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {data.map((f, i) => (
                  <tr key={f.id || i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.feeName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{f.feeType}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{f.frequency}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{(f.totalAmount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{f.branch}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${f.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {f.status}
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

export default FeePanelData;
