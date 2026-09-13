import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import api from '../utils/api';

import ArenaSkeleton from '../components/skeleton/ArenaSkeleton';
import { AlertCircle, MessageSquare, Send, RefreshCw, ChevronLeft, ChevronRight, Star, CheckCircle, Play, Sparkles, Target, Zap } from 'lucide-react';
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
      <div className='px-4 py-2'>
        <ArenaSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-[#0a0118]`}>
        <motion.div 
          className={`text-center p-8 rounded-3xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/50">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 text-white`}>Error</h3>
          <p className={`text-sm text-gray-400`}>{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden bg-[#0a0118]`}>
      <PageBackground theme="orange" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/50`}>
                <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-md md:text-lg font-black text-white`}>
                  Pitch Simulator
                </h1>
                <p className={`text-xs text-gray-400 font-medium flex items-center gap-2`}>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                  Practice with AI-powered investor Q&A
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={() => simulatePitch()}
              disabled={loading}
              className="px-6 py-1 sm:py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regenerate Questions
            </motion.button>
          </div>

          {/* Pitch Banner */}
          <motion.div 
            className={`relative overflow-hidden rounded-3xl p-3 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 border border-orange-500/20`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-orange-600/5 via-red-600/5 to-pink-600/5 backdrop-blur-3xl`} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-xl">
                  <Target className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <h2 className={`text-sm font-bold text-white`}>
                  Your Pitch
                </h2>
              </div>
              <p className={`text-xs leading-relaxed text-gray-300`}>
                {idea?.ideaText}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Questions and Answers Section */}
        {questions.length > 0 ? (
          <motion.div 
            className={`bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-3`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {currentQuestion ? (
              <div>
                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold text-gray-400`}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className={`text-xs font-semibold text-gray-400`}>
                      {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className={`h-1 rounded-full overflow-hidden bg-gray-800`}>
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-600 to-red-600 shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Question Display */}
                <div className={`relative overflow-hidden p-3 rounded-2xl mb-4 bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20`}>
                  <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-600/10 blur-3xl`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-xl">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm text-white`}>
                            Investor Question
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-600/20 text-orange-300`}>
                            {currentQuestion.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed text-white font-medium`}>
                      {currentQuestion.question}
                    </p>
                  </div>
                </div>

                {/* Answer Form */}
                <form onSubmit={handleAnswer}>
                  <div className="mb-6">
                    <label
                      htmlFor="answer"
                      className={`block text-sm font-bold mb-3 text-gray-300`}
                    >
                      Your Answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={6}
                      disabled={isEvaluating}
                      className={`w-full px-3 py-2 text-xs rounded-2xl border-2 transition-all duration-300 ${
                        'bg-gray-800/50 text-white border-gray-700 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-800'
                      } focus:ring-1 focus:ring-orange-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Type your pitch answer here... Be confident and concise!"
                    />
                  </div>

                  {/* Submit Button */}
                  {!feedback && (
                    <motion.button
                      type="button"
                      onClick={(e) => handleAnswer(e)}
                      disabled={isEvaluating || !answer.trim()}
                      className={`w-full flex justify-center items-center py-2 px-5 rounded-2xl text-xs font-bold text-white transition-all duration-300 ${
                        isEvaluating || !answer.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-orange-500/50'
                      }`}
                      whileHover={!(isEvaluating || !answer.trim()) ? { scale: 1.02 } : {}}
                      whileTap={!(isEvaluating || !answer.trim()) ? { scale: 0.98 } : {}}
                    >
                      {isEvaluating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3" />
                          Evaluating Answer...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Answer for Evaluation
                        </>
                      )}
                    </motion.button>
                  )}
                </form>

                {/* Feedback Section */}
                {feedback && (
                  <motion.div 
                    className="mt-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-sm font-black text-white`}>
                        AI Feedback
                      </h3>
                    </div>
                    
                    <div className={`p-2 rounded-2xl bg-gray-800/50 border border-gray-700`}>
                      {/* Rating */}
                      <div className={`p-3 rounded-xl mb-4 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border border-yellow-500/20`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-sm font-semibold text-gray-300 mb-2 block`}>
                              Performance Rating
                            </span>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < feedback.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className={`text-xl font-black text-yellow-400`}>
                            {feedback.rating}/5
                          </div>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className={`p-3 rounded-xl mb-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20`}>
                        <h4 className={`text-sm font-bold mb-4 text-white flex items-center`}>
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0" />
                              <span className={`text-xs leading-relaxed text-gray-300`}>
                                {strength}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div className={`p-3 rounded-xl mb-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20`}>
                        <h4 className={`text-sm font-bold mb-4 text-white flex items-center`}>
                          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-2">
                          {feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                              <span className={`text-xs leading-relaxed text-gray-300`}>
                                {improvement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Additional Advice */}
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20`}>
                        <h4 className={`text-sm font-bold mb-2 text-white flex items-center`}>
                          <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                          Additional Advice
                        </h4>
                        <p className={`text-xs leading-relaxed text-gray-300`}>
                          {feedback.additionalAdvice}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-5">
                  <motion.button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`flex-1 py-2 px-6 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg hover:shadow-xl'
                    }`}
                    whileHover={currentQuestionIndex !== 0 ? { scale: 1.02 } : {}}
                    whileTap={currentQuestionIndex !== 0 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Question
                  </motion.button>

                  <motion.button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`flex-1 py-2 px-6 rounded-xl text-xs font-bold text-white transition-all duration-300 flex items-center justify-center ${
                      currentQuestionIndex === questions.length - 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/25'
                    }`}
                    whileHover={currentQuestionIndex !== questions.length - 1 ? { scale: 1.02 } : {}}
                    whileTap={currentQuestionIndex !== questions.length - 1 ? { scale: 0.98 } : {}}
                  >
                    Next Question
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/50">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 text-white`}>
                  Ready to Begin?
                </h3>
                <p className={`text-sm mb-6 text-gray-400 max-w-md mx-auto`}>
                  Start your Q&A session and practice your pitch with AI-powered investor questions.
                </p>
                <motion.button
                  onClick={() => setCurrentQuestion(questions[0])}
                  className="inline-flex items-center px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Q&A Session
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className={`bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/50">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h3 className={`text-2xl font-black mb-3 text-white`}>
              No Questions Available
            </h3>
            <p className={`text-sm mb-8 text-gray-400 max-w-2xl mx-auto leading-relaxed`}>
              Generate AI-powered investor questions tailored to your pitch. Practice your responses and receive instant feedback to improve your presentation skills.
            </p>
            <motion.button
              onClick={simulatePitch}
              className="inline-flex items-center px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 mr-3" />
              Generate Questions
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IdeaPitchSimulator;