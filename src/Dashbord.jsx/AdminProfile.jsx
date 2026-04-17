import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaBuilding, FaUserShield, FaCalendar, FaSpinner, FaSave, FaUser } from 'react-icons/fa';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // First load from localStorage for quick display
    const stored = JSON.parse(localStorage.getItem("admin") || "{}");
    if (stored) {
      setAdmin(stored);
      setFormData({
        name: stored.name || '',
        mobile: stored.mobile || '',
        address: stored.address || ''
      });
    }
    
    // Then fetch latest data from database
    api.get('/api/school-admin/profile')
      .then((res) => {
        const adminData = res.data.admin || res.data.data?.admin;
        if (res.data.success && adminData) {
          setAdmin(adminData);
          localStorage.setItem('admin', JSON.stringify(adminData));
          setFormData({
            name: adminData.name || '',
            mobile: adminData.mobile || '',
            address: adminData.address || ''
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch admin profile:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('mobile', formData.mobile);
      data.append('address', formData.address);
      if (selectedFile) {
        data.append('profileImage', selectedFile);
      }

      const res = await api.put('/api/school-admin/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const serverAdminData = res.data.admin || res.data.data;
        // Merge local changes with server response (which contains new profileImage URL)
        const updated = { ...admin, ...formData, ...serverAdminData };
        localStorage.setItem('admin', JSON.stringify(updated));
        setAdmin(updated);
        setEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        // Trigger navbar update
        window.dispatchEvent(new Event('profileUpdate'));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-blue-500 text-4xl" />
    </div>
  );

  const roleLabels = {
    superAdmin: 'Super Admin',
    clientAdmin: 'Client Admin',
    branchAdmin: 'Branch Admin',
    staffAdmin: 'Staff Admin',
    teacherAdmin: 'Teacher Admin',
    wardenAdmin: 'Warden Admin',
    feeManager: 'Fee Manager',
    feeAdmin: 'Fee Admin',
    libraryAdmin: 'Library Admin'
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition">
        <FaArrowLeft /> Back
      </button>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />
        <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="relative group">
            <div 
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-indigo-100 flex-shrink-0 cursor-pointer"
              onClick={() => document.getElementById('profileInput').click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : admin?.profileImage ? (
                <img src={admin.profileImage.startsWith('http') ? admin.profileImage : `${BASE_URL}/${admin.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 text-4xl font-bold">
                  {admin?.email?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <FaUser className="text-white text-xl" />
              </div>
            </div>
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1 pt-2 sm:pt-0">
            <h2 className="text-2xl font-bold text-gray-900">{admin?.name || 'Admin'}</h2>
            <p className="text-gray-500 text-sm">{admin?.email}</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
            <FaUserShield /> {roleLabels[admin?.role] || admin?.role}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <FaEnvelope className="text-gray-400" />
              <span className="text-gray-800">{admin?.email || '—'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your name"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                {admin?.name || '—'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Mobile</label>
            {editing ? (
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter mobile number"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                {admin?.mobile || '—'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <FaUserShield className="text-gray-400" />
              <span className="text-gray-800">{roleLabels[admin?.role] || admin?.role}</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
            {editing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Enter your address"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                {admin?.address || '—'}
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: admin?.name || '',
                  mobile: admin?.mobile || '',
                  address: admin?.address || ''
                });
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <FaBuilding className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Allowed Panels</p>
              <p className="text-sm font-semibold text-gray-800">{admin?.allowedPanels?.join(', ') || 'None'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <FaCalendar className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Joined</p>
              <p className="text-sm font-semibold text-gray-800">
                {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-IN') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
