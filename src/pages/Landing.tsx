import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  Terminal,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  Brain,
  MessageSquare,
  LayoutTemplate,
  Users,
  Target
} from "lucide-react";
import Demo from '../assets/run.mp4';

const Landing = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const faqs = [
    {
      question: "What is PitchMint?",
      answer: "PitchMint is an AI-powered platform designed to help founders validate their startup ideas, generate professional pitch decks, and practice pitches with simulated investors."
    },
    {
      question: "How can I validate my startup idea?",
      answer: "Simply enter your idea into our AI engine, and we'll analyze market demand, competition, and monetization potential to give you a comprehensive validation score."
    },
    {
      question: "Is PitchMint free to use?",
      answer: "We offer 3 free credits per month. For unlimited access to advanced features like competitor analysis and the pitch simulator, check out our Pro plans."
    },
    {
      question: "How are ideas scored?",
      answer: "Our AI evaluates multiple dimensions including Total Addressable Market (TAM), competitive density, technical feasibility, and current market trends."
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped me validate my startup idea and secure seed funding. The AI-generated insights were incredibly valuable.",
      author: "Sarah Chen",
      handle: "@sarah_chen",
      avatar: "S"
    },
    {
      quote: "The pitch simulator prepared me for real investor meetings. It's like having a personal pitch coach available 24/7. Highly recommended for any serious founder.",
      author: "Michael R.",
      handle: "@michael_innovate",
      avatar: "M"
    },
    {
      quote: "Generated a professional pitch deck in minutes that would have taken weeks to create manually. The structure was perfect and the content hit all the right notes.",
      author: "Emily Zhang",
      handle: "@emilyz_data",
      avatar: "E"
    },
    {
      quote: "The competitor analysis feature alone is worth its weight in gold. Found indirect competitors I hadn't even considered.",
      author: "David L.",
      handle: "@david_builds",
      avatar: "D"
    },
    {
      quote: "Ajeet's guidance and the PitchMint community have been instrumental in my journey. The AI feedback on my lean canvas helped me pivot early.",
      author: "Rajat Sharma",
      handle: "@rajat_startup",
      avatar: "R"
    },
    {
      quote: "Ambitious and obsessed regarding career and open source... PitchMint takes that same energy to startup validation.",
      author: "Shiv Shukla",
      handle: "@shiv_shukla",
      avatar: "S"
    }
  ];

  return (
    <div className={`min-h-screen selection:bg-purple-500/30 font-sans overflow-hidden ${darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Navbar spacer */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-32 overflow-hidden z-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        
        {/* Rich Purple Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-[#050505]">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/60 via-purple-900/20 to-[#0a0a0a] blur-[100px] opacity-80"></div>
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] opacity-50"></div>
        </div>
        
        <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center mb-8"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md backdrop-blur-md border ${
                darkMode ? "bg-black/40 border-white/10" : "bg-white/80 border-gray-200"
              }`}>
              <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Backed by</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-gradient-to-br from-[#FF6154] to-[#FF8C00] rounded-[4px] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold leading-none">U</span>
                </div>
                <span className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>sers</span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tighter leading-[1.05] text-balance mb-6 max-w-4xl"
          >
            Only platform you need to rock <span className="block">Startup Validation</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className={`w-full text-lg lg:text-xl tracking-tight font-light mb-10 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <span className={`inline-flex items-center gap-1 border-b cursor-pointer transition-colors duration-300 pb-0.5 ${darkMode ? "border-gray-500 hover:border-white hover:text-white" : "border-gray-400 hover:border-gray-900 hover:text-gray-900"}`} onClick={() => navigate("/signup")}>
              achieve in days what took months in validation ↗
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <button
              onClick={() => navigate("/signup")}
              className="group flex gap-2 items-center justify-center px-6 py-3 rounded-xl border border-[#7630f5] bg-gradient-to-b from-[#6b25ef] to-[#5100FF] shadow-[0px_1px_2px_0px_rgba(255,255,255,0.3)_inset] hover:opacity-90 transition-all duration-200 text-white font-medium text-sm"
            >
              <Terminal className="w-4 h-4" />
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex gap-2 items-center justify-center px-6 py-3 rounded-xl border border-[#5100FF] bg-[#2a1b54]/40 hover:bg-[#2a1b54]/60 transition-colors duration-200 text-white font-medium text-sm backdrop-blur-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Check Pro
            </button>
          </motion.div>
        </div>
      </section>

      {/* Supercharge Section */}
      <section className="w-full flex flex-col items-center">
        <div className={`w-full py-16 flex items-center justify-center relative border-y ${darkMode ? "border-[#222] bg-[#111]" : "border-gray-200 bg-gray-50"}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center z-10">
            Supercharge Your Startup Journey
          </h2>
          {darkMode && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_transparent_70%)]"></div>
          )}
        </div>

        {/* Bento Grid */}
        <div className="w-full max-w-[2000px] mx-auto border-x border-[#222]">
          <div className="grid lg:grid-cols-2">
            
            {/* Bento Card 1: Seamless Validation */}
            <div className={`p-8 md:p-12 border-b lg:border-b-0 lg:border-r ${darkMode ? "border-[#222] bg-[#0c0c0c]" : "border-gray-200 bg-white"} min-h-[400px] flex flex-col relative overflow-hidden group`}>
              <div className="relative z-10 mb-12">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">Seamless Validation</h3>
                <p className={`text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Analyze thousands of data points for your idea instantly.</p>
              </div>
              
              {/* Spinning Graphic */}
              <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                {/* Outer dashed ring */}
                <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-dashed border-[#333] animate-[spin_40s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center shadow-lg -rotate-[0deg]"><Brain className="w-5 h-5 text-purple-400"/></div>
                  <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg"><Target className="w-4 h-4 text-black"/></div>
                </div>
                {/* Inner solid ring */}
                <div className="absolute w-[60%] h-[60%] rounded-full border border-[#444] bg-[#111] animate-[spin_20s_linear_infinite_reverse]">
                  <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-xl"><LayoutTemplate className="w-6 h-6 text-white"/></div>
                </div>
                {/* Center text */}
                <div className="absolute z-20 font-bold text-xl md:text-2xl tracking-tighter">PitchMint AI</div>
              </div>
            </div>

            {/* Bento Card 2: Precision Filters */}
            <div className={`p-8 md:p-12 border-b ${darkMode ? "border-[#222] bg-[#0c0c0c]" : "border-gray-200 bg-white"} min-h-[400px] flex flex-col relative overflow-hidden group`}>
              <div className="relative z-10 mb-12">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">Precision Metrics</h3>
                <p className={`text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Zero in on ideas by market size, competition and cost.</p>
              </div>
              
              {/* Filter Graphic */}
              <div className="absolute bottom-[10%] left-[10%] w-[80%] h-auto rounded-[2rem] border border-[#333] bg-[#141414] p-6 shadow-2xl backdrop-blur-md transform group-hover:translate-y-[-10px] transition-transform duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                    <Filter className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter By: METRICS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#222] border border-[#333] text-xs font-medium text-gray-300 flex items-center gap-2 hover:bg-[#333] cursor-default transition-colors"><span className="w-2 h-2 rounded-full bg-green-400"></span> High TAM</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#222] border border-[#333] text-xs font-medium text-gray-300 flex items-center gap-2 hover:bg-[#333] cursor-default transition-colors"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Low CAC</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#222] border border-[#333] text-xs font-medium text-gray-300 flex items-center gap-2 hover:bg-[#333] cursor-default transition-colors"><span className="w-2 h-2 rounded-full bg-orange-400"></span> SaaS</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#222] border border-[#333] text-xs font-medium text-gray-300 flex items-center gap-2 hover:bg-[#333] cursor-default transition-colors"><span className="w-2 h-2 rounded-full bg-purple-400"></span> B2B</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Demo Video Container */}
        <div className={`w-full max-w-[2000px] mx-auto p-4 md:p-12 border-x border-b ${darkMode ? "border-[#222] bg-[#111]" : "border-gray-200 bg-gray-50"}`}>
          <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-[#333] bg-[#000] relative shadow-2xl aspect-video group cursor-pointer">
            <video src={Demo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"></video>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            {/* Fake Window Header */}
            <div className="absolute top-0 left-0 w-full h-10 bg-[#1a1a1a] border-b border-[#333] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="mx-auto text-[10px] text-gray-500 uppercase tracking-wider font-semibold">PitchMint Demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={`w-full py-24 md:py-32 relative border-b ${darkMode ? "border-[#222] bg-[#0a0a0a]" : "border-gray-200 bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center mb-20">
            How it Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Steps */}
            <div className="flex flex-col border-l border-[#333]">
              <div className="p-8 border-b border-[#333] relative">
                <div className="absolute -left-[5px] top-10 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                <h4 className="text-xl font-medium mb-3">1. Describe Your Idea</h4>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Enter a brief description of your startup idea, target audience, and potential business model.
                </p>
              </div>
              <div className="p-8 border-b border-[#333] relative">
                <h4 className="text-xl font-medium mb-3">2. AI Validation Instantly</h4>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Our AI engine cross-references market data to generate a comprehensive validation report.
                </p>
              </div>
              <div className="p-8 relative">
                <h4 className="text-xl font-medium mb-3">3. Discover & Pivot</h4>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Review the feedback, refine your lean canvas, and practice your pitch with our simulator.
                </p>
              </div>
            </div>

            {/* Graphic Right */}
            <div className={`rounded-3xl border p-8 flex items-center justify-center relative overflow-hidden h-[400px] ${darkMode ? "border-[#333] bg-gradient-to-br from-[#111] to-[#1a1a1a]" : "border-gray-200 bg-gray-50"}`}>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {/* 3D-ish Search UI Simulation */}
              <div className="relative z-10 rounded-2xl border border-purple-500/50 bg-[#160b29] p-2 shadow-[0_0_50px_rgba(147,51,234,0.3)] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="rounded-xl border border-purple-400 bg-purple-900/50 px-8 py-4 flex items-center gap-4">
                  <Search className="w-8 h-8 text-purple-300" />
                  <span className="text-3xl font-semibold text-purple-100 tracking-tight">Validate</span>
                </div>
                <div className="absolute -bottom-6 right-4 rounded-lg border border-purple-500 bg-[#160b29] px-6 py-2 shadow-lg">
                  <span className="text-lg font-medium text-purple-300">Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`w-full py-24 md:py-32 relative border-b ${darkMode ? "border-[#222] bg-[#111]" : "border-gray-200 bg-gray-50"}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-colors ${darkMode ? "border-[#333] bg-[#1a1a1a]" : "border-gray-200 bg-white"}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-medium text-[15px]">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`px-6 pb-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={`w-full py-16 border-b ${darkMode ? "border-[#222] bg-[#0a0a0a]" : "border-gray-200 bg-white"}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="sr-only">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#333]">
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6b25ef] to-[#5100FF] mb-2">32,757+</span>
              <span className="text-lg md:text-xl font-medium text-[#6b25ef] tracking-wide">Validations</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6b25ef] to-[#5100FF] mb-2">13,597+</span>
              <span className="text-lg md:text-xl font-medium text-[#6b25ef] tracking-wide">Founders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`w-full py-24 md:py-32 relative ${darkMode ? "bg-[#111]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center mb-16">
            Testimonials
          </h2>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className={`break-inside-avoid p-6 rounded-2xl border ${
                darkMode ? "border-[#222] bg-[#1a1a1a]" : "border-gray-200 bg-white"
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.author}</div>
                    <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{t.handle}</div>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Radiant CTA Section */}
      <section className={`w-full px-4 sm:px-6 lg:px-8 py-20 pb-32 ${darkMode ? "bg-[#111]" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto rounded-[2.5rem] relative overflow-hidden border border-[#5100FF]/30 p-12 md:p-24 text-center">
          
          {/* Vibrant Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d8b4fe] via-[#a855f7] to-[#3b82f6] opacity-90 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44KSIvPjwvc3ZnPg==')] opacity-40"></div>
            {/* White glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/40 blur-[80px] rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white drop-shadow-md text-balance">
              Ready to dive into<br/>Startup Validation?
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-xl text-balance drop-shadow-sm">
              Join 10,000+ founders accelerating their journey.
            </p>
            
            <button
              onClick={() => navigate("/signup")}
              className="flex gap-2 items-center justify-center px-8 py-4 rounded-xl border border-white/20 bg-[#6b25ef] hover:bg-[#5a1ec0] transition-colors duration-200 text-white font-medium text-lg shadow-2xl mb-6"
            >
              <Terminal className="w-5 h-5" />
              Get Started
            </button>
            
            <a href="#" className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/80 transition-colors">
              See what our investors say →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;