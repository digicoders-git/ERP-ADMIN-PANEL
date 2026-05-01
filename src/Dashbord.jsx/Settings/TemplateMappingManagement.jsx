import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaMapMarkerAlt, FaGraduationCap, FaLayerGroup } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../api';

export default function TemplateMappingManagement({ branchId }) {
    const [mappings, setMappings] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        examType: '',
        classes: [],
        template: ''
    });

    useEffect(() => {
        if (branchId) {
            fetchInitialData();
        }
    }, [branchId]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Updated API endpoints to match backend routes
            const [mapRes, examRes, classRes, tempRes] = await Promise.all([
                api.get(`/api/template-mapping?branchId=${branchId}`),
                api.get(`/api/exam-type?branchId=${branchId}`),
                api.get(`/api/class/all?limit=200&branchId=${branchId}`),
                api.get(`/api/marksheet-template?branchId=${branchId}`)
            ]);

            setMappings(mapRes.data.data || []);
            setExamTypes(examRes.data.data || []);
            
            // Handle different possible class response structures
            const classData = classRes.data.classes || classRes.data.data || [];
            // Filter by branchId if the server returns all client classes
            const filteredClasses = classData.filter(cls => 
                (cls.branch?._id || cls.branch) === branchId
            );
            setClasses(filteredClasses);
            
            setTemplates(tempRes.data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMapping = async (e) => {
        e.preventDefault();
        if (!formData.examType || !formData.template) {
            Swal.fire('Error', 'Please select exam type and template', 'error');
            return;
        }

        try {
            await api.post('/api/template-mapping/create', { ...formData, branchId });
            Swal.fire('Success', 'Mapping created successfully', 'success');
            setShowForm(false);
            setFormData({ examType: '', classes: [], template: '' });
            fetchInitialData();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to create mapping', 'error');
        }
    };

    const handleDeleteMapping = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Mapping?',
            text: 'This will remove the template link for these classes',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/template-mapping/${id}`);
                fetchInitialData();
                Swal.fire('Deleted', 'Mapping removed', 'success');
            } catch (err) {
                Swal.fire('Error', 'Failed to delete mapping', 'error');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading mappings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Template Mapping</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <FaPlus /> {showForm ? 'Cancel' : 'Add Mapping'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleCreateMapping} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
                                <select
                                    value={formData.examType}
                                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">-- Select Exam Type --</option>
                                    {examTypes.map(et => <option key={et._id} value={et._id}>{et.examTypeName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Marksheet Template</label>
                                <select
                                    value={formData.template}
                                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">-- Select Template --</option>
                                    {templates.map(t => <option key={t._id} value={t._id}>{t.templateName}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Classes (Leave empty for All Classes)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {classes.map(cls => (
                                    <label key={cls._id} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.classes.includes(cls._id)}
                                            onChange={(e) => {
                                                const updated = e.target.checked 
                                                    ? [...formData.classes, cls._id]
                                                    : formData.classes.filter(id => id !== cls._id);
                                                setFormData({ ...formData, classes: updated });
                                            }}
                                        />
                                        <span className="text-sm">
                                            {cls.className} {cls.stream && cls.stream.length > 0 ? `(${Array.isArray(cls.stream) ? cls.stream.join(', ') : cls.stream})` : ''}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                        >
                            Save Mapping
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mappings.map(map => (
                    <div key={map._id} className="border-2 border-gray-100 rounded-xl p-4 bg-white hover:border-indigo-200 transition relative group">
                        <button
                            onClick={() => handleDeleteMapping(map._id)}
                            className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                            <FaTrash />
                        </button>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{map.examType?.examTypeName}</h4>
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaLayerGroup className="text-gray-400" />
                                        <span>Template: {map.template?.templateName}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <FaGraduationCap className="text-gray-400 mt-1" />
                                        <span>
                                            Classes: {map.classes?.length > 0 
                                                ? map.classes.map(c => `${c.className}${c.stream && c.stream.length > 0 ? ` (${c.stream})` : ''}`).join(', ') 
                                                : 'All Classes'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {mappings.length === 0 && !showForm && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                    <p className="text-gray-500">No mappings created yet. Start by mapping exam types to templates.</p>
                </div>
            )}
        </div>
    );
}
