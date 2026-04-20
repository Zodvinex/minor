import React, { useState, useContext } from 'react';
import { createExam, importExamQuestions } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';

function CreateExamModal({ onClose, onExamCreated }) {
  const { isDark } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 60,
    totalMarks: 100,
    passingScore: 40,
    difficulty: 'Medium',
  });
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleImportQuestions = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setError('');
    setImportLoading(true);

    try {
      const response = await importExamQuestions(file);
      const importedQuestions = response.data?.questions || [];

      if (!importedQuestions.length) {
        setError('No questions found in the uploaded file');
        return;
      }

      const normalizedQuestions = importedQuestions
        .map((q) => {
          const options = (q.options || [])
            .map((opt) => String(opt || '').trim())
            .filter(Boolean)
            .slice(0, 4);

          while (options.length < 4) {
            options.push('');
          }

          return {
            questionText: String(q.questionText || '').trim(),
            options,
            correctAnswer: ''
          };
        })
        .filter((q) => q.questionText && q.options.filter(Boolean).length >= 2);

      if (!normalizedQuestions.length) {
        setError('Uploaded file did not contain valid multiple-choice questions');
        return;
      }

      setQuestions(normalizedQuestions);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Failed to import questions';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setImportLoading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const examData = {
        ...formData,
        questions: questions.map(q => ({
          questionText: q.questionText,
          options: q.options.map(o => o.trim()).filter(o => o),
          correctAnswer: q.correctAnswer,
          marks: Math.floor(formData.totalMarks / questions.length)
        }))
      };

      await createExam(examData);
      onExamCreated();
    } catch (err) {
      setError(err.response?.data || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${isDark ? 'bg-[#050914]/72' : 'bg-[#0f172a]/55'}`}>
      <div className={`max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl shadow-[0_32px_70px_-25px_rgba(20,39,112,0.55)] ${
        isDark ? 'border border-white/10 bg-[#111a35]/95' : 'border border-[#d8e0ff] bg-white'
      }`}>
        <div className={`sticky top-0 z-10 border-b p-6 backdrop-blur ${
          isDark ? 'border-white/10 bg-[#111a35]/95' : 'border-[#e5eafc] bg-white/95'
        }`}>
          <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-[#1a286f]'}`}>Create New Exam</h2>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Design exam details and question set in one place.</p>
        </div>

        <div className="p-6">

          {error && (
            <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              isDark ? 'border border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border border-red-300 bg-red-50 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Exam Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400' : 'border-slate-300 text-slate-700'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400' : 'border-slate-300 text-slate-700'
                  }`}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className={`w-full rounded-xl px-4 py-2 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400' : 'border-slate-300 text-slate-700'
                  }`}
                  rows="3"
                />
              </div>

              <div>
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100' : 'border-slate-300 text-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleFormChange}
                  className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100' : 'border-slate-300 text-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Passing Score</label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleFormChange}
                  className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100' : 'border-slate-300 text-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-2 block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                    isDark ? 'border-white/15 bg-white/5 text-slate-100' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-[#e7ebff]'}`}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-[#1a286f]'}`}>Questions</h3>
                <label className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 font-bold text-white transition hover:brightness-110 ${
                  isDark ? 'bg-gradient-to-r from-[#4250b0] to-[#5c3d94]' : 'bg-gradient-to-r from-[#4e49c9] to-[#6a47c4]'
                }`}>
                  {importLoading ? 'Importing...' : 'Import from PDF/DOCX'}
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleImportQuestions}
                    className="hidden"
                    disabled={importLoading || loading}
                  />
                </label>
              </div>
              {questions.map((q, qIndex) => (
                <div key={qIndex} className={`mb-6 rounded-2xl p-4 ${
                  isDark ? 'border border-white/10 bg-white/5' : 'border border-[#e2e8ff] bg-[#f8f9ff]'
                }`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-[#253180]'}`}>Question {qIndex + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className={`font-semibold transition ${isDark ? 'text-rose-300 hover:text-rose-200' : 'text-rose-600 hover:text-rose-700'}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Question text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    className={`mb-3 h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                      isDark ? 'border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400' : 'border-slate-300 text-slate-700'
                    }`}
                    required
                  />

                  <div className="mb-3 grid gap-2 md:grid-cols-2">
                    {q.options.map((opt, oIndex) => (
                      <input
                        key={oIndex}
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                          isDark ? 'border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400' : 'border-slate-300 text-slate-700'
                        }`}
                        required
                      />
                    ))}
                  </div>

                  <select
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    className={`h-11 w-full rounded-xl px-4 outline-none transition focus:border-[#4a5be7] focus:ring-2 focus:ring-[#4a5be7]/20 ${
                      isDark ? 'border-white/15 bg-white/5 text-slate-100' : 'border-slate-300 text-slate-700'
                    }`}
                    required
                  >
                    <option value="">Select correct answer</option>
                    {q.options.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt || `Option ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className={`rounded-xl px-4 py-2 font-bold text-white transition ${isDark ? 'bg-[#3750c7] hover:bg-[#2e43a7]' : 'bg-[#2f55df] hover:bg-[#2746bf]'}`}
              >
                + Add Question
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`rounded-xl px-6 py-2 font-bold transition ${
                  isDark
                    ? 'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl px-6 py-2 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 ${
                  isDark ? 'bg-gradient-to-r from-[#2a4fcf] to-[#4a3e9f]' : 'bg-gradient-to-r from-[#2f55df] to-[#4d46c7]'
                }`}
              >
                {loading ? 'Creating...' : 'Create Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateExamModal;
