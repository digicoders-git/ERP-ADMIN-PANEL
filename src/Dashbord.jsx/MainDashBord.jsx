import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome, FaSignOutAlt, FaUserTie, FaChalkboardTeacher,
  FaMoneyBillWave, FaBus, FaBook, FaUsers, FaChartBar, FaKey, FaBuilding, FaBed, FaUser, FaCog, FaChevronDown,
  FaPalette, FaClipboardList,FaGraduationCap, FaFileAlt, FaIdCard, FaReceipt, FaBook as FaMarksheet
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import api from "../api";

// Panel → sidebar nav item mapping
const PANEL_NAV_MAP = {
  school:    { to: "/dashbord/branches",  label: "Branches",   icon: FaBuilding },
  staff:     { to: "/dashbord/staff",     label: "Staff",      icon: FaUserTie },
  teacher:   { to: "/dashbord/teachers",  label: "Teachers",   icon: FaChalkboardTeacher },
  fee:       { to: "/dashbord/fees",      label: "Fees",       icon: FaMoneyBillWave },
  transport: { to: "/dashbord/transport", label: "Transport",  icon: FaBus },
  library:   { to: "/dashbord/library",   label: "Library",    icon: FaBook },
  warden:    { to: "/dashbord/hostel",    label: "Hostel",     icon: FaBed },
  parent:    { to: "/dashbord/parents",   label: "Students",   icon: FaUsers },
};    

// School Settings submenu items
const SCHOOL_SETTINGS_SUBMENU = [
  { id: 'branding', label: 'Branding', icon: FaPalette },
//   { id: 'attendance', label: 'Attendance', icon: FaClipboardList },
//   { id: 'admission', label: 'Admission', icon: FaFileAlt },
  { id: 'idCard', label: 'ID Card Design', icon: FaIdCard },
//   { id: 'feeSlip', label: 'Fee Slip Design', icon: FaReceipt },
  { id: 'marksheet', label: 'Marksheet Design', icon: FaMarksheet },
  { id: 'examType', label: 'Exam Type', icon: FaClipboardList },
  { id: 'transport', label: 'Transport', icon: FaBus },
  { id: 'generateIdCards', label: 'Generate ID Cards', icon: FaIdCard },
];

// Always visible items (not panel-based)
const FIXED_NAV = [
  { to: "/dashbord",          label: "Dashboard",       icon: FaHome,     end: true },
  { to: "/dashbord/reports",  label: "Reports",         icon: FaChartBar },
  { to: "/dashbord/profile",  label: "Profile",         icon: FaUser },
  { to: "/dashbord/change-password", label: "Change Password", icon: FaKey },
];

export default function MainDashBord() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem("admin") || "{}"));
  const allowedPanels = admin?.allowedPanels || [];

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

  // Fetch branches on mount
  useEffect(() => {
    api.get('/api/branch/all?limit=100')
      .then(res => {
        if (res.data.branches?.length > 0) {
          const firstBranch = res.data.branches[0]._id;
          localStorage.setItem('selectedBranch', firstBranch);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch fresh allowedPanels on mount (in case plan was updated)
  useEffect(() => {
    const handleProfileUpdate = () => {
      setAdmin(JSON.parse(localStorage.getItem("admin") || "{}"));
    };
    window.addEventListener('profileUpdate', handleProfileUpdate);

    api.get('/api/school-admin/me')
      .then(res => {
        const fresh = res.data.admin;
        const updated = { ...admin, allowedPanels: fresh.allowedPanels, role: fresh.role, profileImage: fresh.profileImage };
        localStorage.setItem('admin', JSON.stringify(updated));
        setAdmin(updated);
      })
      .catch(() => {}); // silent fail — use cached data

    return () => window.removeEventListener('profileUpdate', handleProfileUpdate);
  }, []);

  // Build dynamic nav from allowedPanels
  const panelNavItems = allowedPanels
    .filter(p => PANEL_NAV_MAP[p])
    .map(p => PANEL_NAV_MAP[p]);

  const NAV_ITEMS = [
    FIXED_NAV[0],         // Dashboard always first
    ...panelNavItems,     // only allowed panels
    FIXED_NAV[1],         // Reports
    FIXED_NAV[2],         // Change Password
  ];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/"); return; }
    const resize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [navigate]);

  const closeSidebar = () => isMobile && setOpen(false);

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl transition-all duration-200 font-medium group relative
    ${open ? "px-4 py-2.5" : "justify-center p-2.5"}
    ${isActive
      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
      : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;

  const handleSettingsClick = (sectionId) => {
    if (sectionId === 'generateIdCards') {
      navigate('/dashbord/generate-id-cards');
    } else {
      navigate(`/dashbord/school-settings/${sectionId}`);
    }
    closeSidebar();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {open && isMobile && (
        <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed lg:static top-0 left-0 h-full z-40 flex flex-col
        bg-gradient-to-b from-slate-900 to-slate-800 text-white
        transition-all duration-300 ease-in-out overflow-hidden
        ${open ? "w-60" : "w-0 lg:w-16"}`}>

        <div className={`h-16 flex items-center border-b border-white/10 flex-shrink-0 ${open ? "justify-between px-4" : "justify-center px-2"}`}>
          {open && <h1 className="font-bold text-base tracking-wide whitespace-nowrap">Admin Panel</h1>}
          {isMobile && open && (
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <MdClose size={20} />
            </button>
          )}
          {!open && !isMobile && <span className="font-bold text-sm">AP</span>}
        </div>



        <nav className={`flex-1 overflow-y-auto mt-2 space-y-1 ${open ? "p-3" : "p-2"}`}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={menuClass} onClick={closeSidebar}>
              <Icon size={17} className="flex-shrink-0" />
              {open && <span className="text-sm">{label}</span>}
              {!open && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded-lg
                  opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </div>
              )}
            </NavLink>
          ))}

          {/* School Settings Dropdown */}
          <div className="relative settings-dropdown">
            <button
              onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
              className={`flex w-full items-center gap-3 rounded-xl transition-all duration-200 font-medium group relative
              ${open ? "px-4 py-2.5" : "justify-center p-2.5"}
              ${settingsDropdownOpen
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <FaCog size={17} className="flex-shrink-0" />
              {open && (
                <>
                  <span className="text-sm flex-1 text-left">School Settings</span>
                  <FaChevronDown size={12} className={`transition-transform ${settingsDropdownOpen ? 'rotate-180' : ''}`} />
                </>
              )}
              {!open && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded-lg
                  opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  Settings
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {settingsDropdownOpen && open && (
              <div className="ml-4 mt-2 space-y-1 bg-slate-700/30 rounded-lg p-2">
                {SCHOOL_SETTINGS_SUBMENU.map(item => {
                  const SubIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSettingsClick(item.id)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <SubIcon size={14} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className={`border-t border-white/10 flex-shrink-0 ${open ? "p-3" : "p-2"}`}>
          {open && (
            <div className="px-2 py-2 mb-2 text-xs text-slate-400">
              <p className="truncate">{admin?.email}</p>
              <p className="text-slate-500 mt-0.5">
                {allowedPanels.length} panel{allowedPanels.length !== 1 ? 's' : ''} active
              </p>
            </div>
          )}
          <button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            className={`flex w-full items-center rounded-xl bg-gradient-to-r from-rose-500 to-red-600
            hover:shadow-lg transition-all duration-200 font-medium
            ${open ? "gap-3 px-4 py-2.5 justify-start" : "justify-center p-2.5"}`}>
            <FaSignOutAlt size={16} />
            {open && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-slate-100 transition flex-shrink-0">
            <GiHamburgerMenu size={20} className="text-slate-700" />
          </button>
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashbord/profile')} className="p-2 rounded-lg hover:bg-slate-100 transition" title="Profile">
              <FaUser size={18} className="text-slate-600" />
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">{admin?.name || admin?.email || "Admin"}</p>
              <p className="text-xs text-slate-500 capitalize">{admin?.role || "Admin"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden border border-slate-200">
              {admin?.profileImage ? (
                <img 
                  src={admin.profileImage.startsWith('http') ? admin.profileImage : `${BASE_URL}/${admin.profileImage}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                admin?.name?.[0]?.toUpperCase() || admin?.email?.[0]?.toUpperCase() || "A"
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 min-h-full">
            <Outlet context={{ allowedPanels }} />
          </div>
        </section>
      </main>
    </div>
  );
}
