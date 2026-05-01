import React, { useState, useEffect, useCallback } from 'react';
import { FaBus, FaBook, FaHome, FaUsers, FaSearch, FaSpinner, FaUserTie } from 'react-icons/fa';
import api from '../api';

// ─── Shared ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex items-center justify-center h-40">
    <FaSpinner className="animate-spin text-gray-400 text-3xl" />
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <FaSearch className="absolute left-3 top-3 text-gray-400" />
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm" />
  </div>
);

const Badge = ({ val, green, red }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold
    ${green ? 'bg-green-100 text-green-700' : red ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
    {val}
  </span>
);

const DataTable = ({ cols, rows, render, empty }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {rows.length === 0 ? (
      <p className="text-center text-gray-400 py-12">{empty}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>{cols.map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id || row._id || i} className="border-b hover:bg-gray-50">
                {render(row).map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-gray-700">{cell ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// ─── Transport ────────────────────────────────────────────────────────────────
export const TransportPanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/school-admin/transport')
      .then(res => { setData(res.data.data || []); setStats(res.data.stats || {}); })
      .catch(err => console.error('Transport:', err.response?.data || err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(v =>
    v.vehicleNo?.toLowerCase().includes(search.toLowerCase()) ||
    v.vehicleType?.toLowerCase().includes(search.toLowerCase()) ||
    v.route?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaBus className="text-3xl text-yellow-600" />
        <div><h1 className="text-2xl font-bold text-gray-900">Transport Management</h1><p className="text-gray-500 text-sm">Vehicles and routes</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Vehicles" value={stats.totalVehicles || 0} />
        <StatCard label="Active" value={stats.active || 0} />
        <StatCard label="Routes" value={stats.routes || 0} />
        <StatCard label="Students" value={stats.students || 0} />
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by vehicle no, type or route..." />
      {loading ? <Spinner /> : (
        <DataTable
          cols={['Vehicle No', 'Type', 'Capacity', 'Route', 'Branch', 'Status']}
          rows={filtered}
          render={v => [
            v.vehicleNo,
            v.vehicleType,
            v.capacity,
            v.route,
            v.branch?.branchName || v.branch,
            <Badge key="s" val={v.status} green={v.status === 'Active'} red={v.status === 'Inactive'} />,
          ]}
          empty="No vehicles found"
        />
      )}
    </div>
  );
};

// ─── Library ──────────────────────────────────────────────────────────────────
export const LibraryPanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/school-admin/library?search=${search}`);
      console.log('Library response:', res.data);
      setData(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Library error:', err.response?.data || err.message);
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
        <FaBook className="text-3xl text-pink-600" />
        <div><h1 className="text-2xl font-bold text-gray-900">Library Management</h1><p className="text-gray-500 text-sm">Books and circulations</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Books" value={stats.totalBooks || 0} />
        <StatCard label="Issued" value={stats.issued || 0} />
        <StatCard label="Available" value={stats.available || 0} />
        <StatCard label="Members" value={stats.members || 0} />
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author or ISBN..." />
      {loading ? <Spinner /> : (
        <DataTable
          cols={['ISBN', 'Title', 'Author', 'Category', 'Total', 'Issued', 'Available', 'Location']}
          rows={data}
          render={b => [b.bookId, b.title, b.author, b.category, b.totalCopies, b.issued, b.available, b.location]}
          empty="No books found"
        />
      )}
    </div>
  );
};

// ─── Librarian ─────────────────────────────────────────────────────────────────
export const LibrarianPanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/school-admin/librarians?search=${search}`);
      console.log('Librarian response:', res.data);
      setData(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Librarian error:', err.response?.data || err.message);
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
        <FaUserTie className="text-3xl text-purple-600" />
        <div><h1 className="text-2xl font-bold text-gray-900">Librarian Management</h1><p className="text-gray-500 text-sm">Library staff information</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Librarians" value={stats.total || 0} />
        <StatCard label="Active" value={stats.active || 0} />
        <StatCard label="Inactive" value={stats.inactive || 0} />
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or staff ID..." />
      {loading ? <Spinner /> : (
        <DataTable
          cols={['Staff ID', 'Name', 'Email', 'Phone', 'Qualification', 'Branch', 'Join Date', 'Status']}
          rows={data}
          render={l => [l.staffId, l.name, l.email, l.phone, l.qualification, l.branch?.branchName || l.branch, l.joinDate, <Badge key="s" val={l.status} green={l.status === 'Active'} red={l.status === 'Inactive'} />]}
          empty="No librarians found"
        />
      )}
    </div>
  );
};

// ─── Hostel ───────────────────────────────────────────────────────────────────
export const HostelPanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/school-admin/hostel')
      .then(res => { 
        console.log('Hostel response:', res.data);
        setData(res.data.data || []); 
        setStats(res.data.stats || {}); 
      })
      .catch(err => console.error('Hostel error:', err.response?.data || err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(r =>
    r.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
    r.hostelName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaHome className="text-3xl text-cyan-600" />
        <div><h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1><p className="text-gray-500 text-sm">Rooms and allocations</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Hostels" value={stats.totalHostels || 0} />
        <StatCard label="Total Rooms" value={stats.totalRooms || 0} />
        <StatCard label="Occupied" value={stats.occupied || 0} />
        <StatCard label="Vacant" value={stats.vacant || 0} />
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by room no or hostel name..." />
      {loading ? <Spinner /> : (
        <DataTable
          cols={['Room No', 'Hostel', 'Type', 'Capacity', 'Occupancy', 'Student(s)', 'Status']}
          rows={filtered}
          render={r => [
            r.roomNo,
            r.hostelName,
            r.type,
            r.capacity,
            r.occupancy,
            r.student,
            <Badge key="s" val={r.status} green={r.status === 'Occupied'} red={r.status === 'Maintenance'} />,
          ]}
          empty="No rooms found"
        />
      )}
    </div>
  );
};

// ─── Students / Parents ───────────────────────────────────────────────────────
export const ParentPanelData = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/school-admin/parents?search=${search}`);
      setData(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Students:', err.response?.data || err.message);
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
        <FaUsers className="text-3xl text-indigo-600" />
        <div><h1 className="text-2xl font-bold text-gray-900">Students & Parents</h1><p className="text-gray-500 text-sm">Student and guardian information</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Students" value={stats.totalStudents || 0} />
        <StatCard label="Active" value={stats.activeParents || 0} />
        <StatCard label="Complaints" value={stats.complaints || 0} />
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by student name or roll number..." />
      {loading ? <Spinner /> : (
        <DataTable
          cols={['Roll No', 'Name', 'Class', 'Parent Name', 'Phone', 'Status']}
          rows={data}
          render={p => [
            p.studentId,
            p.name,
            p.class,
            p.parentName,
            p.phone,
            <Badge key="s" val={p.status} green={p.status === 'Active'} />,
          ]}
          empty="No students found"
        />
      )}
    </div>
  );
};
