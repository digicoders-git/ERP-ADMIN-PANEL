import React, { useEffect, useState } from 'react';
import { FaPrint, FaTimes } from 'react-icons/fa';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function IDCardPrint({ roleType = 'staff', staffId, staffData, onClose }) {
  const [idCardDesign, setIdCardDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await api.get('/api/client-settings');
        const settings = res.data.settings;
        const roleDesign = settings?.idCard?.[roleType];
        const studentDesign = settings?.idCard?.student;

        if (roleDesign && roleDesign.design) {
          setIdCardDesign(roleDesign);
        } else if (studentDesign && studentDesign.design) {
          setIdCardDesign(studentDesign);
        }
      } catch (err) {
        console.error('Error fetching ID card design:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesign();
  }, [roleType]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!idCardDesign) return <div className="text-center py-8">No ID card design found</div>;

  const design = idCardDesign.design || {};
  const fields = idCardDesign.fields || [];
  const visibleFields = fields.filter(f => f.visible && f.section === 'body').sort((a, b) => a.position - b.position);

  const getFieldValue = (fieldId) => {
    const fieldMaps = {
      student: {
        studentName: staffData?.name,
        rollNumber: staffData?.rollNumber,
        class: staffData?.class?.className,
        section: staffData?.section?.sectionName,
        fatherName: staffData?.fatherName,
        motherName: staffData?.motherName,
        dob: staffData?.dob,
        gender: staffData?.gender,
        bloodGroup: staffData?.bloodGroup,
        phone: staffData?.mobile,
        email: staffData?.email,
        address: staffData?.address
      },
      staff: {
        staffName: staffData?.name,
        studentName: staffData?.name,
        staffId: staffData?.staffId,
        rollNumber: staffData?.staffId,
        designation: staffData?.designation,
        class: staffData?.designation || staffData?.department,
        department: staffData?.department,
        section: staffData?.department,
        email: staffData?.email,
        phone: staffData?.mobile,
        mobile: staffData?.mobile,
        qualification: staffData?.qualification,
        experience: staffData?.experience,
        fatherName: '—',
        dob: '—'
      },
      teacher: {
        teacherName: staffData?.name,
        studentName: staffData?.name,
        teacherId: staffData?.teacherId,
        rollNumber: staffData?.teacherId,
        subject: staffData?.subject,
        qualification: staffData?.qualification,
        email: staffData?.email,
        phone: staffData?.mobile,
        mobile: staffData?.mobile,
        class: staffData?.subject || 'Teacher',
        section: 'Teaching'
      },
      driver: {
        driverName: staffData?.name,
        studentName: staffData?.name,
        driverId: staffData?.driverId,
        rollNumber: staffData?.driverId,
        licenseNumber: staffData?.licenseNumber,
        vehicleNumber: staffData?.vehicleNumber,
        phone: staffData?.mobile,
        mobile: staffData?.mobile,
        class: staffData?.vehicleNumber || 'Driver',
        section: 'Transport'
      },
      warden: {
        wardenName: staffData?.name,
        studentName: staffData?.name,
        wardenId: staffData?.wardenId,
        rollNumber: staffData?.wardenId,
        hostelName: staffData?.hostelName,
        designation: staffData?.designation,
        email: staffData?.email,
        phone: staffData?.mobile,
        mobile: staffData?.mobile,
        class: staffData?.hostelName || 'Warden',
        section: 'Hostel'
      }
    };

    return fieldMaps[roleType]?.[fieldId] || 'N/A';
  };

  const getRoleLabel = () => {
    const labels = {
      student: 'Student ID Card',
      staff: 'Staff ID Card',
      teacher: 'Teacher ID Card',
      driver: 'Driver ID Card',
      warden: 'Warden ID Card'
    };
    return labels[roleType] || 'ID Card';
  };

  const renderCard = () => (
    <div
      style={{
        width: `${design.cardWidth}px`,
        height: `${design.cardHeight}px`,
        backgroundColor: design.backgroundColor || '#ffffff',
        border: `${design.borderWidth || 3}px solid ${design.borderColor || '#059669'}`,
        borderRadius: `${design.borderRadius || 12}px`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        fontFamily: 'Arial, sans-serif',
        margin: '20px auto'
      }}
    >
      <div
        style={{
          backgroundColor: design.headerColor || '#059669',
          height: `${design.headerHeight || 80}px`,
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'white'
        }}
      >
        <div
          style={{
            width: `${design.logoSize || 50}px`,
            height: `${design.logoSize || 50}px`,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            flexShrink: 0
          }}
        >
          LOGO
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2' }}>School Name</div>
          <div style={{ fontSize: '9px', opacity: 0.9 }}>{getRoleLabel()}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: `${design.photoSize || 120}px`,
              height: `${design.photoSize || 120}px`,
              backgroundColor: '#e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#6b7280',
              border: `2px solid ${design.accentColor || '#10b981'}`,
              fontWeight: 'bold',
              overflow: 'hidden'
            }}
          >
            {staffData?.profileImage ? (
              <img src={`${BASE_URL}${staffData.profileImage}`} alt={staffData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              'Photo'
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: design.textColor || '#1f2937' }}>
            {staffData?.name}
          </div>

          {visibleFields.map((field, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: design.accentColor || '#10b981', fontWeight: 'bold', fontSize: `${field.fontSize}px` }}>
                {field.label}:
              </span>
              <span style={{ color: design.textColor || '#1f2937', fontSize: `${field.fontSize}px`, fontWeight: field.bold ? 'bold' : 'normal' }}>
                {getFieldValue(field.id)}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${design.accentColor || '#10b981'}`,
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '9px'
          }}
        >
          <div style={{ color: design.accentColor || '#10b981', fontWeight: 'bold' }}>Valid 2024-2025</div>
          <div style={{ color: design.textColor || '#1f2937' }}>Principal Sign</div>
        </div>
      </div>
    </div>
  );

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getRoleLabel()}</title>
          <style>
            body { margin: 0; padding: 20px; background: #f5f5f5; }
            .card-container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          <div class="card-container">
            ${renderCard().props.children ? '' : ''}
          </div>
          <script>
            window.print();
            window.close();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{getRoleLabel()} Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
            {renderCard()}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3 justify-end">
          <button onClick={onClose} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
            Close
          </button>
          <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
            <FaPrint /> Print
          </button>
        </div>
      </div>
    </div>
  );
}
