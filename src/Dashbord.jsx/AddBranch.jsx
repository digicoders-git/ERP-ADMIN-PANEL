import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api';

function AddBranch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    branchName: '', branchCode: '', location: '', address: '',
    principalName: '', phone: '', email: '', password: '',
    capacity: '', establishedYear: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.branchName.trim()) errs.branchName = 'Branch name is required';
    if (!form.branchCode.trim()) errs.branchCode = 'Branch code is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await api.post('/api/branch/create', {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined,
      });
      Swal.fire({ icon: 'success', title: 'Branch Created!', timer: 1500, showConfirmButton: false });
      navigate('/dashbord/branches');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to create branch', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition text-sm ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashbord/branches')} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add New Branch</h1>
          <p className="text-gray-600 text-sm">Create a new school branch</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                <input name="branchName" value={form.branchName} onChange={handleChange} placeholder="Main Campus" className={inputCls('branchName')} />
                {errors.branchName && <p className="text-red-500 text-xs mt-1">{errors.branchName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code *</label>
                <input name="branchCode" value={form.branchCode} onChange={handleChange} placeholder="MAIN-01" className={inputCls('branchCode')} />
                {errors.branchCode && <p className="text-red-500 text-xs mt-1">{errors.branchCode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Delhi" className={inputCls('location')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                <input name="principalName" value={form.principalName} onChange={handleChange} placeholder="Dr. John Smith" className={inputCls('principalName')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="500" className={inputCls('capacity')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input type="number" name="establishedYear" value={form.establishedYear} onChange={handleChange} placeholder="2020" min="1900" max="2030" className={inputCls('establishedYear')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Full address" className={`${inputCls('address')} resize-none`} />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Contact & Admin Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className={inputCls('phone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Admin Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@branch.com" className={inputCls('email')} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <p className="text-xs text-gray-400 mt-1">Branch admin will use this to login</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password *</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" className={inputCls('password')} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex gap-4">
            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-60 text-sm">
              {loading ? 'Creating...' : 'Create Branch'}
            </button>
            <button type="button" onClick={() => navigate('/dashbord/branches')} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBranch;
