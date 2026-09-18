import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '@/shared/lib/api';

import { RootState } from '@/app/store';

import { AlertCircle, MessageSquare, Send, Play, Sparkles, Award, CheckCircle2, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import BackButton from '@/shared/components/ui/BackButton';

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

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setCreditError(null);
      setQuestions([]);
      setCurrentQuestion(null);
      setFeedback(null);

      const response = await api.post(
        `/api/pitch-simulator/simulate`,
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

      const response = await api.post(
        `/api/pitch-simulator/evaluate`,
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
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <BackButton fallbackUrl="/dashboard" />

        {/* Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-4 h-4 text-[#7c3aed]" />
            </div>
          </div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white mb-1">
            Pitch Simulator
          </h1>
          <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
            Practice your pitch with AI-powered investor Q&A
          </p>
        </motion.div>

        {/* Error Message */}
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

        {/* Main Form Card */}
        <motion.div 
          className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-5 sm:p-6 relative z-10 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {!questions.length ? (
            <form onSubmit={handleSimulate} className="space-y-3.5">
              <div>
                <label
                  htmlFor="pitch"
                  className="flex items-center gap-2 text-[12px] font-medium mb-2 text-gray-200"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed]">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <span>Your Pitch</span>
                </label>
                <div className="relative">
                  <textarea
                    id="pitch"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    rows={5}
                    className="w-full p-3 pb-7 text-[12px] rounded-lg border bg-[#141414] border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors resize-none leading-relaxed"
                    placeholder="Describe your startup pitch here. Include your problem statement, solution, market opportunity, and what makes you unique..."
                  />
                  <div className={`absolute bottom-2.5 right-2.5 text-[10px] font-medium transition-colors ${
                    pitch.length < 50 ? 'text-gray-500' : 'text-[#a78bfa]'
                  }`}>
                    {pitch.length} characters
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Sparkles className="w-3 h-3 text-[#7c3aed] flex-shrink-0" />
                  <span>AI investors will analyze your pitch and generate tough, realistic questions</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !pitch.trim()}
                className={
                  loading || !pitch.trim()
                    ? "w-full py-2 px-5 rounded-lg text-[12px] font-medium bg-[#141414] text-gray-500 border border-white/5 cursor-not-allowed flex items-center justify-center gap-2 mt-3.5"
                    : "btn-primary w-full py-2 px-5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 mt-3.5"
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Generating Questions...</span>
                  </div>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Simulation (1 Credit)</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Your Pitch Display */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#141414] border border-white/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#7c3aed]">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-semibold text-[12px] text-white">
                    Your Pitch
                  </h3>
                </div>
                <p className="text-[11px] sm:text-[12px] leading-relaxed text-gray-300">
                  {pitch}
                </p>
              </div>

              {currentQuestion ? (
                <div className="space-y-4">
                  {/* Investor Question Card */}
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#7c3aed]/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center text-[#a78bfa]">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-semibold text-[12px] text-[#a78bfa]">
                          Investor Question
                        </h3>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30">
                        {currentQuestion.category}
                      </span>
                    </div>
                    <p className="text-[12px] sm:text-[13px] font-medium leading-relaxed text-white">
                      {currentQuestion.question}
                    </p>
                  </div>

                  {/* Answer Textarea */}
                  <div>
                    <label
                      htmlFor="answer"
                      className="flex items-center gap-2 text-[12px] font-medium mb-2 text-gray-200"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-emerald-400">
                        <Send className="w-3 h-3" />
                      </div>
                      <span>Your Answer</span>
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={5}
                      className="w-full p-3 text-[12px] rounded-lg border bg-[#141414] border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors resize-none leading-relaxed"
                      placeholder="Type your response to the investor here..."
                    />
                  </div>

                  <button
                    onClick={handleAnswer}
                    disabled={loading || !answer.trim()}
                    className={
                      loading || !answer.trim()
                        ? "w-full py-2 px-5 rounded-lg text-[12px] font-medium bg-[#141414] text-gray-500 border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
                        : "btn-primary w-full py-2 px-5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2"
                    }
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        <span>Evaluating Answer...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </>
                    )}
                  </button>

                  {/* Feedback Section */}
                  {feedback && (
                    <motion.div 
                      className="mt-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-3.5"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Rating Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Award className="w-3.5 h-3.5" />
                          </div>
                          <h3 className="text-[13px] font-semibold text-white">
                            Answer Evaluation
                          </h3>
                        </div>
                        <div className="px-2.5 py-0.5 text-[11px] rounded-md bg-[#141414] border border-white/10 text-white font-semibold">
                          Score: {feedback.rating}/5 ⭐
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {/* Strengths */}
                        <div className="p-3 rounded-lg bg-[#141414] border border-emerald-500/15">
                          <h4 className="font-semibold text-[11px] text-emerald-400 flex items-center gap-1.5 mb-1.5">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {feedback.strengths.map((strength, index) => (
                              <li key={index} className="text-[11px] text-gray-300 flex items-start">
                                <span className="text-emerald-400 mr-1.5">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div className="p-3 rounded-lg bg-[#141414] border border-amber-500/15">
                          <h4 className="font-semibold text-[11px] text-amber-400 flex items-center gap-1.5 mb-1.5">
                            <TrendingUp className="w-3 h-3 flex-shrink-0" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-1">
                            {feedback.improvements.map((improvement, index) => (
                              <li key={index} className="text-[11px] text-gray-300 flex items-start">
                                <span className="text-amber-400 mr-1.5">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Additional Advice */}
                        <div className="p-3 rounded-lg bg-[#141414] border border-blue-500/15">
                          <h4 className="font-semibold text-[11px] text-blue-400 flex items-center gap-1.5 mb-1.5">
                            <Lightbulb className="w-3 h-3 flex-shrink-0" />
                            Additional Advice
                          </h4>
                          <p className="text-[11px] leading-relaxed text-gray-300">
                            {feedback.additionalAdvice}
                          </p>
                        </div>

                        {/* Next Question Button */}
                        <button
                          onClick={handleNextQuestion}
                          className="btn-primary w-full py-2 px-5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 mt-2"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3 text-[#7c3aed] shadow-inner">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-1 tracking-tight">
                    Ready to Start?
                  </h3>
                  <p className="text-[12px] text-gray-400 mb-4 max-w-sm mx-auto">
                    {questions.length} investor questions generated. Let's begin the Q&A session!
                  </p>
                  <button
                    onClick={() => setCurrentQuestion(questions[0])}
                    className="btn-primary inline-flex items-center px-6 py-2 rounded-lg text-[12px] font-semibold gap-2 mx-auto"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Q&A Session</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              )}
            </div>
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