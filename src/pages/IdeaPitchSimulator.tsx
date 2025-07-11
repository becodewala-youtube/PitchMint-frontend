import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import ArenaSkeleton from '../components/skeleton/ArenaSkeleton';
import { AlertCircle, MessageSquare, Send, RefreshCw, ChevronLeft, ChevronRight, Star, CheckCircle, Play } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIdeaData = async () => {
      if (id) {
        try {
          await dispatch(getIdea(id) as any);
        } catch (err) {
          setError('Failed to load idea data');
        }
      }
    };
    loadIdeaData();
  }, [dispatch, id]);

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

  const handleAnswer = async () => {
    if (!currentQuestion || !idea?._id) return;
    
    try {
      setLoading(true);
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
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-xl font-medium text-red-500">Error</h3>
          <p className="mt-1 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'} animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-400 to-blue-400'} animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center mr-4`}>
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pitch Simulator
                </h1>
              </div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Practice with AI-powered investor Q&A
              </p>
            </div>
            <motion.button
              onClick={() => simulatePitch()}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Regenerate Questions
            </motion.button>
          </motion.div>

          {/* Pitch Display */}
          <motion.div 
            className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
              Your Pitch
            </h2>
            <p className={`text-sm md:text-lg text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {idea?.ideaText}
            </p>
          </motion.div>

          {/* Questions and Answers Section */}
          {questions.length > 0 ? (
            <motion.div 
              className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {currentQuestion ? (
                <div>
                  {/* Question Display */}
                  <div className={`p-8 rounded-3xl mb-8 ${
                    darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'
                  }`}>
                    <div className="flex items-center mb-6">
                      <MessageSquare className={`h-6 w-6 ${
                        darkMode ? 'text-indigo-400' : 'text-indigo-600'
                      } mr-3`} />
                      <h3 className={`font-bold text-lg ${
                        darkMode ? 'text-indigo-200' : 'text-indigo-900'
                      }`}>
                        Question {currentQuestionIndex + 1} ({currentQuestion.category})
                      </h3>
                    </div>
                    <p className={`text-lg text-justify leading-relaxed ${
                      darkMode ? 'text-white' : 'text-indigo-700'
                    }`}>
                      {currentQuestion.question}
                    </p>
                  </div>

                  {/* Answer Input */}
                  <div className="mb-8">
                    <label
                      htmlFor="answer"
                      className={`block text-lg font-semibold mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Your Answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={8}
                      className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-700'
                          : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-50'
                      } focus:ring-4 focus:ring-orange-500/20 focus:outline-none`}
                      placeholder="Type your answer..."
                    />
                  </div>

                  {/* Submit Button (only if feedback not shown) */}
                  {!feedback && (
                    <motion.button
                      onClick={handleAnswer}
                      disabled={loading || !answer.trim()}
                      className={`w-full flex justify-center items-center py-4 px-8 rounded-2xl text-lg font-semibold text-white transition-all duration-300 ${
                        loading || !answer.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-105 shadow-2xl hover:shadow-orange-500/25'
                      }`}
                      whileHover={!(loading || !answer.trim()) ? { scale: 1.05 } : {}}
                      whileTap={!(loading || !answer.trim()) ? { scale: 0.95 } : {}}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          Submit Answer
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Feedback Section */}
                  {feedback && (
                    <motion.div 
                      className="mt-8 space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Feedback
                      </h3>
                      
                      <div className={`p-8 rounded-3xl ${
                        darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        {/* Rating */}
                        <div className="flex items-center mb-8">
                          <div className="flex-1">
                            <span className={`text-lg font-semibold ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Rating
                            </span>
                            <div className="flex items-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-6 w-6 ${
                                    i < feedback.rating
                                      ? 'text-yellow-400 fill-current'
                                      : darkMode
                                        ? 'text-gray-600'
                                        : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className={`ml-3 text-lg font-bold ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {feedback.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Strengths */}
                        <div className="mb-8">
                          <h4 className={`text-lg font-bold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-900'
                          } flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                            Strengths
                          </h4>
                          <ul className="space-y-3">
                            {feedback.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className={`text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {strength}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div className="mb-8">
                          <h4 className={`text-lg font-bold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-900'
                          } flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-3">
                            {feedback.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                                <span className={`text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {improvement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Additional Advice */}
                        <div>
                          <h4 className={`text-lg font-bold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-900'
                          } flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                            Additional Advice
                          </h4>
                          <p className={`text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {feedback.additionalAdvice}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between space-x-4 mt-8">
                    <motion.button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                        currentQuestionIndex === 0
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      whileHover={currentQuestionIndex !== 0 ? { scale: 1.05 } : {}}
                      whileTap={currentQuestionIndex !== 0 ? { scale: 0.95 } : {}}
                    >
                      <ChevronLeft className="w-5 h-5 inline mr-2" />
                      Previous Question
                    </motion.button>

                    <motion.button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 ${
                        currentQuestionIndex === questions.length - 1
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                      }`}
                      whileHover={currentQuestionIndex !== questions.length - 1 ? { scale: 1.05 } : {}}
                      whileTap={currentQuestionIndex !== questions.length - 1 ? { scale: 0.95 } : {}}
                    >
                      Next Question
                      <ChevronRight className="w-5 h-5 inline ml-2" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.button
                    onClick={() => setCurrentQuestion(questions[0])}
                    className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Q&A Session
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-8`}>
                <MessageSquare className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No Questions Available
              </h3>
              <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Click the regenerate button to create investor questions for your pitch.
              </p>
              <motion.button
                onClick={simulatePitch}
                className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6 mr-3" />
                Generate Questions
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaPitchSimulator;