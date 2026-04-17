import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaRupeeSign, FaMapMarkerAlt, FaBuilding, FaToggleOn, FaToggleOff, FaSpinner } from 'react-icons/fa';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/school-admin/staff/${id}`)
      .then((response) => {
        console.log('Staff data:', response.data);
        const staffData = response.data.data || response.data.staff || response.data;
        setStaff(staffData);
      })
      .catch(err => {
        console.error('Staff fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load staff details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-blue-500 text-4xl" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-semibold">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline flex items-center gap-2 mx-auto">
        <FaArrowLeft /> Go Back
      </button>
    </div>
  );

  if (!staff) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Staff not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline flex items-center gap-2 mx-auto">
        <FaArrowLeft /> Go Back
      </button>
    </div>
  );

  const details = [
    { icon: <FaEnvelope />, label: 'Email', value: staff.email },
    { icon: <FaPhone />, label: 'Phone', value: staff.mobile || '—' },
    { icon: <FaGraduationCap />, label: 'Qualification', value: staff.qualification || '—' },
    { icon: <FaBriefcase />, label: 'Experience', value: staff.experience || '—' },
    { icon: <FaRupeeSign />, label: 'Salary', value: staff.salary ? `₹${Number(staff.salary).toLocaleString()}` : '—' },
    { icon: <FaBuilding />, label: 'Branch', value: staff.branch?.branchName || '—' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition">
        <FaArrowLeft /> Back to Staff List
      </button>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-blue-100 flex-shrink-0">
            {staff.profileImage
              ? <img src={`${BASE_URL}${staff.profileImage}`} alt={staff.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-blue-600 text-4xl font-bold">{staff.name?.[0]}</div>
            }
          </div>
          <div className="flex-1 pt-2 sm:pt-0">
            <h2 className="text-2xl font-bold text-gray-900">{staff.name}</h2>
            <p className="text-gray-500 text-sm">{staff.email}</p>
          </div>
          <span className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${staff.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {staff.status ? <FaToggleOn /> : <FaToggleOff />} {staff.status ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
              {icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-gray-800 font-semibold text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {staff.address && (
        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
            <FaMapMarkerAlt />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Address</p>
            <p className="text-gray-800 font-semibold text-sm">{staff.address}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl border p-4 text-sm text-gray-500 text-center">
        Joined on {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : (staff.joinDate ? new Date(staff.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A')}
      </div>
    </div>
  );
}
