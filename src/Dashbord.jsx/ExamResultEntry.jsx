import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaPrint, FaSearch, FaChevronDown } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api';
import MarksheetPrint from './MarksheetPrint';

export default function ExamResultEntry() {
  const [examTypes, setExamTypes] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [examTypeSearch, setExamTypeSearch] = useState('');
  const [showExamTypeDropdown, setShowExamTypeDropdown] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  
  const [marksData, setMarksData] = useState([]);
  const [showPrint, setShowPrint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState(localStorage.getItem('selectedBranch') || '');

  useEffect(() => {
    if (branchId) {
      fetchExamTypes();
      fetchStudents();
    }
  }, [branchId]);

  const fetchExamTypes = async () => {
    if (!branchId) return;
    try {
      const res = await api.get(`/api/client-settings/exam-types?branchId=${branchId}`);
      setExamTypes(res.data.examTypes?.filter(et => et.isActive) || []);
    } catch (err) {
      console.error('Fetch exam types error:', err);
      Swal.fire('Error', 'Failed to load exam types', 'error');
    }
  };

  const fetchStudents = async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/student?branchId=${branchId}&limit=1000`);
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExamTypes = examTypes.filter(et =>
    et.name.toLowerCase().includes(examTypeSearch.toLowerCase()) ||
    et.code.toLowerCase().includes(examTypeSearch.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleSelectExamType = (examType) => {
    setSelectedExamType(examType);
    setExamTypeSearch('');
    setShowExamTypeDropdown(false);
    setMarksData([]);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setStudentSearch('');
    setShowStudentDropdown(false);
    
    // Initialize marks data with student's subjects
    const subjects = student.subjects || ['English', 'Mathematics', 'Science', 'Social Studies'];
    setMarksData(subjects.map(subject => ({ subject, marks: '', grade: '' })));
  };

  const handleMarksChange = (index, field, value) => {
    const updated = [...marksData];
    updated[index][field] = value;
    
    if (field === 'marks' && value) {
      const marks = parseInt(value);
      if (marks >= 90) updated[index].grade = 'A+';
      else if (marks >= 80) updated[index].grade = 'A';
      else if (marks >= 70) updated[index].grade = 'B+';
      else if (marks >= 60) updated[index].grade = 'B';
      else if (marks >= 50) updated[index].grade = 'C';
      else updated[index].grade = 'F';
    }
    
    setMarksData(updated);
  };

  const handleAddSubject = () => {
    setMarksData([...marksData, { subject: '', marks: '', grade: '' }]);
  };

  const handleRemoveSubject = (index) => {
    setMarksData(marksData.filter((_, i) => i !== index));
  };

  const handlePrintMarksheet = () => {
    if (!selectedExamType) {
      Swal.fire('Error', 'Please select an exam type', 'error');
      return;
    }
    if (!selectedStudent) {
      Swal.fire('Error', 'Please select a student', 'error');
      return;
    }
    if (marksData.some(m => !m.subject || !m.marks)) {
      Swal.fire('Error', 'Please fill all subject marks', 'error');
      return;
    }
    setShowPrint(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Result Entry</h2>
        <p className="text-gray-600">Select exam type, student, enter marks and generate marksheet</p>
      </div>

      {/* Exam Type Selection with Dropdown */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Exam Type *</label>
        <div className="relative">
          <button
            onClick={() => setShowExamTypeDropdown(!showExamTypeDropdown)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          >
            <span className={selectedExamType ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {selectedExamType ? `${selectedExamType.name} (${selectedExamType.code})` : 'Select exam type...'}
            </span>
            <FaChevronDown className={`transition ${showExamTypeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showExamTypeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exam type..."
                    value={examTypeSearch}
                    onChange={(e) => setExamTypeSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredExamTypes.length > 0 ? (
                  filteredExamTypes.map(et => (
                    <button
                      key={et._id}
                      onClick={() => handleSelectExamType(et)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 transition"
                    >
                      <div className="font-semibold text-gray-900">{et.name}</div>
                      <div className="text-sm text-gray-600">{et.code} {et.description && `• ${et.description}`}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">No exam types found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Selection with Dropdown */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Student *</label>
        <div className="relative">
          <button
            onClick={() => setShowStudentDropdown(!showStudentDropdown)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          >
            <span className={selectedStudent ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {selectedStudent ? `${selectedStudent.name} (${selectedStudent.rollNumber})` : 'Search student...'}
            </span>
            <FaChevronDown className={`transition ${showStudentDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showStudentDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, roll no, email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <button
                      key={student._id}
                      onClick={() => handleSelectStudent(student)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 transition"
                    >
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        Roll: {student.rollNumber} • Class: {student.class?.className} • {student.email}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">No students found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedStudent && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm"><strong>Name:</strong> {selectedStudent.name}</p>
            <p className="text-sm"><strong>Roll No:</strong> {selectedStudent.rollNumber}</p>
            <p className="text-sm"><strong>Class:</strong> {selectedStudent.class?.className} - {selectedStudent.section?.sectionName}</p>
            <p className="text-sm"><strong>Email:</strong> {selectedStudent.email}</p>
          </div>
        )}
      </div>

      {/* Marks Entry */}
      {selectedStudent && selectedExamType && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Enter Marks & Grades</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Marks (out of 100)</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Grade</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((mark, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={mark.subject}
                        onChange={(e) => handleMarksChange(index, 'subject', e.target.value)}
                        placeholder="Subject name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={mark.marks}
                        onChange={(e) => handleMarksChange(index, 'marks', e.target.value)}
                        placeholder="0-100"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        value={mark.grade}
                        placeholder="Grade"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center font-semibold bg-gray-50"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveSubject(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleAddSubject}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold flex items-center gap-2"
          >
            <FaPlus /> Add Subject
          </button>
        </div>
      )}

      {/* Print Button */}
      {selectedStudent && selectedExamType && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handlePrintMarksheet}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg flex items-center gap-2"
          >
            <FaPrint /> Generate Marksheet
          </button>
        </div>
      )}

      {/* Print Modal */}
      {showPrint && selectedExamType && (
        <MarksheetPrint
          examType={selectedExamType}
          studentData={selectedStudent}
          marksData={marksData}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
}
