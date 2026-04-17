import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaEye, FaTable, FaTh, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import api from '../api';

function BranchManagement() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'card' | 'table'
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    branchName: '', branchCode: '', location: '', address: '',
    principalName: '', phone: '', email: '', password: '',
    capacity: '', establishedYear: ''
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/branch/all?search=${search}&limit=100`);
      setBranches(data.branches || []);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to load branches', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBranches(); }, [search]);

  const validate = () => {
    const e = {};
    if (!form.branchName.trim()) e.branchName = 'Branch name is required';
    else if (form.branchName.trim().length < 3) e.branchName = 'Min 3 characters required';
    if (!editing) {
      if (!form.branchCode.trim()) e.branchCode = 'Branch code is required';
      else if (!/^[A-Za-z0-9_-]+$/.test(form.branchCode)) e.branchCode = 'Only letters, numbers, - and _ allowed';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 6) e.password = 'Min 6 characters required';
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone number';
    if (form.capacity && (isNaN(form.capacity) || Number(form.capacity) < 0)) e.capacity = 'Enter a valid positive number';
    if (form.establishedYear && (isNaN(form.establishedYear) || Number(form.establishedYear) < 1900 || Number(form.establishedYear) > new Date().getFullYear())) e.establishedYear = `Enter year between 1900 and ${new Date().getFullYear()}`;
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/branch/update/${editing._id}`, form);
        Swal.fire({ icon: 'success', title: 'Branch Updated', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/api/branch/create', form);
        Swal.fire({ icon: 'success', title: 'Branch Created', timer: 1500, showConfirmButton: false });
      }
      setShowForm(false); setEditing(null); resetForm(); fetchBranches();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ branchName: '', branchCode: '', location: '', address: '', principalName: '', phone: '', email: '', password: '', capacity: '', establishedYear: '' });
    setErrors({});
  };

  const openEdit = (branch) => {
    setEditing(branch);
    setForm({
      branchName: branch.branchName || '',
      branchCode: branch.branchCode || '',
      location: branch.location || '',
      address: branch.address || '',
      principalName: branch.principalName || '',
      phone: branch.phone || '',
      email: branch.email || '',
      password: '',
      capacity: branch.capacity || '',
      establishedYear: branch.establishedYear || ''
    });
    setShowForm(true);
  };

  const toggleStatus = async (branch) => {
    try {
      const { data } = await api.patch(`/api/branch/toggle-status/${branch._id}`);
      setBranches(branches.map(b => b._id === branch._id ? { ...b, status: data.status } : b));
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = (branch) => {
    Swal.fire({
      title: `Delete "${branch.branchName}"?`,
      text: 'This will also delete the branch admin.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await api.delete(`/api/branch/delete/${branch._id}`);
          setBranches(branches.filter(b => b._id !== branch._id));
          Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
        }
      }
    });
  };

  const inputCls = (field) => `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;
  const ErrMsg = ({ field }) => errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  const stats = {
    total: branches.length,
    active: branches.filter(b => b.status).length,
    inactive: branches.filter(b => !b.status).length,
    totalStudents: branches.reduce((s, b) => s + (b.students || 0), 0),
    totalTeachers: branches.reduce((s, b) => s + (b.teachers || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Branch Management</h1>
          <p className="text-gray-600 mt-1 text-sm">Manage all school branches</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm(); }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium">
          <FaPlus /> Add New Branch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Branches', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Inactive', value: stats.inactive },
          { label: 'Total Students', value: stats.totalStudents },
          { label: 'Total Teachers', value: stats.totalTeachers },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + View Toggle */}
      <div className="flex gap-3 items-center">
        <input type="text" placeholder="Search branches..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" />
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('card')}
            className={`px-3 py-2 text-sm flex items-center gap-1 transition ${viewMode === 'card' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <FaTh size={13} /> Cards
          </button>
          <button onClick={() => setViewMode('table')}
            className={`px-3 py-2 text-sm flex items-center gap-1 transition ${viewMode === 'table' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <FaTable size={13} /> Table
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Edit Branch' : 'Add New Branch'}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Branch Name *</label>
              <input required value={form.branchName} onChange={e => setForm({ ...form, branchName: e.target.value })} className={inputCls('branchName')} placeholder="e.g. Main Campus" />
              <ErrMsg field="branchName" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Branch Code *</label>
              <input required={!editing} value={form.branchCode} onChange={e => setForm({ ...form, branchCode: e.target.value })} className={inputCls('branchCode')} placeholder="e.g. MAIN-01" disabled={!!editing} />
              <ErrMsg field="branchCode" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls('location')} placeholder="e.g. Delhi" />
              <ErrMsg field="location" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Principal Name</label>
              <input value={form.principalName} onChange={e => setForm({ ...form, principalName: e.target.value })} className={inputCls('principalName')} placeholder="e.g. Dr. John Smith" />
              <ErrMsg field="principalName" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls('phone')} placeholder="e.g. 9876543210" maxLength={10} />
              <ErrMsg field="phone" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Branch Email *</label>
              <input required={!editing} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls('email')} placeholder="e.g. branch@school.com" disabled={!!editing} />
              <ErrMsg field="email" />
            </div>
            {!editing && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Admin Password *</label>
                <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={inputCls('password')} placeholder="Min 6 characters" />
                <ErrMsg field="password" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Capacity</label>
              <input type="number" min="0" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className={inputCls('capacity')} placeholder="e.g. 500" />
              <ErrMsg field="capacity" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Established Year</label>
              <input type="number" min="1900" max={new Date().getFullYear()} value={form.establishedYear} onChange={e => setForm({ ...form, establishedYear: e.target.value })} className={inputCls('establishedYear')} placeholder={`e.g. 2010`} />
              <ErrMsg field="establishedYear" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className={`${inputCls('address')} resize-none`} placeholder="e.g. 123 Main Street, Delhi" />
              <ErrMsg field="address" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-60 text-sm font-medium">
                {saving ? 'Saving...' : editing ? 'Update Branch' : 'Create Branch'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><FaSpinner className="animate-spin text-blue-500 text-3xl" /></div>
      ) : branches.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No branches found. Add your first branch.</div>
      ) : viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div key={branch._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{branch.branchName?.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{branch.branchName}</h3>
                    <p className="text-gray-500 text-sm">{branch.branchCode} • {branch.location || '—'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${branch.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {branch.status ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Principal:</span><span className="font-medium text-gray-800 truncate ml-1">{branch.principalName || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span className="font-medium text-gray-800">{branch.phone || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Students:</span><span className="font-bold text-blue-600">{branch.students || 0}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Teachers:</span><span className="font-bold text-purple-600">{branch.teachers || 0}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Capacity:</span><span className="font-medium text-gray-800">{branch.capacity || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Est. Year:</span><span className="font-medium text-gray-800">{branch.establishedYear || '—'}</span></div>
                {branch.email && <div className="col-span-2 flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium text-gray-800 truncate ml-1">{branch.email}</span></div>}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100 items-center">
                <button onClick={() => navigate(`/dashbord/branch/${branch._id}`)}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  <FaEye size={13} /> View
                </button>
                <button onClick={() => toggleStatus(branch)} title={branch.status ? 'Click to Deactivate' : 'Click to Activate'} className="flex items-center gap-1 px-2 py-1">
                  {branch.status
                    ? <><FaToggleOn size={26} className="text-green-500" /><span className="text-xs text-green-600 font-medium">Active</span></>
                    : <><FaToggleOff size={26} className="text-gray-400" /><span className="text-xs text-gray-500 font-medium">Inactive</span></>}
                </button>
                <button onClick={() => openEdit(branch)} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"><FaEdit size={14} /></button>
                <button onClick={() => handleDelete(branch)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><FaTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Principal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Teachers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Est. Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branches.map((branch, idx) => (
                  <tr key={branch._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">{branch.branchName?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{branch.branchName}</p>
                          <p className="text-xs text-gray-400">{branch.location || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{branch.branchCode}</td>
                    <td className="px-4 py-3 text-gray-700">{branch.principalName || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{branch.phone || '—'}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{branch.students || 0}</td>
                    <td className="px-4 py-3 font-bold text-purple-600">{branch.teachers || 0}</td>
                    <td className="px-4 py-3 text-gray-700">{branch.establishedYear || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(branch)} title={branch.status ? 'Click to Deactivate' : 'Click to Activate'}>
                        {branch.status
                          ? <FaToggleOn size={28} className="text-green-500 hover:text-green-600 transition" />
                          : <FaToggleOff size={28} className="text-gray-400 hover:text-gray-500 transition" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/dashbord/branch/${branch._id}`)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="View">
                          <FaEye size={13} />
                        </button>
                        <button onClick={() => openEdit(branch)}
                          className="p-1.5 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100" title="Edit">
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => handleDelete(branch)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Delete">
                          <FaTrash size={13} />
                        </button>
                      </div>
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
}

export default BranchManagement;
