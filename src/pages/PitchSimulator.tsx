import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, MessageSquare, Send } from 'lucide-react';

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
  
  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
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
      setError(err.response?.data?.message || 'Failed to simulate pitch');
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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pitch Simulator
          </h1>
          <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Practice your pitch with AI-powered investor Q&A
          </p>
        </div>

        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          {!questions.length ? (
            <form onSubmit={handleSimulate}>
              <div className="mb-4">
                <label
                  htmlFor="pitch"
                  className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Your Pitch
                </label>
                <textarea
                  id="pitch"
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  rows={6}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter your startup pitch..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !pitch.trim()}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (loading || !pitch.trim()) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                    Simulating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Simulation
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div>
              <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your Pitch
                </h3>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pitch}
                </p>
              </div>

              {currentQuestion ? (
                <div>
                  <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'}`}>
                    <h3 className={`font-medium ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                      Investor Question ({currentQuestion.category})
                    </h3>
                    <p className={`mt-2 ${darkMode ? 'text-white' : 'text-indigo-700'}`}>
                      {currentQuestion.question}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="answer"
                      className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Your Answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={4}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        darkMode
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      } focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Type your answer..."
                    />
                  </div>

                  <button
                    onClick={handleAnswer}
                    disabled={loading || !answer.trim()}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      (loading || !answer.trim()) && 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                        Evaluating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Submit Answer
                      </div>
                    )}
                  </button>

                  {feedback && (
                    <div className="mt-6">
                      <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Feedback
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Rating: {feedback.rating}/5
                          </h4>
                        </div>

                        <div>
                          <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Strengths
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {feedback.strengths.map((strength, index) => (
                              <li key={index} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Areas for Improvement
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {feedback.improvements.map((improvement, index) => (
                              <li key={index} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Additional Advice
                          </h4>
                          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {feedback.additionalAdvice}
                          </p>
                        </div>

                        <button
                          onClick={handleNextQuestion}
                          className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Next Question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={() => setCurrentQuestion(questions[0])}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Q&A Session
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchSimulator;