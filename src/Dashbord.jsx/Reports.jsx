import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import api from '../api';

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDetails, setBranchDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    api.get('/api/school-admin/reports')
      .then(res => setData(res.data.data))
      .catch(err => console.error('Reports error:', err))
      .finally(() => setLoading(false));
  }, []);

  const reportTypes = [
    { id: 'overview', name: 'System Overview', icon: '📊' },
    { id: 'branches', name: 'Branch Report', icon: '🏫' },
    { id: 'students', name: 'Student Report', icon: '👨🎓' },
    { id: 'financial', name: 'Financial Report', icon: '💰' },
  ];

  const fetchBranchDetails = async (branchId) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/api/school-admin/branch/${branchId}`);
      setBranchDetails(res.data.data);
    } catch (err) {
      console.error('Error fetching branch details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-blue-500 text-4xl" /></div>;

  const ov = data?.overview || {};
  const branches = data?.branches || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Live data from backend</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map(r => (
            <button key={r.id} onClick={() => { setSelectedReport(r.id); setSelectedBranch(null); }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${selectedReport === r.id ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
              <div className="text-2xl mb-2">{r.icon}</div>
              <div className="text-sm font-medium">{r.name}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Total Branches', value: ov.totalBranches || 0 },
            { label: 'Active Branches', value: ov.activeBranches || 0 },
            { label: 'Total Students', value: ov.totalStudents || 0 },
            { label: 'Total Teachers', value: ov.totalTeachers || 0 },
            { label: 'Total Staff', value: ov.totalStaff || 0 },
            { label: 'Total Revenue', value: `₹${(ov.totalRevenue || 0).toLocaleString()}` },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {selectedReport === 'branches' && (
        <div className="space-y-6">
          {selectedBranch && branchDetails ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedBranch.name} - Teachers</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedBranch.location}</p>
                </div>
                <button onClick={() => { setSelectedBranch(null); setBranchDetails(null); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition">
                  ← Back to Report
                </button>
              </div>
              <div className="overflow-x-auto">
                {loadingDetails ? (
                  <div className="p-8 text-center text-gray-400"><FaSpinner className="animate-spin inline text-2xl" /></div>
                ) : branchDetails.teachers && branchDetails.teachers.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{['Name', 'Email', 'Phone', 'Subjects', 'Status'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {branchDetails.teachers.map((t, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{t.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{t.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{t.subjects?.join(', ') || '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.status}</span>
                          </td>
                        </tr>
                      ))}</tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-gray-400">No teachers found for this branch</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Branch Performance Report</h3>
                <p className="text-sm text-gray-500 mt-1">Click "View Teachers" to see teacher details</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>{['Branch', 'Location', 'Students', 'Teachers', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {branches.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No branch data</td></tr>
                    ) : branches.map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{b.location}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{b.students}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{b.teachers}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{b.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => {
                              setSelectedBranch(b);
                              if (b._id) fetchBranchDetails(b._id);
                            }}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition">
                              View Teachers
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedReport === 'students' && (
        <div className="space-y-6">
          {selectedBranch && branchDetails ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedBranch.name} - Students</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedBranch.location}</p>
                </div>
                <button onClick={() => { setSelectedBranch(null); setBranchDetails(null); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition">
                  ← Back to Report
                </button>
              </div>
              <div className="overflow-x-auto">
                {loadingDetails ? (
                  <div className="p-8 text-center text-gray-400"><FaSpinner className="animate-spin inline text-2xl" /></div>
                ) : branchDetails.students && branchDetails.students.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{['Name', 'Roll No', 'Class', 'Status'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {branchDetails.students.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{s.rollNo}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{s.class}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}</tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-gray-400">No students found for this branch</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Distribution by Branch</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.length === 0 ? <p className="text-gray-400">No data available</p> : branches.map((b) => (
                    <div key={b._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer" onClick={() => {
                      setSelectedBranch(b);
                      if (b._id) fetchBranchDetails(b._id);
                    }}>
                      <h4 className="font-medium text-gray-800 mb-2">{b.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Students:</span><span className="font-medium">{b.students}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Teachers:</span><span className="font-medium">{b.teachers}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Status:</span>
                          <span className={`font-medium ${b.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{b.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedReport === 'financial' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Revenue by Branch</h4>
              <div className="space-y-3">
                {branches.length === 0 ? <p className="text-gray-400 text-sm">No data</p> : branches.map((b) => (
                  <div key={b._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 text-sm">{b.name}</span>
                    <span className="font-medium text-green-600 text-sm">₹{(b.fees || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Financial Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 text-sm">Total Revenue</span>
                  <span className="font-medium text-green-600">₹{(ov.totalRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 text-sm">Fee Paid</span>
                  <span className="font-medium text-green-600">₹{(ov.feePaid || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 text-sm">Fee Pending</span>
                  <span className="font-medium text-red-600">₹{(ov.feePending || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700 text-sm">Fee Partial</span>
                  <span className="font-medium text-yellow-600">₹{(ov.feePartial || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 text-sm">Avg per Branch</span>
                  <span className="font-medium text-blue-600">
                    ₹{branches.length ? Math.round((ov.totalRevenue || 0) / branches.length).toLocaleString() : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 text-sm">Revenue per Student</span>
                  <span className="font-medium text-purple-600">
                    ₹{ov.totalStudents ? Math.round((ov.totalRevenue || 0) / ov.totalStudents).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
