import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "./api";

function SchoolAdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email address';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", { ...formData, panel: 'schoolAdmin' });
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate("/dashbord");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Floating Background Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-10 left-40 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">SC</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              School Admin Login
            </h1>
            <p className="text-gray-300">Manage students, teachers & classes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-200">
                School Admin Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({...errors, email: ''}); }}
                placeholder="schooladmin@school.edu"
                className={`mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.email ? 'border-red-400' : 'border-white/20'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-200">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({...errors, password: ''}); }}
                  placeholder="Min 6 characters"
                  className={`mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.password ? 'border-red-400' : 'border-white/20'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] active:scale-95 transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login as School Admin"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">
            © 2025 School Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default SchoolAdminLogin;