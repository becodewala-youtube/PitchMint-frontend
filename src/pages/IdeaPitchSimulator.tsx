import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
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
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
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
          await dispatch(getIdea(id) as any);
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

      const response = await axios.post(
        `${API_URL}/api/pitch-simulator/simulate/${idea._id}`,
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

      const response = await axios.post(
        `${API_URL}/api/pitch-simulator/evaluate/${idea._id}`,
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
        <motion.div 
          className={`text-center p-8 rounded-3xl ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/50">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-orange-600/30 via-red-600/20 to-pink-600/30"
              : "bg-gradient-to-br from-orange-300/40 via-red-300/30 to-pink-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-purple-600/30 via-fuchsia-600/20 to-pink-600/30"
              : "bg-gradient-to-br from-purple-300/40 via-fuchsia-300/30 to-pink-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20"
              : "bg-gradient-to-br from-indigo-300/30 via-purple-300/20 to-pink-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[25%] w-1 h-1 bg-red-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
      </div>

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
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-2xl ${darkMode ? "shadow-orange-500/50" : "shadow-orange-500/30"}`}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Pitch Simulator
                </h1>
                <p className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2`}>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                  Practice with AI-powered investor Q&A
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={() => simulatePitch()}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regenerate Questions
            </motion.button>
          </div>

          {/* Pitch Banner */}
          <motion.div 
            className={`relative overflow-hidden rounded-3xl p-6 ${darkMode ? 'bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 border border-orange-500/20' : 'bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 border border-orange-200'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-orange-600/5 via-red-600/5 to-pink-600/5' : 'bg-gradient-to-r from-orange-50 via-red-50 to-pink-50'} backdrop-blur-3xl`} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-xl">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your Pitch
                </h2>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {idea?.ideaText}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Questions and Answers Section */}
        {questions.length > 0 ? (
          <motion.div 
            className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {currentQuestion ? (
              <div>
                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-600 to-red-600 shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Question Display */}
                <div className={`relative overflow-hidden p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'}`}>
                  <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${darkMode ? 'bg-orange-600/10' : 'bg-orange-200/30'} blur-3xl`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-xl">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Investor Question
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${darkMode ? 'bg-orange-600/20 text-orange-300' : 'bg-orange-200 text-orange-800'}`}>
                            {currentQuestion.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                      {currentQuestion.question}
                    </p>
                  </div>
                </div>

                {/* Answer Form */}
                <form onSubmit={handleAnswer}>
                  <div className="mb-6">
                    <label
                      htmlFor="answer"
                      className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Your Answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={6}
                      disabled={isEvaluating}
                      className={`w-full px-5 py-4 text-sm rounded-2xl border-2 transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-white border-gray-700 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-800'
                          : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-50'
                      } focus:ring-4 focus:ring-orange-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Type your pitch answer here... Be confident and concise!"
                    />
                  </div>

                  {/* Submit Button */}
                  {!feedback && (
                    <motion.button
                      type="button"
                      onClick={(e) => handleAnswer(e)}
                      disabled={isEvaluating || !answer.trim()}
                      className={`w-full flex justify-center items-center py-4 px-8 rounded-2xl text-sm font-bold text-white transition-all duration-300 ${
                        isEvaluating || !answer.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-orange-500/50'
                      }`}
                      whileHover={!(isEvaluating || !answer.trim()) ? { scale: 1.02 } : {}}
                      whileTap={!(isEvaluating || !answer.trim()) ? { scale: 0.98 } : {}}
                    >
                      {isEvaluating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                          Evaluating Answer...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Answer for Evaluation
                        </>
                      )}
                    </motion.button>
                  )}
                </form>

                {/* Feedback Section */}
                {feedback && (
                  <motion.div 
                    className="mt-6 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        AI Feedback
                      </h3>
                    </div>
                    
                    <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      {/* Rating */}
                      <div className={`p-5 rounded-xl mb-6 ${darkMode ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border border-yellow-500/20' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                              Performance Rating
                            </span>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-6 w-6 ${
                                    i < feedback.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : darkMode
                                        ? 'text-gray-600'
                                        : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className={`text-5xl font-black ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {feedback.rating}/5
                          </div>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className={`p-5 rounded-xl mb-6 ${darkMode ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'}`}>
                        <h4 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          Strengths
                        </h4>
                        <ul className="space-y-3">
                          {feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0" />
                              <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {strength}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div className={`p-5 rounded-xl mb-6 ${darkMode ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}>
                        <h4 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-3">
                          {feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                              <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {improvement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Additional Advice */}
                      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'}`}>
                        <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                          <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                          Additional Advice
                        </h4>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feedback.additionalAdvice}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  <motion.button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : darkMode
                          ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900 shadow-lg hover:shadow-xl'
                    }`}
                    whileHover={currentQuestionIndex !== 0 ? { scale: 1.02 } : {}}
                    whileTap={currentQuestionIndex !== 0 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous Question
                  </motion.button>

                  <motion.button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold text-white transition-all duration-300 flex items-center justify-center ${
                      currentQuestionIndex === questions.length - 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/25'
                    }`}
                    whileHover={currentQuestionIndex !== questions.length - 1 ? { scale: 1.02 } : {}}
                    whileTap={currentQuestionIndex !== questions.length - 1 ? { scale: 0.98 } : {}}
                  >
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/50">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ready to Begin?
                </h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
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
            className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/50">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h3 className={`text-2xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Questions Available
            </h3>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
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