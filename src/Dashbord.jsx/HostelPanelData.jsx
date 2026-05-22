import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import { Search, Plus, Eye } from 'lucide-react';

const HostelPanelData = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchHostels();
  }, [page, search]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/hostel/all', {
        params: { page, limit: 10, search }
      });
      setHostels(response.data.hostels);
      setPagination(response.data.pagination);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to fetch hostels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (hostelId) => {
    navigate(`/dashbord/hostel-details/${hostelId}`);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading hostels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hostel Management</h1>
        <p className="text-gray-600">Manage all hostels and their details</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, code, or contact..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total Hostels</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{pagination.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Active</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{hostels.filter(h => h.status).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium">Inactive</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{hostels.filter(h => !h.status).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">Pages</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{pagination.totalPages || 1}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {hostels.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Eye size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No hostels found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hostel Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Floors</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hostels.map((hostel) => (
                  <tr key={hostel._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{hostel.hostelName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {hostel.hostelCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{hostel.type}</td>
                    <td className="px-6 py-4 text-gray-600">{hostel.totalFloor}</td>
                    <td className="px-6 py-4 text-gray-600">{hostel.contactNo}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        hostel.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {hostel.status ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewDetails(hostel._id)}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 font-medium text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            ← Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  page === p
                    ? 'bg-black text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default HostelPanelData;
