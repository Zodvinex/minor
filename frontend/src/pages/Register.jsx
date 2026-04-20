import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    role: 'student',
    department: '',
    enrollmentNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e9efff] to-[#f5f3ff] px-4 py-8 md:py-10">
      <div className="pointer-events-none absolute -top-16 -left-12 h-80 w-80 rounded-full bg-[#6470ff]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[360px] w-[360px] rounded-full bg-[#7f56d9]/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_30px_80px_-25px_rgba(37,54,138,0.4)] backdrop-blur">
        <section className="hidden w-[42%] bg-gradient-to-br from-[#273f95] via-[#333f99] to-[#5f42b6] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight">Create your account</h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join the AI proctoring platform with a secure profile and clean workflow.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#f7d27b]">Premium Experience</p>
            <p className="mt-2 text-sm text-indigo-100">
              Crafted with soft gradients, balanced contrast, and modern depth.
            </p>
          </div>
        </section>

        <section className="w-full max-h-[92vh] overflow-y-auto p-7 sm:p-10 md:w-[58%]">
          <h1 className="text-4xl font-bold tracking-tight text-[#172554] sm:text-[42px]">Register</h1>
          <p className="mt-2 text-base text-slate-600 sm:text-lg">Set up your profile to continue.</p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {formData.role === 'student' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                    placeholder="Enter your department"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Enrollment Number</label>
                  <input
                    type="text"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20"
                    placeholder="Enter your enrollment number"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 h-12 w-full rounded-xl bg-gradient-to-r from-[#3354df] via-[#4a4fd0] to-[#6b47c4] text-base font-semibold text-white shadow-[0_12px_24px_-12px_rgba(56,73,184,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#3752dd] underline underline-offset-4">
              Login here
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Register;
