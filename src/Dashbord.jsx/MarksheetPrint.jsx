import React, { useEffect, useState } from 'react';
import { FaPrint, FaTimes } from 'react-icons/fa';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MarksheetPrint({ examType = {}, studentData, marksData, onClose }) {
  const [marksheetTemplate, setMarksheetTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const branchId = localStorage.getItem('selectedBranch');

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // examType is now an object with _id, name, code, template
        if (examType?.template) {
          setMarksheetTemplate(examType.template);
        } else {
          console.warn('No template found for exam type:', examType);
        }
      } catch (err) {
        console.error('Error fetching marksheet template:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [examType]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write(`
      <html>
        <head>
          <title>Marksheet - ${studentData?.name}</title>
          <style>
            body { margin: 0; padding: 20px; background: white; font-family: Arial, sans-serif; }
            .marksheet-container { position: relative; width: 100%; max-width: 900px; margin: 0 auto; }
            .template-bg { position: relative; width: 100%; }
            .template-bg img { width: 100%; height: auto; display: block; }
            .content-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 40px; box-sizing: border-box; }
            .student-info { margin-bottom: 20px; font-size: 14px; }
            .student-info p { margin: 5px 0; }
            .marks-table { width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 12px; }
            .marks-table th, .marks-table td { border: 1px solid #333; padding: 8px; text-align: center; }
            .marks-table th { background: #f0f0f0; font-weight: bold; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-around; }
            .signature-box { text-align: center; }
            .signature-line { border-top: 1px solid #333; width: 150px; margin-top: 40px; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          <div class="marksheet-container">
            <div class="template-bg">
              <img src="${marksheetTemplate}" alt="Marksheet Template" />
              <div class="content-overlay">
                <div class="student-info">
                  <p><strong>Student Name:</strong> ${studentData?.name || '_______________'}</p>
                  <p><strong>Roll Number:</strong> ${studentData?.rollNumber || '_______________'}</p>
                  <p><strong>Class:</strong> ${studentData?.class?.className || '_______________'}</p>
                  <p><strong>Section:</strong> ${studentData?.section?.sectionName || '_______________'}</p>
                  <p><strong>Exam Type:</strong> ${examType.toUpperCase()}</p>
                </div>

                <table class="marks-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${marksData && marksData.length > 0 ? marksData.map(mark => `
                      <tr>
                        <td>${mark.subject || '___'}</td>
                        <td>${mark.marks || '___'}</td>
                        <td>${mark.grade || '___'}</td>
                      </tr>
                    `).join('') : `
                      <tr>
                        <td colspan="3">No marks data available</td>
                      </tr>
                    `}
                  </tbody>
                </table>

                <div class="signature-section">
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <p>Teacher Signature</p>
                  </div>
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <p>Principal Signature</p>
                  </div>
                </div>
              </div>
            </div>
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
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Marksheet Preview - {studentData?.name} ({examType?.name})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {marksheetTemplate ? (
            <div className="bg-gray-100 rounded-lg p-4 flex justify-center overflow-auto max-h-[500px]">
              <div className="relative" style={{ width: '800px' }}>
                <img
                  src={marksheetTemplate}
                  alt="Marksheet Template"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-sm">
                  <div>
                    <p><strong>Student:</strong> {studentData?.name}</p>
                    <p><strong>Roll No:</strong> {studentData?.rollNumber}</p>
                    <p><strong>Class:</strong> {studentData?.class?.className}</p>
                  </div>

                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 p-1">Subject</th>
                        <th className="border border-gray-400 p-1">Marks</th>
                        <th className="border border-gray-400 p-1">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marksData && marksData.length > 0 ? (
                        marksData.map((mark, idx) => (
                          <tr key={idx}>
                            <td className="border border-gray-400 p-1">{mark.subject}</td>
                            <td className="border border-gray-400 p-1 text-center">{mark.marks}</td>
                            <td className="border border-gray-400 p-1 text-center">{mark.grade}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="border border-gray-400 p-1 text-center">
                            No marks data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-yellow-800">
              <p className="font-semibold">⚠️ No Marksheet Template Found</p>
              <p className="text-sm">Please configure the marksheet template in School Settings first.</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Close
          </button>
          {marksheetTemplate && (
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
            >
              <FaPrint /> Print Marksheet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
