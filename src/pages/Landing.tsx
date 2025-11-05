import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import {
  Brain,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Target,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import Demo from '../assets/run.mp4'

interface StarFieldProps {
  darkMode: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
  animationDuration: number;
}

interface Comet {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  animationDelay: number;
  animationDuration: number;
}

const StarField = ({ darkMode }: StarFieldProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [comets, setComets] = useState<Comet[]>([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 5,
          animationDuration: Math.random() * 3 + 2,
        });
      }
      setStars(starArray);
    };

    // Generate random comets
    const generateComets = () => {
      const cometArray = [];
      for (let i = 0; i < 3; i++) {
        cometArray.push({
          id: i,
          startX: Math.random() * 100,
          startY: -10,
          endX: Math.random() * 100,
          endY: 110,
          animationDelay: Math.random() * 10,
          animationDuration: Math.random() * 3 + 4,
        });
      }
      setComets(cometArray);
    };

    generateStars();
    generateComets();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={`absolute rounded-full ${
            darkMode ? "bg-white" : "bg-gray-800"
          }`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration}s ease-in-out infinite`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}

      {/* Comets */}
      {comets.map((comet) => (
        <div
          key={`comet-${comet.id}`}
          className="absolute"
          style={{
            animation: `comet ${comet.animationDuration}s linear infinite`,
            animationDelay: `${comet.animationDelay}s`,
          }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              darkMode
                ? "bg-gradient-to-r from-violet-400 to-fuchsia-400"
                : "bg-gradient-to-r from-amber-400 to-orange-400"
            }`}
            style={{
              boxShadow: darkMode
                ? "0 0 6px #a78bfa, 0 0 12px #e879f9, 0 0 18px #e879f9"
                : "0 0 6px #fbbf24, 0 0 12px #f97316, 0 0 18px #f97316",
            }}
          />
          <div
            className={`absolute top-0 left-0 w-1 h-12 ${
              darkMode
                ? "bg-gradient-to-t from-transparent via-violet-400 to-fuchsia-400"
                : "bg-gradient-to-t from-transparent via-amber-400 to-orange-400"
            } transform -rotate-45 origin-bottom`}
            style={{
              transform: "rotate(-45deg) translateX(-50%)",
              filter: "blur(1px)",
            }}
          />
        </div>
      ))}

      {/* Shooting Stars */}
      <div className="shooting-star-1"></div>
      <div className="shooting-star-2"></div>
      <div className="shooting-star-3"></div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes comet {
          0% {
            transform: translateX(${comets[0]?.startX || 0}vw) translateY(-10vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(${comets[0]?.endX || 0}vw) translateY(110vh);
            opacity: 0;
          }
        }

        .shooting-star-1, .shooting-star-2, .shooting-star-3 {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: ${darkMode ? "#ffffff" : "#1f2937"};
          animation: shoot 3s linear infinite;
        }

        .shooting-star-1 {
          top: 20%;
          left: 0;
          animation-delay: 0s;
        }

        .shooting-star-2 {
          top: 40%;
          left: 0;
          animation-delay: 1.5s;
        }

        .shooting-star-3 {
          top: 60%;
          left: 0;
          animation-delay: 3s;
        }

        @keyframes shoot {
          0% {
            transform: translateX(-100px) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-200px);
            opacity: 0;
          }
        }

        .shooting-star-1::after, .shooting-star-2::after, .shooting-star-3::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, ${darkMode ? "#ffffff" : "#1f2937"}, transparent);
          transform: translateX(-100px);
        }
      `}</style>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Validation",
      description:
        "Get instant analysis of your startup idea with detailed scores for market demand, competition, and monetization potential.",
      iconBg: "from-violet-500 via-purple-500 to-fuchsia-500",
      hoverBg: "from-violet-500/10 to-fuchsia-500/10",
      glowColor: "shadow-violet-500/50",
    },
    {
      icon: FileText,
      title: "Professional Pitch Decks",
      description:
        "Generate investor-ready pitch decks automatically with all essential sections and compelling content.",
      iconBg: "from-cyan-500 via-blue-500 to-indigo-500",
      hoverBg: "from-cyan-500/10 to-indigo-500/10",
      glowColor: "shadow-cyan-500/50",
    },
    {
      icon: Users,
      title: "Competitor Analysis",
      description:
        "Deep dive into your competitive landscape with detailed SWOT analysis and market positioning.",
      iconBg: "from-orange-500 via-red-500 to-pink-500",
      hoverBg: "from-orange-500/10 to-pink-500/10",
      glowColor: "shadow-orange-500/50",
    },
    {
      icon: MessageSquare,
      title: "Pitch Simulator",
      description:
        "Practice your pitch with AI-powered investor Q&A and get real-time feedback to improve.",
      iconBg: "from-emerald-500 via-teal-500 to-cyan-500",
      hoverBg: "from-emerald-500/10 to-cyan-500/10",
      glowColor: "shadow-emerald-500/50",
    },
    {
      icon: Users,
      title: "Smart Investor Matching",
      description:
        "AI-powered investor matchmaking based on your startup stage, industry, and funding requirements with compatibility scoring.",
      iconBg: "from-amber-500 via-orange-500 to-red-500",
      hoverBg: "from-amber-500/10 to-red-500/10",
      glowColor: "shadow-amber-500/50",
    },
    {
      icon: MessageSquare,
      title: "Advanced Market Research",
      description:
        "Generate TAM/SAM/SOM analysis, customer personas, and market trends with comprehensive competitive intelligence.",
      iconBg: "from-pink-500 via-rose-500 to-red-500",
      hoverBg: "from-pink-500/10 to-red-500/10",
      glowColor: "shadow-pink-500/50",
    },
    {
      icon: TrendingUp,
      title: "Business Model Canvas",
      description:
        "Create lean startup canvases with detailed analysis of your value proposition, channels, and revenue streams.",
      iconBg: "from-indigo-500 via-purple-500 to-pink-500",
      hoverBg: "from-indigo-500/10 to-pink-500/10",
      glowColor: "shadow-indigo-500/50",
    },
    {
      icon: Target,
      title: "Activity History & Analytics",
      description:
        "Track your validation journey with detailed history of all analyses, pitch simulations, and investor interactions.",
      iconBg: "from-blue-500 via-cyan-500 to-teal-500",
      hoverBg: "from-blue-500/10 to-teal-500/10",
      glowColor: "shadow-blue-500/50",
    },
  ];

  const testimonials = [
    {
      quote:
        "This platform helped me validate my startup idea and secure seed funding. The AI-generated insights were incredibly valuable.",
      author: "Sarah Chen",
      role: "Founder, TechStart",
      iconBg: "from-violet-500 to-fuchsia-500",
      hoverBg: "from-violet-500/10 to-fuchsia-500/10",
    },
    {
      quote:
        "The pitch simulator prepared me for real investor meetings. It's like having a personal pitch coach available 24/7.",
      author: "Michael Rodriguez",
      role: "CEO, InnovateCo",
      iconBg: "from-cyan-500 to-blue-500",
      hoverBg: "from-cyan-500/10 to-blue-500/10",
    },
    {
      quote:
        "Generated a professional pitch deck in minutes that would have taken weeks to create manually. Highly recommended!",
      author: "Emily Zhang",
      role: "Founder, DataFlow",
      iconBg: "from-emerald-500 to-teal-500",
      hoverBg: "from-emerald-500/10 to-teal-500/10",
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-[#0a0118]" : "bg-gray-50"}`}
    >
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-fuchsia-600/30"
              : "bg-gradient-to-br from-violet-300/40 via-purple-300/30 to-fuchsia-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-indigo-600/30"
              : "bg-gradient-to-br from-cyan-300/40 via-blue-300/30 to-indigo-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20"
              : "bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-cyan-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Star Field Animation - Only in Dark Mode */}
        {darkMode && <StarField darkMode={darkMode} />}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className={`absolute -left-32 -top-24 w-[40rem] h-[40rem] pointer-events-none opacity-30 blur-3xl rounded-full transform rotate-12 -z-10 ${
          darkMode
            ? "bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-600"
            : "bg-gradient-to-tr from-violet-300 via-purple-300 to-fuchsia-300"
        }`} />
        <div className={`absolute -right-40 bottom-[-6rem] w-[36rem] h-[36rem] pointer-events-none opacity-25 blur-2xl rounded-full transform -rotate-12 -z-10 ${
          darkMode
            ? "bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600"
            : "bg-gradient-to-br from-cyan-300 via-blue-300 to-indigo-300"
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pb-28 pb-6">
          {/* Product Hunt / Badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`inline-flex items-center gap-3 px-5 py-2 rounded-full shadow-lg backdrop-blur-xl border ${
                darkMode
                  ? "bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10 border-violet-500/20"
                  : "bg-white/60 border-violet-200"
              }`}
              aria-hidden="true"
            >
              <span className="text-md">🚀</span>
              <span className={`text-xs  font-bold ${darkMode ? 'text-violet-300' : 'text-violet-800'}`}>
                #1 AI-Powered Startup Validator
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: headline + copy */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.h1
                className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08 }}
              >
                <span className="block italic">Validate your</span>
                <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent mt-2">
                  Startup Ideas
                </span>
                <span className="block">— faster with AI</span>
              </motion.h1>

              <motion.p
                className={`mx-auto lg:mx-0 max-w-3xl text-sm md:text-lg mb-8 leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.18 }}
              >
                Instant validation scores, investor-ready pitch decks, and live pitch simulations —
                everything you need to move from idea to traction.
                <span className="block mt-2 text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
                  Turn ideas into investor-ready products.
                </span>
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28 }}
              >
                {/* Primary CTA */}
                <button
                  onClick={() => navigate("/signup")}
                  className={`mx-auto sm:mx-0 relative group flex items-center gap-3 px-6 sm:px-8 py-2 rounded-xl overflow-hidden font-bold text-white shadow-2xl hover:scale-105 transform transition-all duration-300 ${
                    darkMode 
                      ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-violet-500/50"
                      : "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:shadow-cyan-500/50"
                  }`}
                  aria-label="Start Validating Free"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600"
                      : "bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600"
                  }`} />
                  
                  {/* small accent circle */}
                  <span className="relative z-10 w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14.187 8.096L15 5.25L15.813 8.096C16.023 8.831 16.417 9.5006 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.169 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.977 15.1689 13.583 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.831 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.5016 13.976 8.83214 14.186 8.097" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>

                  <span className="relative z-10 text-sm">Start Validating Free</span>
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => navigate("/login")}
                  className={`mx-auto sm:mx-0 px-6 sm:px-8 py-2 text-sm rounded-xl border-2 font-bold transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "border-gray-700 text-gray-300 hover:border-violet-500 hover:bg-violet-600/10 hover:text-violet-300"
                      : "border-gray-300 text-gray-700 hover:border-violet-500 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              </motion.div>

              {/* Trust / short features */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center lg:justify-start items-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.36 }}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border ${darkMode ? 'bg-white/5 border-gray-800' : 'bg-white/60 border-gray-200'} shadow-lg`}>
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Instant validations</span>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border ${darkMode ? 'bg-white/5 border-gray-800' : 'bg-white/60 border-gray-200'} shadow-lg`}>
                  <svg className="w-4 h-4 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v9a3 3 0 01-3 3H6a3 3 0 01-3-3V4z"/>
                    <path d="M8 12h8" stroke="#fff" strokeLinecap="round"/>
                  </svg>
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Pitch decks in minutes</span>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border ${darkMode ? 'bg-white/5 border-gray-800' : 'bg-white/60 border-gray-200'} shadow-lg`}>
                  <svg className="w-4 h-4 text-violet-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 00-1 1v6H3a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2h-6V3a1 1 0 00-1-1z"/>
                  </svg>
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Practice with AI investors</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Mockup / visual panel */}
            <div className="lg:col-span-5">
              <motion.div
                className={`relative mx-auto w-full max-w-md sm:max-w-lg rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl border overflow-hidden ${
                  darkMode 
                    ? "bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-800/50" 
                    : "bg-white/70 border-gray-200"
                }`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.34 }}
              >
                {/* Gradient glow */}
                <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl ${
                  darkMode
                    ? "bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20"
                    : "bg-gradient-to-r from-violet-300/30 via-purple-300/30 to-fuchsia-300/30"
                }`} />

                {/* small top chips */}
                <div className="relative flex gap-2 items-center mb-4">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg" />
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg" />
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg" />
                  <div className={`ml-auto text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Live Preview</div>
                </div>

                {/* mockup content */}
                <div
                  className={`relative rounded-2xl p-3 border shadow-xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
                    darkMode
                      ? "bg-gradient-to-br from-gray-800/60 to-gray-700/30 border-gray-700/50"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {/* Video Demo Section */}
                  <div
                    className={`relative h-44 sm:h-56 w-full rounded-xl overflow-hidden ${
                      darkMode
                        ? "bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-transparent"
                        : "bg-gradient-to-br from-cyan-200 via-violet-200 to-white"
                    }`}
                  >
                    <video
                      src={Demo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    ></video>

                    {/* Optional overlay gradient for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl"></div>
                  </div>

                  {/* Stats below video */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-xl backdrop-blur-sm shadow-lg border ${
                        darkMode
                          ? "bg-white/5 border-gray-700/50"
                          : "bg-white/90 border-gray-100"
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        AI Score
                      </div>
                      <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        8.5 / 10
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl backdrop-blur-sm shadow-lg border ${
                        darkMode
                          ? "bg-white/5 border-gray-700/50"
                          : "bg-white/90 border-gray-100"
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Market Fit
                      </div>
                      <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        High
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer small features */}
                <div className={`relative mt-4 flex items-center justify-between text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div>Auto pitch deck · Investor Q&A</div>
                  <div className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-bold">3 free credits/month</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className={`relative z-10 py-6 sm:py-6 backdrop-blur-sm ${darkMode ? "bg-gray-900/30" : "bg-white/30"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-2xl md:text-2xl lg:text-3xl font-black mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Everything You Need to
              <span className="block mt-2 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Launch Successfully
              </span>
            </h2>
            <p
              className={`text-xs md:text-sm max-w-3xl mx-auto leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Comprehensive AI-powered tools to validate, refine, and pitch your
              startup ideas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`group relative p-4 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${
                  darkMode ? "bg-gray-900/50 border-gray-800/50" : "bg-white/80 border-gray-200"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                {/* Dynamic hover background color */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.hoverBg} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${feature.iconBg} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                <div className="relative">
                  {/* Dynamic icon color */}
                  <div
                    className={`w-8 h-8 rounded-2xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-2 shadow-xl ${feature.glowColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>

                  <h3
                    className={`text-md font-black mb-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 py-6 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-2xl md:text-2xl lg:text-2xl font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Trusted by
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Successful Founders
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={`group relative p-6 sm:p-4 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${
                  darkMode ? "bg-gray-900/50 border-gray-800/50" : "bg-white/80 border-gray-200"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                {/* Dynamic hover gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.hoverBg} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${testimonial.iconBg} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                <div className="relative">
                  {/* Star rating */}
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-amber-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className={`text-sm italic mb-6 leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    "{testimonial.quote}"
                  </p>

                  {/* Author section */}
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${testimonial.iconBg} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <span className="text-white font-bold text-md">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {testimonial.author}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className={`relative z-10 py-8 sm:py-8 backdrop-blur-sm ${darkMode ? "bg-gradient-to-br from-gray-900/50 to-gray-800/30" : "bg-gradient-to-br from-gray-50 to-white"}`}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-2xl md:text-xl lg:text-2xl font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Ready to Build the
              <span className="block mt-1 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Next Big Thing?
              </span>
            </h2>
            <p
              className={`text-xs sm:text-base  mb-4 sm:mb-10 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Join thousands of entrepreneurs who've validated their ideas with
              AI
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/signup")}
                className={`group relative flex items-center gap-3 px-10 py-2 overflow-hidden rounded-xl font-bold text-lg transition-all duration-300 hover:scale-110 shadow-2xl ${
                  darkMode
                    ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white hover:shadow-violet-500/50"
                    : "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white hover:shadow-cyan-500/50"
                }`}
              >
                {/* Button inner background with glow */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600"
                    : "bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600"
                }`}></div>

                {/* Button text + arrow */}
                <span className="relative z-10 flex items-center text-sm">
                  Start Your Journey Today
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;