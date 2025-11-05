import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, MessageSquare, Send, Play, Sparkles, Award, CheckCircle2, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
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
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
       
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-orange-500/50' : 'shadow-orange-500/30'}`}>
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-lg md:text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pitch{" "}
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    Simulator
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-orange-400" />
              Practice your pitch with AI-powered investor Q&A
            </p>
          </div>
        </motion.div>

        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-2 sm:p-3 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {!questions.length ? (
            <form onSubmit={handleSimulate}>
              <div className="mb-4">
                <label
                  htmlFor="pitch"
                  className={`flex items-center gap-2 text-base font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-lg`}>
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  Your Pitch
                </label>
                <textarea
                  id="pitch"
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  rows={5}
                  className={`w-full px-6 py-4 text-sm rounded-2xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-800'
                      : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:border-orange-500 focus:bg-white'
                  } focus:ring-1 focus:ring-orange-500/20 focus:outline-none`}
                  placeholder="Describe your startup pitch here. Include your problem statement, solution, market opportunity, and what makes you unique..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading || !pitch.trim()}
                className={`w-full flex justify-center items-center py-2 px-8 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-xl ${
                  (loading || !pitch.trim())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105'
                }`}
                whileHover={!(loading || !pitch.trim()) ? { scale: 1.05 } : {}}
                whileTap={!(loading || !pitch.trim()) ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-3" />
                    Start Simulation (1 Credit)
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <div>
              {/* Your Pitch Display */}
              <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 mb-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center shadow-lg`}>
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <h3 className={`font-bold text-sm ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      Your Pitch
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-sm text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {pitch}
                  </p>
                </div>
              </div>

              {currentQuestion ? (
                <div>
                  {/* Investor Question Card */}
                  <div className={`relative overflow-hidden rounded-2xl p-2 sm:p-4 mb-4 ${darkMode ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-pink-500/10"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg`}>
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <h3 className={`font-bold text-xs sm:text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                            Investor Question
                          </h3>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${darkMode ? 'bg-purple-600/30 text-purple-300' : 'bg-purple-200 text-purple-700'}`}>
                          {currentQuestion.category}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm font-medium text-justify leading-relaxed ${darkMode ? 'text-white' : 'text-purple-900'}`}>
                        {currentQuestion.question}
                      </p>
                    </div>
                  </div>

                  {/* Answer Textarea */}
                  <div className="mb-6">
                    <label
                      htmlFor="answer"
                      className={`flex items-center gap-2 text-xs sm:text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg`}>
                        <Send className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                      </div>
                      Your Answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={6}
                      className={`w-full px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm rounded-2xl border-2 transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-white border-gray-700 placeholder-gray-500 focus:border-emerald-500 focus:bg-gray-800'
                          : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:border-emerald-500 focus:bg-white'
                      } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                      placeholder="Type your answer here..."
                    />
                  </div>

                  <motion.button
                    onClick={handleAnswer}
                    disabled={loading || !answer.trim()}
                    className={`w-full flex justify-center items-center py-1 sm:py-2 px-8 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-300 shadow-xl ${
                      (loading || !answer.trim())
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105'
                    }`}
                    whileHover={!(loading || !answer.trim()) ? { scale: 1.05 } : {}}
                    whileTap={!(loading || !answer.trim()) ? { scale: 0.95 } : {}}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                        Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
                        Submit Answer
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </motion.button>

                  {/* Feedback Section */}
                  {feedback && (
                    <motion.div 
                      className="mt-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`relative overflow-hidden rounded-2xl p-2 sm:p-3 ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}>
                        <div className="relative">
                          {/* Rating Header */}
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700/50">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-lg`}>
                                <Award className="w-4 h-4 text-white" />
                              </div>
                              <h3 className={`text-sm sm:text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Feedback
                              </h3>
                            </div>
                            <div className={`px-4 py-2 text-xs sm:text-sm rounded-xl bg-gradient-to-r ${
                              feedback.rating >= 4 
                                ? 'from-emerald-500 to-teal-500' 
                                : feedback.rating >= 3 
                                ? 'from-amber-500 to-orange-500'
                                : 'from-red-500 to-pink-500'
                            } text-white font-bold shadow-lg`}>
                              {feedback.rating}/5 ⭐
                            </div>
                          </div>

                          <div className="space-y-6">
                            {/* Strengths */}
                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                  <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                                </div>
                                <h4 className="font-bold text-sm text-emerald-500">
                                  Strengths
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {feedback.strengths.map((strength, index) => (
                                  <li key={index} className={`text-xs sm:text-sm text-justify flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Improvements */}
                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-amber-900/20 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                                  <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                                </div>
                                <h4 className="font-bold text-sm text-amber-500">
                                  Areas for Improvement
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {feedback.improvements.map((improvement, index) => (
                                  <li key={index} className={`text-xs sm:text-sm text-justify flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <TrendingUp className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Additional Advice */}
                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                  <Lightbulb className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-bold text-sm text-blue-500">
                                  Additional Advice
                                </h4>
                              </div>
                              <p className={`text-xs sm:text-sm text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {feedback.additionalAdvice}
                              </p>
                            </div>

                            {/* Next Question Button */}
                            <motion.button
                              onClick={handleNextQuestion}
                              className="w-full py-1 sm:py-2 px-8 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Next Question
                              <ArrowRight className="w-5 h-5 ml-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center mx-auto mb-3 shadow-2xl ${darkMode ? 'shadow-orange-500/50' : 'shadow-orange-500/30'}`}>
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Ready to Start?
                  </h3>
                  <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {questions.length} investor questions generated. Let's begin the Q&A session!
                  </p>
                  <motion.button
                    onClick={() => setCurrentQuestion(questions[0])}
                    className="inline-flex items-center px-8 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 mr-3" />
                    Start Q&A Session
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}
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