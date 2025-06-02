import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, MessageSquare, Send, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (id) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (idea?.pitchSimulation?.questions) {
      setQuestions(idea.pitchSimulation.questions);
      if (idea.pitchSimulation.questions.length > 0) {
        const firstQuestion = idea.pitchSimulation.questions[0];
        setCurrentQuestion(firstQuestion);
        setAnswer(firstQuestion.answer || '');
        setFeedback(firstQuestion.feedback || null);
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
        { regenerate: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newQuestions = response.data.pitchSimulation.questions;
      setQuestions(newQuestions);
      if (newQuestions.length > 0) {
        setCurrentQuestion(newQuestions[0]);
        setCurrentQuestionIndex(0);
        setAnswer('');
        setFeedback(null);
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

 


  useEffect(() => {
    if (idea && !questions.length && !loading) {
      simulatePitch();
    }
  }, [idea]);

  if (ideaLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pitch Simulator
          </h1>
          <button
            onClick={simulatePitch}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Restart Simulation
          </button>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Pitch
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {idea.ideaText}
          </p>
        </div>

        {questions.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
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

                     <div className="flex justify-between space-x-4 mt-4">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
              currentQuestionIndex === 0 && 'opacity-50 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5 inline mr-2" />
            Previous Question
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500  ${
              currentQuestionIndex === questions.length - 1 && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Next Question
            <ChevronRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
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
      </div>
    </div>
  );
};

export default IdeaPitchSimulator;