import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaSave,
  FaUndo
} from 'react-icons/fa';
import api from '../api';
import BrandingSettings from './Settings/BrandingSettings';
import StaffConfiguration from './Settings/StaffConfiguration';
import TeacherConfiguration from './Settings/TeacherConfiguration';
import StudentConfiguration from './Settings/StudentConfiguration';
import AttendanceSettings from './Settings/AttendanceSettings';
// import AdmissionSettings from './Settings/AdmissionSettings';
import IDCardConfig from './Settings/IDCardConfig';
import FeeSlipDesign from './Settings/FeeSlipDesign';
import MarksheetDesign from './Settings/MarksheetDesign';
import ExamTypeManagement from './ExamTypeManagement';
import TransportSettings from './Settings/TransportSettings';

const menuItems = [
  { id: 'branding', label: 'Branding', component: BrandingSettings },
  { id: 'staff', label: 'Staff Configuration', component: StaffConfiguration },
  { id: 'teacher', label: 'Teacher Configuration', component: TeacherConfiguration },
  { id: 'student', label: 'Student Configuration', component: StudentConfiguration },
  // { id: 'attendance', label: 'Attendance Settings', component: AttendanceSettings },
  // { id: 'admission', label: 'Admission Settings', component: AdmissionSettings },
  { id: 'idCard', label: 'ID Card Configuration', component: IDCardConfig },
  // { id: 'feeSlip', label: 'Fee Slip Design', component: FeeSlipDesign },
  { id: 'marksheet', label: 'Marksheet Design', component: MarksheetDesign },
  { id: 'examType', label: 'Exam Type', component: ExamTypeManagement },
  { id: 'transport', label: 'Transport Settings', component: TransportSettings }
];

export default function SchoolSettings() {
  const { section } = useParams();
  const { selectedBranch: contextBranch } = useOutletContext() || {};
  const [activeSection, setActiveSection] = useState(section || 'branding');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(() => contextBranch || localStorage.getItem('selectedBranch') || '');
  const [purchasedPanels, setPurchasedPanels] = useState([]);
  const navigate = useNavigate();

  // Update activeSection when URL section changes
  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section]);

  // Update selectedBranch when context changes
  useEffect(() => {
    if (contextBranch) {
      setSelectedBranch(contextBranch);
    }
  }, [contextBranch]);

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch settings when branch changes
  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('selectedBranch', selectedBranch);
      fetchSettings();
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const { data } = await api.get('/api/branch/all?limit=100');
      setBranches(data.branches || []);
      if (data.branches?.length > 0 && !selectedBranch) {
        setSelectedBranch(data.branches[0]._id);
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to load branches', 'error');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      if (!selectedBranch || selectedBranch === 'all') {
        setSettings(null);
        return;
      }
      const { data } = await api.get(`/api/client-settings?branchId=${selectedBranch}`);
      setSettings(data.settings);
      setPurchasedPanels(data.purchasedPanels || []);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (sectionData) => {
    try {
      setSaving(true);
      let endpoint = `/api/client-settings/${activeSection}/update?branchId=${selectedBranch}`;
      
      // Special handling for ID Card configuration
      if (activeSection === 'idCard') {
        endpoint = `/api/client-settings/idcard/config/update?branchId=${selectedBranch}`;
      }
      
      // Special handling for Marksheet templates
      if (activeSection === 'marksheet') {
        endpoint = `/api/client-settings/marksheet/templates/update?branchId=${selectedBranch}`;
      }
      
      await api.put(endpoint, sectionData);
      
      // Refresh settings after save
      fetchSettings();
      
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Settings updated successfully',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Reset Settings?',
      text: 'This will reset all changes for this section',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Reset'
    }).then(result => {
      if (result.isConfirmed) {
        fetchSettings();
        Swal.fire('Reset!', 'Settings have been reset', 'success');
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component;
  const currentLabel = menuItems.find(item => item.id === activeSection)?.label;
  const currentBranch = branches.find(b => b._id === selectedBranch);

  return (
    <div className="space-y-6">
      {/* Branch Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Branch</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose a branch --</option>
          <option value="all">📊 All Branches</option>
          {branches.map(branch => (
            <option key={branch._id} value={branch._id}>
              {branch.branchName} ({branch.branchCode})
            </option>
          ))}
        </select>
        {selectedBranch === 'all' && (
          <p className="text-sm text-amber-600 mt-2 font-semibold">⚠️ Select a specific branch to configure settings</p>
        )}
        {currentBranch && selectedBranch !== 'all' && (
          <p className="text-sm text-gray-600 mt-2">Configuring settings for: <span className="font-semibold text-gray-800">{currentBranch.branchName}</span></p>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentLabel}
          </h1>
          <p className="text-gray-600 mt-1">Configure your school settings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
          >
            <FaUndo /> Reset
          </button>
          <button
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-60"
          >
            <FaSave /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {selectedBranch === 'all' ? (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
          <p className="text-amber-800 font-semibold text-lg">📊 All Branches Selected</p>
          <p className="text-amber-700 mt-2">Please select a specific branch to configure its settings</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {ActiveComponent && (
            <ActiveComponent
              data={settings?.[activeSection]}
              onSave={handleSave}
              saving={saving}
              branchId={selectedBranch}
              purchasedPanels={purchasedPanels}
            />
          )}
        </div>
      )}
    </div>
  );
}
