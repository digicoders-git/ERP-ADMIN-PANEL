import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import { ArrowLeft, Users, Home, Layers, Bed, BookOpen, Phone, MapPin, Building2 } from 'lucide-react';

const HostelDetails = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hostelDetails, setHostelDetails] = useState(null);

  useEffect(() => {
    fetchHostelDetails();
  }, [hostelId]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      const [hostelRes, roomsRes, wardensRes, allocationsRes] = await Promise.all([
        api.get(`/api/hostel/${hostelId}`),
        api.get(`/api/room/by-hostel/${hostelId}`),
        api.get(`/api/warden/by-hostel/${hostelId}`),
        api.get(`/api/hostel-allocation/by-hostel/${hostelId}`)
      ]);

      setHostelDetails({
        hostel: hostelRes.data.hostel,
        rooms: roomsRes.data.rooms || [],
        wardens: wardensRes.data.wardens || [],
        allocations: allocationsRes.data.allocations || []
      });
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to fetch hostel details', 'error');
      navigate('/dashbord/hostel');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (!hostelDetails) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Hostel not found</p>
      </div>
    );
  }

  const { hostel, rooms, wardens, allocations } = hostelDetails;
  const totalBeds = rooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
  const occupiedBeds = allocations.length;
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashbord/hostel')}
          className="flex items-center gap-2 text-black hover:text-gray-700 transition mb-4 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{hostel.hostelName}</h1>
        <p className="text-gray-600">Complete hostel information and management</p>
      </div>

      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Hostel Code</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{hostel.hostelCode}</p>
            </div>
            <Building2 size={32} className="text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Type</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{hostel.type}</p>
            </div>
            <Layers size={32} className="text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Floors</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{hostel.totalFloor}</p>
            </div>
            <MapPin size={32} className="text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Contact</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{hostel.contactNo}</p>
            </div>
            <Phone size={32} className="text-orange-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Branch & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Branch Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 font-medium">Branch Name</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{hostel.branch?.branchName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Branch Code</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{hostel.branch?.branchCode || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 font-medium">Current Status</p>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mt-2 ${
                hostel.status 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hostel.status ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center border-t-4 border-blue-500">
          <Home size={28} className="mx-auto text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{rooms.length}</p>
          <p className="text-sm text-gray-600 mt-2 font-medium">Total Rooms</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center border-t-4 border-green-500">
          <Bed size={28} className="mx-auto text-green-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{totalBeds}</p>
          <p className="text-sm text-gray-600 mt-2 font-medium">Total Beds</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center border-t-4 border-purple-500">
          <Users size={28} className="mx-auto text-purple-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{allocations.length}</p>
          <p className="text-sm text-gray-600 mt-2 font-medium">Occupied Beds</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center border-t-4 border-orange-500">
          <Bed size={28} className="mx-auto text-orange-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{availableBeds}</p>
          <p className="text-sm text-gray-600 mt-2 font-medium">Available Beds</p>
        </div>
      </div>

      {/* Wardens Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen size={24} className="text-red-600" />
          Wardens ({wardens.length})
        </h3>
        {wardens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No wardens assigned to this hostel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wardens.map((warden) => (
              <div key={warden._id} className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border border-red-200">
                <p className="font-bold text-gray-900 text-lg">{warden.wardenName || warden.name}</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {warden.email}</p>
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {warden.mobileNumber || warden.phone}</p>
                  <p className="text-gray-700"><span className="font-medium">Gender:</span> {warden.gender || 'N/A'}</p>
                  <p className="text-gray-700"><span className="font-medium">Shift:</span> {warden.shift || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rooms Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Home size={24} className="text-blue-600" />
          Rooms ({rooms.length})
        </h3>
        {rooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No rooms added to this hostel</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Floor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Beds</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Monthly Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{room.roomNo}</td>
                    <td className="px-6 py-4 text-gray-700">{room.floorNo}</td>
                    <td className="px-6 py-4 text-gray-700">{room.capacity}</td>
                    <td className="px-6 py-4 text-gray-700">₹{room.monthlyRent?.toLocaleString() || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        room.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : room.status === 'occupied'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {room.status?.charAt(0).toUpperCase() + room.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Students Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={24} className="text-purple-600" />
          Allocated Students ({allocations.length})
        </h3>
        {allocations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No students allocated to this hostel</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joining Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Monthly Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allocations.map((allocation) => (
                  <tr key={allocation._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{allocation.studentName}</td>
                    <td className="px-6 py-4 text-gray-700">{allocation.roomNo}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(allocation.joiningDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-gray-700">₹{allocation.monthlyRent?.toLocaleString() || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        allocation.allocationStatus === 'allocated'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {allocation.allocationStatus?.charAt(0).toUpperCase() + allocation.allocationStatus?.slice(1)}
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

export default HostelDetails;
