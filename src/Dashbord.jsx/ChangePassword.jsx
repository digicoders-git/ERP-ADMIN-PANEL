import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api";

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.oldPassword) e.oldPassword = "Current password is required";
    else if (form.oldPassword.length < 6) e.oldPassword = "Password must be at least 6 characters";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 6) e.newPassword = "Password must be at least 6 characters";
    else if (form.newPassword === form.oldPassword) e.newPassword = "New password must be different from current password";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your new password";
    else if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/api/admin/change-password", { oldPassword: form.oldPassword, newPassword: form.newPassword });
      Swal.fire({ icon: "success", title: "Password Updated", text: "Your password has been changed successfully.", timer: 2000, showConfirmButton: false });
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "oldPassword", label: "Current Password", placeholder: "Enter your current password", showKey: "old" },
    { key: "newPassword", label: "New Password", placeholder: "Min 6 characters", showKey: "new" },
    { key: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password", showKey: "confirm" },
  ];

  const inputCls = (key) =>
    `w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black text-sm ${errors[key] ? "border-red-400 bg-red-50" : "border-gray-300"}`;

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Secure your account with a new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, placeholder, showKey }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <input
                  type={show[showKey] ? "text" : "password"}
                  value={form[key]}
                  onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
                  placeholder={placeholder}
                  className={inputCls(key)}
                />
                <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60 text-sm">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
