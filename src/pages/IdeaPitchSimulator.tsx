import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import api from '../utils/api';

import ArenaSkeleton from '../components/skeleton/ArenaSkeleton';
import { AlertCircle, MessageSquare, Send, RefreshCw, ChevronLeft, ChevronRight, Star, CheckCircle2, Play, Sparkles, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  category: string;
  answer?: string;
  feedback?: Feedback | null;
}

interface Feedback {
  rating: number;
  strengths: string[];
  improvements: string[];
  additionalAdvice: string;
}

const IdeaPitchSimulator = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  
  const { currentIdea: idea, loading: ideaLoading } = useSelector((state: RootState) => state.idea);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIdeaData = async () => {
      if (id && !idea) {
        try {
          await dispatch(getIdea(id));
        } catch (err) {
          setError('Failed to load idea data');
        }
      }
    };
    loadIdeaData();
  }, [dispatch, id, idea]);

  useEffect(() => {
    if (idea?.pitchSimulation?.questions) {
      const questionsList = idea.pitchSimulation.questions;
      setQuestions(questionsList);
      
      if (questionsList.length > 0 && !currentQuestion) {
        const firstQuestion = questionsList[0];
        setCurrentQuestion(firstQuestion);
        setCurrentQuestionIndex(0);
        setAnswer(firstQuestion.answer || '');
        setFeedback(firstQuestion.feedback || null);
      }
    }
  }, [idea?.pitchSimulation?.questions]);

  useEffect(() => {
    if (idea) {
      const existingQuestions = idea.pitchSimulation?.questions;

      if (existingQuestions && existingQuestions.length > 0) {
        setQuestions(existingQuestions);
        setCurrentQuestion(existingQuestions[0]);
        setCurrentQuestionIndex(0);
        setAnswer(existingQuestions[0].answer || '');
        setFeedback(existingQuestions[0].feedback || null);
      } else {
        setQuestions([]);
        setCurrentQuestion(null);
        setCurrentQuestionIndex(0);
        setAnswer('');
        setFeedback(null);
      }
    }
  }, [idea]);

  const simulatePitch = async () => {
    if (!idea?.ideaText) return;
    
    try {
      setLoading(true);
      setError(null);
      setQuestions([]);
      setCurrentQuestion(null);
      setFeedback(null);

      const response = await api.post(
        `/api/pitch-simulator/simulate/${idea._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            regenerate: true
          }
        }
      );

      if (response.data.pitchSimulation?.questions) {
        const newQuestions = response.data.pitchSimulation.questions;
        setQuestions(newQuestions);
        if (newQuestions.length > 0) {
          setCurrentQuestion(newQuestions[0]);
          setCurrentQuestionIndex(0);
          setAnswer('');
          setFeedback(null);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to simulate pitch');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentQuestion || !idea?._id || !answer.trim()) return;
    
    try {
      setIsEvaluating(true);
      setError(null);

      const response = await api.post(
        `/api/pitch-simulator/evaluate/${idea._id}`,
        {
          questionId: currentQuestion.id,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedQuestions = questions.map(q => {
        if (q.id === currentQuestion.id) {
          return {
            ...q,
            answer,
            feedback: response.data.feedback
          };
        }
        return q;
      });

      setQuestions(updatedQuestions);
      setFeedback(response.data.feedback);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to evaluate answer');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[prevIndex];
      setCurrentQuestionIndex(prevIndex);
      setCurrentQuestion(prevQuestion);
      setAnswer(prevQuestion.answer || '');
      setFeedback(prevQuestion.feedback || null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(nextQuestion);
      setAnswer(nextQuestion.answer || '');
      setFeedback(nextQuestion.feedback || null);
    }
  };

  if (ideaLoading || loading) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <ArenaSkeleton />
        </div>
      </div>
    );
  }

  if (error && !idea) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 flex items-center justify-center selection:bg-[#7c3aed]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <motion.div 
          className="relative z-10 text-center p-6 rounded-2xl bg-[#0a0a0a]/95 border border-white/10 max-w-sm mx-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="text-[15px] font-semibold mb-1 text-white">Error Loading Pitch</h3>
          <p className="text-[11px] text-gray-400 mb-4">{error}</p>
          <Link
            to="/saved-ideas"
            className="btn-primary inline-block py-1.5 px-4 rounded-lg text-xs font-semibold"
          >
            Back to Saved Ideas
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-[#7c3aed]" />
              </div>
              <div>
                <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white">
                  Pitch Simulator
                </h1>
                <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#7c3aed]" />
                  Practice with AI-powered investor Q&A
                </p>
              </div>
            </div>
            
            {questions.length > 0 && (
              <button
                onClick={() => simulatePitch()}
                disabled={loading}
                className="self-start sm:self-auto px-3.5 py-1.5 sm:py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white text-[11px] sm:text-[12px] font-medium rounded-lg border border-white/10 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate Questions</span>
              </button>
            )}
          </div>

          {/* Pitch Banner Card */}
          <div className="rounded-[14px] bg-[#0a0a0a]/95 border border-white/10 p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed] flex-shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-[12px] sm:text-[13px] font-semibold text-white">
                Your Pitch
              </h2>
            </div>
            <p className="text-[11px] sm:text-[12px] leading-relaxed text-gray-300">
              {idea?.ideaText}
            </p>
          </div>
        </motion.div>

        {/* Dismissible Error Banner */}
        {error && (
          <motion.div 
            className="mb-4 flex items-center justify-between p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[11px] sm:text-[12px]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors ml-4"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Questions and Answers Section */}
        {questions.length > 0 ? (
          <motion.div 
            className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-4 sm:p-6 mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {currentQuestion ? (
              <div>
                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5 text-[11px] font-medium text-gray-400">
                    <span>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-[#a78bfa]">
                      {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden bg-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-[#7c3aed] to-[#9061f9] transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Display */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#141414]/90 border border-white/10 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/30 flex items-center justify-center text-[#a78bfa] flex-shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[12px] font-semibold text-white">
                        Investor Question
                      </span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/30">
                      {currentQuestion.category}
                    </span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] leading-relaxed text-white font-medium">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Answer Form */}
                <form onSubmit={handleAnswer}>
                  <div className="mb-4">
                    <label
                      htmlFor="answer"
                      className="block text-[11px] sm:text-[12px] font-medium mb-1.5 text-gray-300"
                    >
                      Your Answer
                    </label>
                    <div className="relative">
                      <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={4}
                        disabled={isEvaluating}
                        className="w-full p-3 pb-6 text-[12px] rounded-xl border bg-[#141414] border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors resize-none leading-relaxed disabled:opacity-50"
                        placeholder="Type your pitch answer here... Be confident, crisp, and address the investor's core concern."
                      />
                      <div className="absolute bottom-2 right-2 text-[10px] font-medium text-gray-500">
                        {answer.length} characters
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!feedback && (
                    <button
                      type="submit"
                      disabled={isEvaluating || !answer.trim()}
                      className={
                        isEvaluating || !answer.trim()
                          ? "w-full py-2 px-5 rounded-lg text-[12px] font-medium bg-[#141414] text-gray-500 border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
                          : "btn-primary w-full py-2 px-5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2"
                      }
                    >
                      {isEvaluating ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Evaluating Answer...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Answer for Evaluation</span>
                        </>
                      )}
                    </button>
                  )}
                </form>

                {/* Feedback Section */}
                {feedback && (
                  <motion.div 
                    className="mt-5 space-y-3 pt-4 border-t border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/30 flex items-center justify-center text-[#a78bfa]">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[13px] font-semibold text-white">
                        AI Feedback & Evaluation
                      </h3>
                    </div>
                    
                    <div className="p-3.5 rounded-xl bg-[#141414]/90 border border-white/10 space-y-3">
                      {/* Rating */}
                      <div className="p-3 rounded-lg bg-[#1a1625] border border-[#7c3aed]/20 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-medium text-gray-300 block mb-1">
                            Performance Rating
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < feedback.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-[18px] font-bold text-yellow-400">
                          {feedback.rating}<span className="text-gray-400 text-xs font-normal">/5</span>
                        </div>
                      </div>

                      {/* Strengths */}
                      {feedback.strengths && feedback.strengths.length > 0 && (
                        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                          <h4 className="text-[11px] font-semibold text-green-400 mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                            Strengths
                          </h4>
                          <ul className="space-y-1.5">
                            {feedback.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                                <span className="text-[11px] text-gray-300 leading-relaxed">
                                  {strength}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {feedback.improvements && feedback.improvements.length > 0 && (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                          <h4 className="text-[11px] font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-1.5">
                            {feedback.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                <span className="text-[11px] text-gray-300 leading-relaxed">
                                  {improvement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Additional Advice */}
                      {feedback.additionalAdvice && (
                        <div className="p-3 rounded-lg bg-[#7c3aed]/5 border border-[#7c3aed]/15">
                          <h4 className="text-[11px] font-semibold text-[#a78bfa] mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
                            Additional Advice
                          </h4>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            {feedback.additionalAdvice}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`flex-1 py-2 px-4 rounded-lg text-[11px] sm:text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      currentQuestionIndex === 0
                        ? 'bg-[#141414] text-gray-600 border border-white/5 cursor-not-allowed'
                        : 'bg-[#141414] hover:bg-[#1a1a1a] text-white border border-white/10'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous Question</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`flex-1 py-2 px-4 rounded-lg text-[11px] sm:text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      currentQuestionIndex === questions.length - 1
                        ? 'bg-[#141414] text-gray-600 border border-white/5 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3 text-[#7c3aed]">
                  <Play className="w-5 h-5 fill-[#7c3aed]" />
                </div>
                <h3 className="text-[15px] font-semibold mb-1 text-white">
                  Ready to Begin?
                </h3>
                <p className="text-[11px] sm:text-[12px] mb-4 text-gray-400 max-w-sm mx-auto">
                  Start your Q&A session and practice your pitch with AI-powered investor questions.
                </p>
                <button
                  onClick={() => setCurrentQuestion(questions[0])}
                  className="btn-primary inline-flex items-center py-2 px-5 rounded-lg text-[12px] font-semibold gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Q&A Session</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-8 sm:p-10 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#7c3aed] shadow-inner">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold mb-2 text-white">
              No Questions Available
            </h3>
            <p className="text-[11px] sm:text-[12px] mb-5 text-gray-400 max-w-md mx-auto leading-relaxed">
              Generate AI-powered investor questions tailored to your pitch. Practice your responses and receive instant feedback to improve your presentation skills.
            </p>
            <button
              onClick={simulatePitch}
              disabled={loading}
              className="btn-primary inline-flex items-center py-2 px-5 rounded-lg text-[12px] font-semibold gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Questions...</span>
                </div>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Generate Questions</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IdeaPitchSimulator;