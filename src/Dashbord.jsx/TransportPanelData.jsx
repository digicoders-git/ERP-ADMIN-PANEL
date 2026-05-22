import React, { useState, useEffect } from 'react';
import { Truck, Users, MapPin, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const TransportPanelData = () => {
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page]);

  const fetchData = async () => {
    setLoading(true);
    setErrors({});
    try {
      const endpoints = {
        stats: '/api/transport/stats',
        vehicles: `/api/transport/vehicles?page=${pagination.page}&limit=${pagination.limit}`,
        drivers: `/api/transport/drivers?page=${pagination.page}&limit=${pagination.limit}`,
        routes: `/api/transport/routes?page=${pagination.page}&limit=${pagination.limit}`,
        allocations: `/api/transport/allocations?page=${pagination.page}&limit=${pagination.limit}`
      };

      const results = await Promise.allSettled([
        api.get(endpoints.stats),
        api.get(endpoints.vehicles),
        api.get(endpoints.drivers),
        api.get(endpoints.routes),
        api.get(endpoints.allocations)
      ]);

      results.forEach((result, idx) => {
        const key = Object.keys(endpoints)[idx];
        if (result.status === 'fulfilled') {
          console.log(`${key} response:`, result.value.data.data);
        } else {
          console.error(`${key} error:`, result.reason);
          setErrors(prev => ({ ...prev, [key]: result.reason.message }));
        }
      });

      if (results[0].status === 'fulfilled') setStats(results[0].value.data.data);
      if (results[1].status === 'fulfilled') setVehicles(results[1].value.data.data || []);
      if (results[2].status === 'fulfilled') setDrivers(results[2].value.data.data || []);
      if (results[3].status === 'fulfilled') setRoutes(results[3].value.data.data || []);
      if (results[4].status === 'fulfilled') setAllocations(results[4].value.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error', 'Failed to fetch transport data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value || 0}</p>
        </div>
        <Icon size={32} style={{ color }} className="opacity-20" />
      </div>
    </div>
  );

  const DataTable = ({ columns, data, title, loading: tableLoading }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={fetchData}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Refresh"
        >
          <RefreshCw size={18} className={tableLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <Loader size={24} className="mx-auto animate-spin text-blue-600" />
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  {Object.entries(row).map(([key, val], i) => (
                    <td key={i} className="px-6 py-4 text-sm text-gray-700">
                      {typeof val === 'boolean' ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {val ? 'Active' : 'Inactive'}
                        </span>
                      ) : val === null || val === undefined ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        String(val).substring(0, 50)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No data available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transport data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Truck size={36} className="text-blue-600" />
            Transport Management
          </h1>
          <p className="text-gray-600 mt-2">Manage vehicles, drivers, routes, and allocations</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      {stats && activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Truck} label="Total Vehicles" value={stats.vehicles?.total} color="#3B82F6" />
          <StatCard icon={Truck} label="Active Vehicles" value={stats.vehicles?.active} color="#10B981" />
          <StatCard icon={Users} label="Total Drivers" value={stats.drivers?.total} color="#F59E0B" />
          <StatCard icon={MapPin} label="Total Routes" value={stats.routes} color="#8B5CF6" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-2 overflow-x-auto">
        {['overview', 'vehicles', 'drivers', 'routes', 'allocations'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPagination({ page: 1, limit: 10 }); }}
            className={`px-4 py-2 rounded font-medium transition capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && stats && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Vehicles</span>
                    <span className="text-2xl font-bold text-green-600">{stats.vehicles?.active || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${stats.vehicles?.total ? (stats.vehicles.active / stats.vehicles.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maintenance</span>
                    <span className="text-2xl font-bold text-red-600">{stats.vehicles?.maintenance || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Total Capacity</span>
                    <span>{stats.vehicles?.totalCapacity || 0} seats</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Drivers</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.drivers?.active || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${stats.drivers?.total ? (stats.drivers.active / stats.drivers.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Drivers</span>
                    <span className="text-2xl font-bold text-gray-800">{stats.drivers?.total || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'vehicles' && (
          <DataTable
            title="Vehicles"
            columns={['Vehicle Number', 'Registration', 'Capacity', 'Type', 'Status']}
            data={vehicles.map((v) => ({
              'Vehicle Number': v.vehicleNumber || 'N/A',
              'Registration': v.registrationNumber || 'N/A',
              'Capacity': v.capacity || 0,
              'Type': v.type || 'N/A',
              'Status': v.status
            }))}
            loading={loading}
          />
        )}

        {activeTab === 'drivers' && (
          <DataTable
            title="Drivers"
            columns={['Name', 'Email', 'Mobile', 'License', 'Status']}
            data={drivers.map((d) => ({
              'Name': d.name || 'N/A',
              'Email': d.email || 'N/A',
              'Mobile': d.mobile || 'N/A',
              'License': d.licenseNumber || 'N/A',
              'Status': d.status
            }))}
            loading={loading}
          />
        )}

        {activeTab === 'routes' && (
          <DataTable
            title="Routes"
            columns={['Route Name', 'Start Point', 'End Point', 'Distance', 'Status']}
            data={routes.map((r) => ({
              'Route Name': r.routeName || 'N/A',
              'Start Point': r.startPoint || 'N/A',
              'End Point': r.endPoint || 'N/A',
              'Distance': r.distance ? `${r.distance} km` : 'N/A',
              'Status': r.status
            }))}
            loading={loading}
          />
        )}

        {activeTab === 'allocations' && (
          <DataTable
            title="Student Allocations"
            columns={['Student Name', 'Route', 'Service', 'Charges', 'Status']}
            data={allocations.map((a) => ({
              'Student Name': a.studentName || 'N/A',
              'Route': a.routeName || 'N/A',
              'Service': a.service || 'N/A',
              'Charges': a.charges ? `₹${a.charges}` : 'N/A',
              'Status': a.status
            }))}
            loading={loading}
          />
        )}
      </div>

      {/* Debug Info */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([key, err]) => (
              <li key={key}>{key}: {err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransportPanelData;
