import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaUsers, FaBook, FaBus, FaMoneyBillWave, FaChalkboardTeacher, FaUserTie, FaHome, FaChevronRight, FaSpinner, FaBuilding, FaBed } from 'react-icons/fa';
import api from '../api';

const PANEL_CARD_MAP = {
  school: {
    title: 'Branch Management', icon: FaBuilding,
    color: 'from-green-500 to-green-600', route: '/dashbord/branches',
    getStats: (d) => [
      { label: 'Total', value: d?.branches?.total || 0 },
      { label: 'Active', value: d?.branches?.active || 0 }
    ]
  },
  staff: {
    title: 'Staff Management', icon: FaUserTie,
    color: 'from-blue-500 to-blue-600', route: '/dashbord/staff',
    getStats: (d) => [
      { label: 'Total', value: d?.staff?.total || 0 },
      { label: 'Active', value: d?.staff?.active || 0 }
    ]
  },
  teacher: {
    title: 'Teacher Panel', icon: FaChalkboardTeacher,
    color: 'from-red-500 to-red-600', route: '/dashbord/teachers',
    getStats: (d) => [
      { label: 'Total', value: d?.teachers?.total || 0 },
      { label: 'Active', value: d?.teachers?.active || 0 }
    ]
  },
  parent: {
    title: 'Students', icon: FaUsers,
    color: 'from-indigo-500 to-indigo-600', route: '/dashbord/parents',
    getStats: (d) => [
      { label: 'Total', value: d?.students?.total || 0 },
      { label: 'Active', value: d?.students?.active || 0 }
    ]
  },
  fee: {
    title: 'Fee Management', icon: FaMoneyBillWave,
    color: 'from-purple-500 to-purple-600', route: '/dashbord/fees',
    getStats: (d) => [
      { label: 'Collected', value: `₹${(((d?.fees?.monthlyCollected || 0)) / 1000).toFixed(0)}K` },
      { label: 'Pending', value: `₹${(((d?.fees?.monthlyPending || 0)) / 1000).toFixed(0)}K` }
    ]
  },
  transport: {
    title: 'Transport', icon: FaBus,
    color: 'from-yellow-500 to-yellow-600', route: '/dashbord/transport',
    getStats: (d) => [
      { label: 'Vehicles', value: d?.transport?.totalVehicles || 0 },
      { label: 'Active', value: d?.transport?.active || 0 }
    ]
  },
  library: {
    title: 'Library', icon: FaBook,
    color: 'from-pink-500 to-pink-600', route: '/dashbord/library',
    getStats: (d) => [
      { label: 'Books', value: d?.library?.totalBooks || 0 },
      { label: 'Issued', value: d?.library?.issued || 0 }
    ]
  },
  warden: {
    title: 'Hostel', icon: FaBed,
    color: 'from-cyan-500 to-cyan-600', route: '/dashbord/hostel',
    getStats: (d) => [
      { label: 'Occupied', value: d?.hostel?.occupied || 0 },
      { label: 'Approvals', value: d?.pendingApprovals || 0 }
    ]
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const allowedPanels = context.allowedPanels || admin?.allowedPanels || [];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/school-admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  const panels = allowedPanels
    .filter(p => PANEL_CARD_MAP[p])
    .map(p => ({ ...PANEL_CARD_MAP[p], stats: PANEL_CARD_MAP[p].getStats(data) }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-blue-500 text-4xl" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">School Management Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm">
          {allowedPanels.length} panel{allowedPanels.length !== 1 ? 's' : ''} active in your plan
        </p>
      </div>

      {panels.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No panels assigned to your plan.</p>
          <p className="text-sm mt-1">Contact your super admin to update your plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {panels.map((panel, i) => {
            const Icon = panel.icon;
            return (
              <button key={i} onClick={() => navigate(panel.route)}
                className={`p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 text-white bg-gradient-to-br ${panel.color} text-left`}>
                <div className="flex items-start justify-between mb-4">
                  <Icon className="text-3xl opacity-80" />
                  <FaChevronRight className="text-lg" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{panel.title}</h3>
                <div className="space-y-1 text-sm opacity-90">
                  {panel.stats.map((s, j) => (
                    <p key={j}>{s.label}: <span className="font-bold">{s.value}</span></p>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {data?.recentBranches?.length > 0 && allowedPanels.includes('school') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Branches</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Branch', 'Code', 'Location', 'Students', 'Teachers', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentBranches.map(b => (
                  <tr key={b._id} className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/dashbord/branch/${b._id}`)}>
                    <td className="px-4 py-3 font-medium text-gray-800">{b.branchName}</td>
                    <td className="px-4 py-3 text-gray-600">{b.branchCode}</td>
                    <td className="px-4 py-3 text-gray-600">{b.location || '—'}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{b.students || 0}</td>
                    <td className="px-4 py-3 font-bold text-purple-600">{b.teachers || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {b.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
