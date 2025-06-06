import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import ArenaSkeleton from '../components/skeleton/ArenaSkeleton';
import { AlertCircle, MessageSquare, Send, RefreshCw, ChevronLeft, ChevronRight, RotateCcw, Star, CheckCircle, Play } from 'lucide-react';

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
    
    // If we have questions but no current question selected, set the first one
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
      // Load existing questions from DB (cached)
      setQuestions(existingQuestions);
      setCurrentQuestion(existingQuestions[0]);
      setCurrentQuestionIndex(0);
      setAnswer(existingQuestions[0].answer || '');
      setFeedback(existingQuestions[0].feedback || null);
    } else {
      // No existing questions, do not auto-generate — wait for user action
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

  // src/pages/IdeaPitchSimulator.tsx
return (
  <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-lg md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Pitch Simulator
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => simulatePitch()}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-4 md:h-5 w-4  md:w-5 ${loading ? 'animate-spin' : ''}`} />
            Regenerate Questions
          </button>
        
        </div>
      </div>

      {/* Pitch Display */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Your Pitch
        </h2>
        <p className={`text-sm md:text-lg  text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {idea?.ideaText}
        </p>
      </div>

      {/* Questions and Answers Section */}
      {questions.length > 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 md:p-6`}>
          {currentQuestion ? (
  <div>
    {/* Question Display */}
    <div className={`p-6 rounded-xl mb-8 ${
      darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'
    }`}>
      <div className="flex items-center mb-4">
        <MessageSquare className={`h-6 w-6 ${
          darkMode ? 'text-indigo-400' : 'text-indigo-600'
        } mr-2`} />
        <h3 className={`font-medium text-sm md:text-lg ${
          darkMode ? 'text-indigo-200' : 'text-indigo-900'
        }`}>
         {currentQuestionIndex + 1} : Investor Question  ({currentQuestion.category})
        </h3>
      </div>
      <p className={`text-sm md:text-lg text-justify ${
        darkMode ? 'text-white' : 'text-indigo-700'
      }`}>
        {currentQuestion.question}
      </p>
    </div>

    {/* Answer Input */}
    <div className="mb-6">
      <label
        htmlFor="answer"
        className={`block text-sm font-medium mb-2 ${
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
        className={`w-full rounded-xl shadow-sm transition-colors md:text-lg text-sm duration-200 outline-none px-2 ${
          darkMode
            ? 'bg-gray-700 text-white border-gray-600'
            : 'bg-white text-gray-900 border-gray-300'
        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
        placeholder="Type your answer..."
      />
    </div>

    {/* Submit Button (only if feedback not shown) */}
    {!feedback && (
      <button
        onClick={handleAnswer}
        disabled={loading || !answer.trim()}
        className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white text-sm font-medium transition-all duration-200 ${
          loading || !answer.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        }`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Evaluating...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Answer
          </>
        )}
      </button>
    )}

    {/* Feedback Section */}
    {feedback && (
      <div className="mt-8 space-y-6">
        <h3 className={`md:text-xl font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Feedback
        </h3>
        
        <div className={`p-6 rounded-xl ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex-1">
              <span className={`text-sm md:text-lg font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Rating
              </span>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < feedback.rating
                        ? 'text-yellow-400 fill-current'
                        : darkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className={`ml-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feedback.rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <h4 className={`text-sm md:text-lg font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className={darkMode ? 'text-gray-300 text-xs text-justify md:text-lg' : 'text-gray-700 text-xs text-justify md:text-lg'}>
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="mb-6">
            <h4 className={`font-medium text-sm md:text-lg mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="h-8 w-8 text-amber-500 mr-2 mt-0.5" />
                  <span className={darkMode ? 'text-gray-300 text-xs text-justify md:text-lg' : 'text-gray-700 text-xs text-justify md:text-lg'}>
                    {improvement}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Advice */}
          <div>
            <h4 className={`font-medium mb-2 text-sm md:text-lg ${
              darkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Additional Advice
            </h4>
            <p className={darkMode ? 'text-gray-300 text-justify text-xs md:text-lg' : 'text-gray-700 text-justify text-xs md:text-lg'}>
              {feedback.additionalAdvice}
            </p>
          </div>
        </div>
      </div>
    )}

    {/* ✅ Always show Navigation Buttons */}
    <div className="flex justify-between space-x-4 mt-8">
      <button
        onClick={handlePrevQuestion}
        disabled={currentQuestionIndex === 0}
        className={`flex-1 py-3 px-4 md:text-sm text-xs rounded-xl  font-medium transition-all duration-200 ${
          currentQuestionIndex === 0
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : darkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <ChevronLeft className="w-5 h-5 inline mr-2" />
        Previous Question
      </button>

      <button
        onClick={handleNextQuestion}
        disabled={currentQuestionIndex === questions.length - 1}
        className={`flex-1 md:py-3 md:px-4  rounded-xl md:text-sm text-xs  font-medium text-white transition-all duration-200 ${
          currentQuestionIndex === questions.length - 1
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
        }`}
      >
        Next Question
        <ChevronRight className="w-5 h-5 inline ml-2" />
      </button>
    </div>
  </div>
) : (
  <div className="text-center py-12">
    <button
      onClick={() => setCurrentQuestion(questions[0])}
      className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
    >
      <MessageSquare className="w-5 h-5 mr-2" />
      Start Q&A Session
    </button>
  </div>
)}

        </div>
      ) : (
        <div> {/* isko baad mein dekh lunga */}</div>
      )}
    </div>
  </div>
);

};

export default IdeaPitchSimulator;