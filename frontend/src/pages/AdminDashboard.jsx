import React, { useState, useEffect, useContext } from 'react';
import { getAdminExams, deleteExam, publishExam, getAdminExamAttempts } from '../utils/api';
import CreateExamModal from '../components/CreateExamModal';
import { ThemeContext } from '../context/ThemeContext';

function AdminDashboard() {
  const { isDark } = useContext(ThemeContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await getAdminExams();
      setExams(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(examId);
        setExams(exams.filter(exam => exam._id !== examId));
      } catch (err) {
        setError('Failed to delete exam');
      }
    }
  };

  const handlePublishExam = async (examId) => {
    try {
      const exam = exams.find(e => e._id === examId);
      await publishExam(examId, { isPublished: !exam.isPublished, status: 'Active' });
      fetchExams();
    } catch (err) {
      setError('Failed to publish exam');
    }
  };

  const handleViewAttempts = async (exam) => {
    try {
      setSelectedExam(exam);
      setAttemptsLoading(true);
      const response = await getAdminExamAttempts(exam._id);
      setAttempts(response.data);
      setShowAnalysis(true);
    } catch (err) {
      setError('Failed to fetch student attempts');
    } finally {
      setAttemptsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center text-xl ${
        isDark
          ? 'bg-gradient-to-br from-[#0e1a36] via-[#151a3b] to-[#22182f] text-slate-200'
          : 'bg-gradient-to-br from-[#edf2ff] via-[#e8efff] to-[#f5f3ff] text-[#253180]'
      }`}>
        Loading exams...
      </div>
    );
  }

  const publishedCount = exams.filter((exam) => exam.isPublished).length;
  const draftCount = exams.length - publishedCount;

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
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDark ? 'text-[#c2b6ff]' : 'text-[#6a56bf]'}`}>Control Center</p>
              <h1 className={`mt-1 text-3xl font-black tracking-tight md:text-4xl ${isDark ? 'text-slate-100' : 'text-[#172554]'}`}>Admin Dashboard</h1>
              <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Manage exams, monitor attempts, and publish with confidence.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className={`rounded-xl px-6 py-3 font-bold text-white transition hover:brightness-110 ${
                isDark
                  ? 'bg-gradient-to-r from-[#2a4fcf] via-[#3d43a8] to-[#59399f] shadow-[0_0_30px_rgba(92,98,222,0.32)]'
                  : 'bg-gradient-to-r from-[#2f55df] via-[#474fcf] to-[#6a47c4] shadow-[0_14px_28px_-14px_rgba(64,72,187,0.9)]'
              }`}
            >
              + Create Exam
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className={`rounded-2xl p-4 ${
              isDark
                ? 'border border-white/10 bg-white/5 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.9)]'
                : 'border border-[#d7dfff] bg-gradient-to-br from-[#f5f8ff] to-[#ecf1ff] shadow-sm'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total Exams</p>
              <p className={`mt-1 text-3xl font-black ${isDark ? 'text-slate-100' : 'text-[#1f2d80]'}`}>{exams.length}</p>
            </div>
            <div className={`rounded-2xl p-4 ${
              isDark
                ? 'border border-white/10 bg-white/5 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.9)]'
                : 'border border-[#d7dfff] bg-gradient-to-br from-[#f4f8ff] to-[#edf3ff] shadow-sm'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Published</p>
              <p className={`mt-1 text-3xl font-black ${isDark ? 'text-slate-100' : 'text-[#1f2d80]'}`}>{publishedCount}</p>
            </div>
            <div className={`rounded-2xl p-4 ${
              isDark
                ? 'border border-[#7f6730]/45 bg-gradient-to-br from-[#2c2734] to-[#1f1a23] shadow-[0_0_30px_rgba(200,160,80,0.16)]'
                : 'border border-[#efe1bd] bg-gradient-to-br from-[#fff8e7] to-[#fff2d0] shadow-sm'
            }`}>
              <p className={`text-sm ${isDark ? 'text-[#ecd8a2]' : 'text-slate-600'}`}>Drafts</p>
              <p className={`mt-1 text-3xl font-black ${isDark ? 'text-[#f8de9d]' : 'text-[#6a4b12]'}`}>{draftCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={fetchExams}
            className={`rounded-xl px-4 py-2 font-semibold transition ${
              isDark
                ? 'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                : 'border border-[#ccd6ff] bg-white text-[#2641ac] hover:bg-[#eef2ff]'
            }`}
          >
            Refresh Exams
          </button>
        </div>

        {error && (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${
            isDark ? 'border border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border border-red-300 bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {showModal && (
          <CreateExamModal
            onClose={() => setShowModal(false)}
            onExamCreated={() => {
              setShowModal(false);
              fetchExams();
            }}
          />
        )}

        {exams.length === 0 ? (
          <div className={`rounded-2xl py-16 text-center ${
            isDark ? 'border border-white/10 bg-white/5 shadow-[0_18px_35px_-24px_rgba(15,23,42,0.9)]' : 'border border-[#dbe3ff] bg-white/80 shadow-sm'
          }`}>
            <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No exams created yet</p>
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
                    <p className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{exam.subject}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                      <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#22305f]/65 text-slate-200' : 'bg-[#eef2ff] text-[#3046a3]'}`}><span className="font-semibold">Duration:</span> {exam.duration} min</p>
                      <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#22305f]/65 text-slate-200' : 'bg-[#eef2ff] text-[#3046a3]'}`}><span className="font-semibold">Questions:</span> {exam.totalQuestions}</p>
                      <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#22305f]/65 text-slate-200' : 'bg-[#eef2ff] text-[#3046a3]'}`}><span className="font-semibold">Marks:</span> {exam.totalMarks}</p>
                      <p className={`rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-[#30271d]/75 text-[#f8de9d]' : 'bg-[#fff7e7] text-[#8a631d]'}`}><span className="font-semibold">Pass:</span> {exam.passingScore}</p>
                    </div>
                  </div>
                  <div className="space-y-2 md:ml-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      exam.isPublished
                        ? (isDark ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                        : (isDark ? 'bg-amber-400/20 text-amber-200' : 'bg-amber-100 text-amber-700')
                    }`}>
                      {exam.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className={`block text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{exam.status}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleViewAttempts(exam)}
                    className={`rounded-xl px-4 py-2 font-semibold text-white transition ${isDark ? 'bg-[#3750c7] hover:bg-[#2e43a7]' : 'bg-[#2f55df] hover:bg-[#2746bf]'}`}
                  >
                    View Attempts
                  </button>
                  <button
                    onClick={() => handlePublishExam(exam._id)}
                    className={`rounded-xl px-4 py-2 font-semibold transition ${
                      exam.isPublished
                        ? 'bg-amber-400 text-[#1f2937] hover:bg-amber-500'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {exam.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam._id)}
                    className="rounded-xl bg-rose-500 px-4 py-2 font-semibold text-white transition hover:bg-rose-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAnalysis && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${isDark ? 'bg-[#050914]/72' : 'bg-[#0f172a]/55'}`}>
          <div className={`max-h-[82vh] w-full max-w-4xl overflow-y-auto rounded-2xl shadow-[0_32px_70px_-25px_rgba(20,39,112,0.55)] ${
            isDark ? 'border border-white/10 bg-[#111a35]/95' : 'border border-[#d8e0ff] bg-white'
          }`}>
            <div className={`sticky top-0 flex items-center justify-between border-b p-6 backdrop-blur ${
              isDark ? 'border-white/10 bg-[#111a35]/95' : 'border-[#e5eafc] bg-white/95'
            }`}>
              <h2 className={`text-xl font-black tracking-tight md:text-2xl ${isDark ? 'text-slate-100' : 'text-[#1a286f]'}`}>{selectedExam?.title} - Student Attempts</h2>
              <button
                onClick={() => setShowAnalysis(false)}
                className={`rounded-lg px-3 py-1 text-xl transition ${isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {attemptsLoading ? (
                <div className="text-center py-8">
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Loading attempts...</p>
                </div>
              ) : attempts.length === 0 ? (
                <div className="text-center py-8">
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>No student attempts yet</p>
                </div>
              ) : (
                <div className={`overflow-x-auto rounded-xl ${isDark ? 'border border-white/10' : 'border border-[#e2e8ff]'}`}>
                  <table className="w-full">
                    <thead className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'bg-[#eff3ff]'}`}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Student Name</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Email</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Score</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Status</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-[#3046a3]'}`}>Attempted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt, index) => (
                        <tr key={index} className={`border-b ${isDark ? 'border-white/10 bg-transparent hover:bg-white/5' : 'border-[#edf1ff] bg-white hover:bg-[#f8f9ff]'}`}>
                          <td className={`px-4 py-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{attempt.studentId?.name || 'Unknown'}</td>
                          <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{attempt.studentId?.email || 'N/A'}</td>
                          <td className={`px-4 py-3 font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{attempt.totalMarksObtained || 0}/{selectedExam?.totalMarks || 0}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              attempt.status === 'InProgress'
                                ? (isDark ? 'bg-amber-400/20 text-amber-200' : 'bg-amber-100 text-amber-700')
                                : attempt.isPassed
                                ? (isDark ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                                : (isDark ? 'bg-rose-500/20 text-rose-200' : 'bg-rose-100 text-rose-700')
                            }`}>
                              {attempt.status === 'InProgress' ? 'In Progress' : attempt.isPassed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {attempt.startTime ? new Date(attempt.startTime).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
