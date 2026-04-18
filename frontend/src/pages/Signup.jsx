import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';

function Signup() {
  const [email, setEmail] = useState('');
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
  const [step, setStep] = useState('email'); // 'email' or 'details'
  const navigate = useNavigate();

  const handleEmailContinue = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setFormData(prev => ({ ...prev, email }));
    setStep('details');
    setError('');
  };

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Welcome! Create an account to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailContinue} className="space-y-6">
            {/* Google Sign-in Button */}
            <button
              type="button"
              className="w-full border border-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <text x="3" y="18" fontSize="14" fill="currentColor" fontWeight="bold">G</text>
              </svg>
              <span>Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="text-gray-500 text-sm">Or continue With</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500 placeholder-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition"
            >
              Continue
            </button>

            {/* Sign In Link */}
            <p className="text-center text-gray-400">
              Have an account ? <Link to="/login" className="text-white font-semibold hover:underline">Sign In</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-gray-400 hover:text-white text-sm mb-4"
            >
              ← Back
            </button>

            {/* Full Name */}
            <div>
              <label className="block text-white font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500 placeholder-gray-600"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500 placeholder-gray-600"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-white font-semibold mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500 placeholder-gray-600"
                placeholder="Enter your age"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-white font-semibold mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Department & Enrollment (conditional) */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-white font-semibold mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500 placeholder-gray-600"
                    placeholder="Enter your department"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Enrollment Number</label>
                  <input
                    type="text"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gray-500 placeholder-gray-600"
                    placeholder="Enter your enrollment number"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-600 mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
