import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, MessageSquare, Send, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';

interface Question {
  id: string;
  question: string;
  category: string;
}

interface Feedback {
  rating: number;
  strengths: string[];
  improvements: string[];
  additionalAdvice: string;
}

const PitchSimulator = () => {
  const [pitch, setPitch] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditError, setCreditError] = useState<{
    show: boolean;
    creditsRequired: number;
    creditsAvailable: number;
  } | null>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setCreditError(null);
      setQuestions([]);
      setCurrentQuestion(null);
      setFeedback(null);

      const response = await axios.post(
        `${API_URL}/api/pitch-simulator/simulate`,
        { pitch },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuestions(response.data.questions);
    } catch (err: any) {
      if (err.response?.status === 402) {
        setCreditError({
          show: true,
          creditsRequired: err.response.data.creditsRequired,
          creditsAvailable: err.response.data.creditsAvailable
        });
      } else {
        setError(err.response?.data?.message || 'Failed to simulate pitch');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!currentQuestion) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/pitch-simulator/evaluate`,
        {
          pitch,
          question: currentQuestion.question,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback(response.data.feedback);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to evaluate answer');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const currentIndex = currentQuestion 
      ? questions.findIndex(q => q.id === currentQuestion.id)
      : -1;
    
    const nextQuestion = questions[currentIndex + 1] || null;
    setCurrentQuestion(nextQuestion);
    setAnswer('');
    setFeedback(null);
  };

  const handleCloseCreditModal = () => {
    setCreditError(null);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'} animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-400 to-blue-400'} animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-2 sm:mb-4`}>
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className={`text-xl md:text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pitch
              <span className="ml-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Simulator
              </span>
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Practice your pitch with AI-powered investor Q&A
            </p>
          </motion.div>

          <motion.div 
            className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl px-4 sm:px-6 py-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {!questions.length ? (
              <form onSubmit={handleSimulate}>
                <div className="mb-2 sm:mb-4">
                  <label
                    htmlFor="pitch"
                    className={`block text-md font-semibold mb-2 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Your Pitch
                  </label>
                  <textarea
                    id="pitch"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    rows={6}
                    className={`w-full px-6 py-4 text-sm sm:text-md rounded-2xl border-2 transition-all duration-300 ${
                      darkMode
                        ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-700'
                        : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-50'
                    } focus:ring-2 focus:ring-orange-500/20 focus:outline-none`}
                    placeholder="Enter your startup pitch..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !pitch.trim()}
                  className={`w-full flex justify-center py-2 px-8 rounded-2xl text-lg font-semibold text-white transition-all duration-300 ${
                    (loading || !pitch.trim())
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-105 shadow-2xl hover:shadow-orange-500/25'
                  }`}
                  whileHover={!(loading || !pitch.trim()) ? { scale: 1.05 } : {}}
                  whileTap={!(loading || !pitch.trim()) ? { scale: 0.95 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
                      Simulating...
                    </div>
                  ) : (
                    <div className="flex text-xs md:text-md items-center">
                      <Play className="w-6 h-6 mr-3" />
                      Start Simulation (1 Credit)
                    </div>
                  )}
                </motion.button>
              </form>
            ) : (
              <div>
                <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <h3 className={`font-semibold mb-2 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Pitch
                  </h3>
                  <p className={`text-sm sm:tex-md text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {pitch}
                  </p>
                </div>

                {currentQuestion ? (
                  <div>
                    <div className={`px-6 py-4 rounded-3xl mb-6 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'}`}>
                      <h3 className={`font-bold text-sm sm:text-md mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                        Investor Question ({currentQuestion.category})
                      </h3>
                      <p className={`text-sm text-justify sm:text-md leading-relaxed ${darkMode ? 'text-white' : 'text-indigo-700'}`}>
                        {currentQuestion.question}
                      </p>
                    </div>

                    <div className="mb-8">
                      <label
                        htmlFor="answer"
                        className={`block text-sm sm:text-md font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Your Answer
                      </label>
                      <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={6}
                        className={`w-full px-6 py-4 text-xs sm:text-sm rounded-2xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-700'
                            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-orange-500 focus:bg-gray-50'
                        } focus:ring-4 focus:ring-orange-500/20 focus:outline-none`}
                        placeholder="Type your answer..."
                      />
                    </div>

                    <motion.button
                      onClick={handleAnswer}
                      disabled={loading || !answer.trim()}
                      className={`w-full flex justify-center py-2 px-8 rounded-2xl text-xs sm:text-sm font-semibold text-white transition-all duration-300 ${
                        (loading || !answer.trim())
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-105 shadow-2xl hover:shadow-orange-500/25'
                      }`}
                      whileHover={!(loading || !answer.trim()) ? { scale: 1.05 } : {}}
                      whileTap={!(loading || !answer.trim()) ? { scale: 0.95 } : {}}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
                          Evaluating...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
                          Submit Answer
                        </div>
                      )}
                    </motion.button>

                    {feedback && (
                      <motion.div 
                        className="mt-8 space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className={`text-sm sm:text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Feedback
                        </h3>
                        
                        <div className={`py-5 px-5 sm:px-8 rounded-3xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <div className="space-y-4">
                            <div>
                              <h4 className={`text-sm sm:text-md font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Rating: {feedback.rating}/5
                              </h4>
                            </div>

                            <div>
                              <h4 className={` text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Strengths
                              </h4>
                              <ul className="list-disc text-xs sm:text-sm text-justify pl-6 space-y-2">
                                {feedback.strengths.map((strength, index) => (
                                  <li key={index} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Areas for Improvement
                              </h4>
                              <ul className="list-disc pl-6 text-xs sm:text-sm text-justify space-y-2">
                                {feedback.improvements.map((improvement, index) => (
                                  <li key={index} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Additional Advice
                              </h4>
                              <p className={darkMode ? 'text-gray-400  text-xs sm:text-sm text-justify' : 'text-gray-600 text-xs sm:text-sm text-justify'}>
                                {feedback.additionalAdvice}
                              </p>
                            </div>

                            <motion.button
                              onClick={handleNextQuestion}
                              className="w-full py-1 px-8 rounded-2xl text-sm sm:text-md font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Next Question
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <motion.button
                      onClick={() => setCurrentQuestion(questions[0])}
                      className="inline-flex items-center px-8 py-2 rounded-2xl text-md font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Start Q&A Session
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <motion.div 
                className="mt-6 p-4 bg-red-100 text-red-700 rounded-2xl border border-red-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={creditError?.show || false}
        onClose={handleCloseCreditModal}
        creditsRequired={creditError?.creditsRequired || 0}
        creditsAvailable={creditError?.creditsAvailable || 0}
      />
    </div>
  );
};

export default PitchSimulator;