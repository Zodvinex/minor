import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedExams, getExamHistory } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';

function StudentDashboard() {
  const { isDark } = useContext(ThemeContext);
  const [exams, setExams] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
    fetchHistory();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getPublishedExams();
      setExams(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch exams');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await getExamHistory();
      setHistory(response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center text-xl ${
        isDark
          ? 'bg-gradient-to-br from-[#0e1a36] via-[#151a3b] to-[#22182f] text-slate-200'
          : 'bg-gradient-to-br from-[#edf2ff] via-[#e8efff] to-[#f5f3ff] text-[#253180]'
      }`}>
        Loading...
      </div>
    );
  }

  const passedCount = history.filter((attempt) => attempt.isPassed).length;

  return (
    <div className={`relative min-h-screen overflow-hidden p-4 md:p-6 ${
      isDark
        ? 'bg-gradient-to-br from-[#0e1a36] via-[#161b3f] to-[#22182f]'
        : 'bg-gradient-to-br from-[#eef2ff] via-[#eaf0ff] to-[#f6f3ff]'
    }`}>
      <div className={`pointer-events-none absolute -top-16 -left-12 h-80 w-80 rounded-full blur-3xl ${
        isDark ? 'bg-[#4b63d6]/25' : 'bg-[#5a70f2]/20'
      }`} />
      <div className={`pointer-events-none absolute right-0 bottom-0 h-[360px] w-[360px] rounded-full blur-3xl ${
        isDark ? 'bg-[#6b45b8]/25' : 'bg-[#7249ce]/20'
      }`} />

      <div className="relative mx-auto max-w-7xl">
        <div className={`mb-8 rounded-3xl p-6 backdrop-blur md:p-8 ${
          isDark
            ? 'border border-white/10 bg-white/5 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.9)]'
            : 'border border-white/70 bg-white/90 shadow-[0_24px_70px_-28px_rgba(41,59,151,0.45)]'
        }`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDark ? 'text-[#c2b6ff]' : 'text-[#6a56bf]'}`}>Learning Console</p>
          <h1 className={`mt-1 text-3xl font-black tracking-tight md:text-4xl ${isDark ? 'text-slate-100' : 'text-[#172554]'}`}>Student Dashboard</h1>
          <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Take available exams and review your performance history.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className={`rounded-2xl p-4 ${
              isDark
                ? 'border border-white/10 bg-white/5 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.9)]'
                : 'border border-[#d7dfff] bg-gradient-to-br from-[#f5f8ff] to-[#ecf1ff] shadow-sm'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Available Exams</p>
              <p className={`mt-1 text-3xl font-black ${isDark ? 'text-slate-100' : 'text-[#1f2d80]'}`}>{exams.length}</p>
            </div>
            <div className={`rounded-2xl p-4 ${
              isDark
                ? 'border border-white/10 bg-white/5 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.9)]'
                : 'border border-[#d7dfff] bg-gradient-to-br from-[#f5f8ff] to-[#ecf1ff] shadow-sm'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Attempts</p>
              <p className={`mt-1 text-3xl font-black ${isDark ? 'text-slate-100' : 'text-[#1f2d80]'}`}>{history.length}</p>
            </div>
            <div className={`rounded-2xl p-4 ${
              isDark
                ? 'border border-[#7f6730]/45 bg-gradient-to-br from-[#2c2734] to-[#1f1a23] shadow-[0_0_30px_rgba(200,160,80,0.16)]'
                : 'border border-[#efe1bd] bg-gradient-to-br from-[#fff8e7] to-[#fff2d0] shadow-sm'
            }`}>
              <p className={`text-sm ${isDark ? 'text-[#ecd8a2]' : 'text-slate-600'}`}>Passed</p>
              <p className={`mt-1 text-3xl font-black ${isDark ? 'text-[#f8de9d]' : 'text-[#6a4b12]'}`}>{passedCount}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${
            isDark ? 'border border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border border-red-300 bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <div className={`mb-8 flex flex-wrap gap-3 rounded-2xl p-2 ${
          isDark ? 'border border-white/10 bg-white/5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.9)]' : 'border border-[#dbe3ff] bg-white/85 shadow-sm'
        }`}>
          <button
            onClick={() => setActiveTab('available')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:text-base ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-[#3454de] to-[#5c49c2] text-white shadow-[0_10px_26px_-14px_rgba(55,72,173,0.8)]'
                : (isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-[#eef2ff] hover:text-[#3046a3]')
            }`}
          >
            Available Exams ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:text-base ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#3454de] to-[#5c49c2] text-white shadow-[0_10px_26px_-14px_rgba(55,72,173,0.8)]'
                : (isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-[#eef2ff] hover:text-[#3046a3]')
            }`}
          >
            Exam History ({history.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div>
            {exams.length === 0 ? (
              <div className={`rounded-2xl py-16 text-center ${
                isDark ? 'border border-white/10 bg-white/5 shadow-[0_18px_35px_-24px_rgba(15,23,42,0.9)]' : 'border border-[#dbe3ff] bg-white/80 shadow-sm'
              }`}>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No exams available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {exams.map(exam => (
                  <div key={exam._id} className={`rounded-2xl p-6 transition hover:-translate-y-0.5 ${
                    isDark
                      ? 'border border-white/10 bg-white/5 shadow-[0_20px_50px_-30px_rgba(10,20,45,0.95)] hover:shadow-[0_24px_60px_-28px_rgba(77,68,190,0.4)]'
                      : 'border border-[#dae2ff] bg-white/95 shadow-[0_20px_50px_-32px_rgba(39,57,145,0.5)] hover:shadow-[0_24px_60px_-32px_rgba(39,57,145,0.62)]'
                  }`}>
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                      <div className="flex-1">
                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-[#1a286f]'}`}>{exam.title}</h3>
                        <p className={`mb-4 mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{exam.subject}</p>
                        {exam.description && (
                          <p className={`mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{exam.description}</p>
                        )}
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#22305f]/65 text-slate-200' : 'bg-[#eef2ff] text-[#3046a3]'}`}><span className="font-semibold">Duration:</span> {exam.duration} min</p>
                          <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#22305f]/65 text-slate-200' : 'bg-[#eef2ff] text-[#3046a3]'}`}><span className="font-semibold">Questions:</span> {exam.totalQuestions}</p>
                          <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#22305f]/65 text-slate-200' : 'bg-[#eef2ff] text-[#3046a3]'}`}><span className="font-semibold">Marks:</span> {exam.totalMarks}</p>
                          <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#30271d]/75 text-[#f8de9d]' : 'bg-[#fff7e7] text-[#8a631d]'}`}><span className="font-semibold">Pass:</span> {exam.passingScore}</p>
                        </div>
                      </div>
                      <div className="md:ml-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          exam.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                          exam.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {exam.difficulty}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartExam(exam._id)}
                      className={`mt-6 rounded-xl px-6 py-2.5 font-bold text-white transition hover:brightness-110 ${
                        isDark ? 'bg-gradient-to-r from-[#2a4fcf] to-[#4a3e9f] shadow-[0_0_28px_rgba(92,98,222,0.3)]' : 'bg-gradient-to-r from-[#2f55df] to-[#4d46c7]'
                      }`}
                    >
                      Start Exam →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <div className={`rounded-2xl py-16 text-center ${
                isDark ? 'border border-white/10 bg-white/5 shadow-[0_18px_35px_-24px_rgba(15,23,42,0.9)]' : 'border border-[#dbe3ff] bg-white/80 shadow-sm'
              }`}>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No exam attempts yet</p>
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-2xl ${
                isDark
                  ? 'border border-white/10 bg-white/5 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.9)]'
                  : 'border border-[#dde5ff] bg-white shadow-[0_16px_36px_-26px_rgba(39,57,145,0.48)]'
              }`}>
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'bg-[#eff3ff]'}`}>
                      <th className={`px-6 py-3 text-left font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Exam Title</th>
                      <th className={`px-6 py-3 text-left font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Subject</th>
                      <th className={`px-6 py-3 text-left font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Marks</th>
                      <th className={`px-6 py-3 text-left font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Percentage</th>
                      <th className={`px-6 py-3 text-left font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Status</th>
                      <th className={`px-6 py-3 text-left font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(attempt => (
                      <tr key={attempt.attemptId} className={`border-b ${isDark ? 'border-white/10 bg-transparent hover:bg-white/5' : 'border-[#edf1ff] bg-white hover:bg-[#f8f9ff]'}`}>
                        <td className={`px-6 py-3 font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{attempt.examTitle}</td>
                        <td className={`px-6 py-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{attempt.subject}</td>
                        <td className={`px-6 py-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{attempt.marksObtained}</td>
                        <td className={`px-6 py-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{attempt.percentage}%</td>
                        <td className="px-6 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            attempt.status === 'Graded'
                              ? (isDark ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                              : (isDark ? 'bg-amber-400/20 text-amber-200' : 'bg-amber-100 text-amber-700')
                          }`}>
                            {attempt.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            attempt.isPassed
                              ? (isDark ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                              : (isDark ? 'bg-rose-500/20 text-rose-200' : 'bg-rose-100 text-rose-700')
                          }`}>
                            {attempt.isPassed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
