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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Register to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google Sign-in Button */}
          <a
            href="http://localhost:8080/auth/google"
            className="w-full border border-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600"
              placeholder="Enter your email"
              required
            />
>>>>>>> 3eb16191b9353c1f3e55935de360022583a23132
          </div>
        </section>

<<<<<<< HEAD
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
=======
          {/* Password */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600"
              placeholder="Enter your age"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Department & Enrollment (conditional) */}
          {formData.role === 'student' && (
            <>
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600"
                  placeholder="Enter your department"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Enrollment Number</label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600"
                  placeholder="Enter your enrollment number"
                />
              </div>
            </>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-600 mt-6"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Sign In
          </Link>
        </p>
>>>>>>> 3eb16191b9353c1f3e55935de360022583a23132
      </div>
    </div>
  );
}

export default Register;
