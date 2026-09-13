import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
  Brain,
  MessageSquare,
  LayoutTemplate,
  Target,
  Play,
  Users,
  CreditCard,
  Layers,
  TrendingUp
} from "lucide-react";
import Demo from '../assets/run.mp4';

const FILTER_CARDS = [
  {
    title: "METRICS",
    icon: <Filter className="w-3 h-3 text-purple-400" />,
    iconBg: "bg-purple-500/20 border-purple-500/30",
    items: [
      { letter: "M", label: "Market Size", dotClass: "bg-emerald-500 text-white" },
      { letter: "C", label: "Competition", dotClass: "bg-blue-500 text-white" },
      { letter: "T", label: "Time to MVP", dotClass: "bg-yellow-500 text-black" },
    ],
  },
  {
    title: "AUDIENCE",
    icon: <Users className="w-3 h-3 text-blue-400" />,
    iconBg: "bg-blue-500/20 border-blue-500/30",
    items: [
      { letter: "B", label: "B2B", dotClass: "bg-blue-600 text-white" },
      { letter: "B", label: "B2C", dotClass: "bg-pink-500 text-white" },
      { letter: "E", label: "Enterprise", dotClass: "bg-indigo-500 text-white" },
    ],
  },
  {
    title: "TOOLS",
    icon: <LayoutTemplate className="w-3 h-3 text-rose-400" />,
    iconBg: "bg-rose-500/20 border-rose-500/30",
    items: [
      { letter: "M", label: "Market", dotClass: "bg-gray-800 text-white" },
      { letter: "P", label: "Pitching", dotClass: "bg-yellow-400 text-black" },
      { letter: "I", label: "Investors", dotClass: "bg-cyan-500 text-black" },
    ],
  },
  {
    title: "REVENUE",
    icon: <CreditCard className="w-3 h-3 text-emerald-400" />,
    iconBg: "bg-emerald-500/20 border-emerald-500/30",
    items: [
      { letter: "S", label: "SaaS", dotClass: "bg-emerald-500 text-white" },
      { letter: "U", label: "Usage", dotClass: "bg-blue-400 text-white" },
      { letter: "O", label: "One-time", dotClass: "bg-orange-500 text-white" },
    ],
  },
];

const AnimatedMetricCards = () => {
  const [cards, setCards] = useState(FILTER_CARDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        const firstCard = newCards.shift();
        if (firstCard) newCards.push(firstCard);
        return newCards;
      });
    }, 1500); // rotate every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 w-[350px] h-[200px] flex items-center justify-center">
      <AnimatePresence>
        {cards.map((card, index) => {
          const scale = 1 - index * 0.05; 
          const yOffset = index * -20; 
          const zIndex = 40 - index;
          const opacity = 1 - index * 0.2; 

          return (
            <motion.div
              key={card.title}
              layout
              initial={{ scale: 0.8, opacity: 0, y: yOffset - 20 }}
              animate={{
                scale,
                y: yOffset,
                zIndex,
                opacity,
              }}
              exit={{ scale: 1.05, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute w-full rounded-[24px] border border-white/5 bg-[#141414]/95 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-6 h-6 rounded flex items-center justify-center border ${card.iconBg}`}>
                  {card.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Filter By: {card.title}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {card.items.map((item, i) => (
                  <div key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2 shadow-inner">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.dotClass}`}>
                      <span className="text-[8px] font-bold">{item.letter}</span>
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
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
      answer: "PitchMint is an AI-powered platform designed to help founders validate their startup ideas instantly. It cross-references your idea against thousands of data points including market size, competition, and trends to give you actionable insights."
    },
    {
      question: "How can I validate my idea?",
      answer: "Simply enter your idea into our AI engine, and we'll analyze market demand, competition, and monetization potential to give you a comprehensive validation score."
    },
    {
      question: "Is PitchMint free to use?",
      answer: "We offer a generous free tier that allows you to run basic validations and access core features. For deeper insights, competitor analysis, and unlimited validations, we offer premium plans."
    },
    {
      question: "How are ideas scored?",
      answer: "Our AI evaluates multiple dimensions including Total Addressable Market (TAM), competitive density, technical feasibility, and current market trends."
    },
    {
      question: "How do I get started?",
      answer: "Create an account, describe your idea, and click validate. You'll receive instant insights and a complete roadmap."
    },
    {
      question: "Can I suggest new features?",
      answer: "Absolutely! We love feedback. You can suggest features directly from your dashboard."
    },
    {
      question: "What is PitchMint Pro?",
      answer: "Pro unlocks unlimited validations, competitor deep-dives, downloadable pitch decks, and our premium investor matchmaking algorithm."
    }
  ];

  const testimonials = [
    {
      quote: "PitchMint has been instrumental in giving me meaningful insights. The validation reports offer genuine insight into the realities of the market. You're never left feeling alone in your goals. Instead, you're consistently building and growing alongside a supportive, high-caliber AI.",
      author: "Sarah Chen",
      handle: "@sarah_chen",
      avatar: "S"
    },
    {
      quote: "Being part of PitchMint for the past couple of weeks has been a great experience. The guidance from the platform helped a lot to pivot my idea. Highly recommended!",
      author: "Michael R.",
      handle: "@michael_innovate",
      avatar: "M"
    },
    {
      quote: "Generated a professional pitch deck in minutes that would have taken weeks to create manually. The structure was perfect and the content hit all the right notes. Thanks to PitchMint for playing a huge role in my growth as a founder.",
      author: "Emily Zhang",
      handle: "@emilyz_data",
      avatar: "E"
    },
    {
      quote: "The competitor analysis feature alone is worth its weight in gold. Found indirect competitors I hadn't even considered. Ambitious and obsessed regarding market research.",
      author: "David L.",
      handle: "@david_builds",
      avatar: "D"
    },
    {
      quote: "PitchMint turned out to be more than what I initially expected. The community and AI insights have been real helpful. My go-to person for any questions regarding startup tech.",
      author: "Rajat Sharma",
      handle: "@rajat_startup",
      avatar: "R"
    },
    {
      quote: "I don't know how, but this tool is the most active I have ever seen. I've even bought very expensive courses, but this platform stood out. Ambitious and obsessed regarding startup validation.",
      author: "Shiv Shukla",
      handle: "@shiv_shukla",
      avatar: "S"
    }
  ];

  return (
    <div className="bg-[#000000] text-white selection:bg-purple-500/30 overflow-hidden font-sans w-full">

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-32 overflow-hidden z-10 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[90vh]">

        {/* Opensox-style Refined Smooth Hero Background */}
        <div className="absolute inset-0 -z-10 bg-[#000000] overflow-hidden">
          {/* Massive smooth radial gradient from top center */}
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[160vw] h-[1200px] md:h-[1400px] bg-[radial-gradient(ellipse_at_top,_rgba(90,35,220,0.85)_0%,_rgba(60,15,150,0.7)_35%,_rgba(20,5,60,0.3)_65%,_rgba(0,0,0,1)_90%)]"></div>
          
          {/* Finer static-like noise texture with mix-blend-overlay for seamless integration */}
          <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
          
          {/* Edge darkening to ensure perfect blend into below sections */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000000] pointer-events-none opacity-80"></div>
        </div>

        <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-8">

          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
              <span className="text-xs font-semibold text-gray-300">Backed by</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-gradient-to-br from-[#ff512f] to-[#dd2476] rounded-[4px] flex items-center justify-center shadow-[0_0_10px_rgba(255,81,47,0.5)]">
                  <span className="text-white text-[10px] font-bold leading-none">U</span>
                </div>
                <span className="text-xs font-semibold text-white">sers</span>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tighter leading-[1.1] text-white text-balance mb-8 max-w-4xl drop-shadow-xl"
          >
            Only platform you need to rock <span className="block">Startup Validation</span>
          </motion.h1>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full text-base md:text-lg tracking-tight font-light mb-12 text-gray-300 flex justify-center"
          >
            <span
              className="inline-flex items-center cursor-pointer hover:text-white transition-colors duration-300 pb-0.5 border-b border-gray-400"
              onClick={() => navigate("/signup")}
            >
              achieve in 1 week what took me 3 months in validation ↗
            </span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <button
              onClick={() => navigate("/signup")}
              className="flex gap-2 items-center justify-center px-6 py-2.5 rounded-full bg-[#6c28ff] hover:bg-[#5a1ec0] transition-colors duration-200 text-white font-semibold text-sm shadow-[0_0_20px_rgba(108,40,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#7c3aed]"
            >
              <span className="font-mono text-[13px] mr-1">{'>_'}</span>
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex gap-2 items-center justify-center px-6 py-2.5 rounded-full bg-[#3e0ea6] hover:bg-[#2d0a7a] transition-colors duration-200 text-white font-semibold text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#5113d7]"
            >
              <ArrowRight className="w-4 h-4" />
              Check Pro
            </button>
          </motion.div>
        </div>
      </section>

      {/* Supercharge Section Title */}
      <section className="w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full py-20 flex items-center justify-center relative border-y border-white/5 bg-black"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-center z-10 text-white">
            Supercharge Your Validation Journey
          </h2>
          {/* Subtle dotted background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] opacity-50"></div>
        </motion.div>

        {/* Bento Grid Features */}
        <div className="w-full max-w-[2000px] mx-auto border-x border-white/5 bg-[#0a0a0a] relative">
          {/* Subtle dot matrix background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 relative z-10">

            {/* Seamless Search (Concentric Circles) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-14 border-b lg:border-b-0 lg:border-r border-white/5 min-h-[450px] flex flex-col relative overflow-hidden group bg-transparent"
            >
              <div className="relative z-20 mb-12">
                <h3 className="text-2xl md:text-[28px] font-medium tracking-tight mb-2 text-white">Seamless Validation</h3>
                <p className="text-[15px] text-gray-400">Search thousands of data points instantly.</p>
              </div>

              {/* Graphic: Concentric Circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 w-[350px] h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                {/* Outermost ring */}
                <div className="absolute w-full h-full rounded-full border border-white/5"></div>

                {/* Orbit ring 1 */}
                <div className="absolute w-[75%] h-[75%] rounded-full border border-white/5 animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-[10%] left-[15%] w-10 h-10 bg-[#12052b] border border-[#c084fc]/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.3)] -ml-5 -mt-5" style={{ animation: "spin 20s linear infinite reverse" }}>
                    <Target className="w-5 h-5 text-[#c084fc]" />
                  </div>
                  <div className="absolute bottom-[20%] right-[5%] w-10 h-10 bg-[#12052b] border border-[#c084fc]/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.3)] -mr-5 -mb-5" style={{ animation: "spin 20s linear infinite reverse" }}>
                    <TrendingUp className="w-5 h-5 text-[#c084fc]" />
                  </div>
                </div>

                {/* Orbit ring 2 */}
                <div className="absolute w-[50%] h-[50%] rounded-full border border-white/10 bg-black/50 backdrop-blur-sm animate-[spin_10s_linear_infinite_reverse]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-black font-semibold text-xs shadow-lg" style={{ animation: "spin 10s linear infinite" }}>
                    Data
                  </div>
                  <div className="absolute bottom-0 right-0 -mr-2 -mb-2 bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]" style={{ animation: "spin 10s linear infinite" }}>
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Center text */}
                <div className="absolute z-20 font-bold text-2xl tracking-tighter text-white bg-black/80 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">PitchMint</div>
              </div>
            </motion.div>

            {/* Precision Filters (Floating UI Card) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 md:p-14 border-b border-white/5 min-h-[450px] flex flex-col relative overflow-hidden group bg-transparent"
            >
              <div className="relative z-20 mb-12">
                <h3 className="text-2xl md:text-[28px] font-medium tracking-tight mb-2 text-white">Precision Metrics</h3>
                <p className="text-[15px] text-gray-400">Zero in on ideas by market, stack and activity level.</p>
              </div>

              {/* Graphic: Animated Looping UI Cards */}
              <AnimatedMetricCards />
            </motion.div>
          </div>
        </div>

        {/* Demo Video Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[2000px] mx-auto p-4 md:p-12 border-x border-b border-white/5 bg-[#0a0a0a]"
        >
          <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl group cursor-pointer">
            {/* Fake macOS Header */}
            <div className="absolute top-0 left-0 w-full h-8 bg-[#141414] border-b border-white/5 flex items-center px-4 gap-2 z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              <div className="mx-auto text-[10px] text-gray-500 font-medium">PitchMint Dashboard</div>
            </div>

            {/* Video content */}
            <div className="pt-8 aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
                className="absolute inset-0 pt-8 w-full h-full object-cover opacity-40 grayscale"
                alt="Dashboard Mockup"
              />
              <video src={Demo} autoPlay loop muted playsInline className="absolute inset-0 pt-8 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"></video>

              {/* Large Red Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="w-20 h-20 rounded-full bg-[#ff0000] flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <Play className="w-8 h-8 text-white ml-1 fill-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 md:py-32 relative border-b border-white/5 bg-[#050505]">
        {/* Subtle dot matrix background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-[40px] font-medium tracking-tighter text-center mb-24 text-white"
          >
            How it Works
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Steps List */}
            <div className="flex flex-col">
              {[
                { step: "1", title: "Describe Your Idea", desc: "Choose the market, audience, and features that matter to you." },
                { step: "2", title: "Validate Instantly", desc: "Hit validate and let AI cross-reference market data against your criteria." },
                { step: "3", title: "Pivot & Build", desc: "Find the perfect product-market fit, start building, and make meaningful progress." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border-b border-white/5 relative group cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-purple-500 group-hover:h-full transition-all duration-300"></div>
                  <h4 className="text-[17px] font-semibold mb-2 text-white">{item.step}. {item.title}</h4>
                  <p className="text-[14px] text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Neon Graphic Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-[450px] w-full border border-white/5 bg-[#0a0a0a] rounded-[24px] relative flex items-center justify-center overflow-hidden"
            >
              {/* Perspective Grid Background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMxMS4wNDYgMCAyMC04Ljk1NCAyMC0yMFMyOC45NTQgMCAyMCAwIDAgOC45NTQgMCAyMHNiLjk1NCAyMCAyMCAyMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] [transform:perspective(500px)_rotateX(60deg)] opacity-30 origin-bottom"></div>

              {/* Glowing 3D Validate Graphic */}
              <div className="relative z-10 w-[280px] h-[120px] rounded-[32px] bg-[#1a0b36] border-[6px] border-[#c084fc] shadow-[0_0_80px_rgba(192,132,252,0.6),inset_0_0_30px_rgba(192,132,252,0.5)] flex items-center px-8 gap-4 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <Brain className="w-10 h-10 text-white stroke-[3px] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                <span className="text-[36px] font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Validate</span>

                {/* Floating button below */}
                <div className="absolute -bottom-16 right-4 rounded-xl border-[3px] border-[#c084fc] bg-[#1a0b36] px-8 py-3 shadow-[0_0_40px_rgba(192,132,252,0.4)]">
                  <span className="text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Insights</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="w-full py-24 md:py-32 relative border-b border-white/5 bg-[#080808]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-[40px] font-medium tracking-tighter text-center mb-16 text-white"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-[1px] bg-white/5 border border-white/5 rounded-xl overflow-hidden"
          >
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#0a0a0a]">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-8 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-semibold text-[15px] text-gray-200">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-6 pt-1 text-[14px] leading-relaxed text-gray-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="w-full py-24 border-b border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="sr-only">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 border border-white/5 rounded-3xl bg-[#0a0a0a] overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center py-16 px-4 hover:bg-white/[0.01] transition-colors cursor-default"
            >
              <span className="text-5xl md:text-[80px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8b5cf6] to-[#4c1d95] mb-4 tracking-tighter leading-none">32,757+</span>
              <span className="text-xl md:text-2xl font-semibold text-[#8b5cf6] tracking-wide">Validations</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center py-16 px-4 hover:bg-white/[0.01] transition-colors cursor-default"
            >
              <span className="text-5xl md:text-[80px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8b5cf6] to-[#4c1d95] mb-4 tracking-tighter leading-none">13,597+</span>
              <span className="text-xl md:text-2xl font-semibold text-[#8b5cf6] tracking-wide">Founders</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 md:py-32 relative bg-[#000000] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-[40px] font-medium tracking-tighter text-center mb-16 text-white relative z-20"
          >
            Testimonials
          </motion.h2>

          {/* Infinite Marquee Container */}
          <div className="relative h-[800px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] -mx-4 sm:mx-0 flex justify-center gap-6">

            {/* Column 1 - Scrolling UP */}
            <div className="w-full sm:w-[350px] flex-shrink-0 flex flex-col gap-6 animate-marqueeUp hover:[animation-play-state:paused] h-max">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div
                  key={`col1-${idx}`}
                  className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-[14px] text-gray-200 leading-tight">{t.author}</div>
                        <div className="text-[12px] text-gray-500">{t.handle}</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-gray-400">
                    {t.quote}
                  </p>
                </div>
              ))}
            </div>

            {/* Column 2 - Scrolling DOWN */}
            <div className="hidden md:flex w-[350px] flex-shrink-0 flex-col gap-6 animate-marqueeDown hover:[animation-play-state:paused] h-max">
              {[...testimonials, ...testimonials].reverse().map((t, idx) => (
                <div
                  key={`col2-${idx}`}
                  className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8C52FF] to-[#6014FF] flex items-center justify-center font-bold text-white text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-[14px] text-gray-200 leading-tight">{t.author}</div>
                        <div className="text-[12px] text-gray-500">{t.handle}</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-gray-400">
                    {t.quote}
                  </p>
                </div>
              ))}
            </div>

            {/* Column 3 - Scrolling UP */}
            <div className="hidden lg:flex w-[350px] flex-shrink-0 flex-col gap-6 animate-marqueeUp hover:[animation-play-state:paused] h-max">
              {/* Mix order for variation */}
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div
                  key={`col3-${idx}`}
                  className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4c1d95] to-[#2e1065] flex items-center justify-center font-bold text-white text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-[14px] text-gray-200 leading-tight">{t.author}</div>
                        <div className="text-[12px] text-gray-500">{t.handle}</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-gray-400">
                    {t.quote}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Radiant CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 pb-32 bg-[#000000]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-[1200px] mx-auto rounded-[32px] relative overflow-hidden p-12 md:p-24 text-center"
        >
          {/* Opensox-style Refined Smooth Background */}
          <div className="absolute inset-0 z-0 bg-[#000000] overflow-hidden">
            {/* Massive smooth radial gradient from center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(90,35,220,0.85)_0%,_rgba(60,15,150,0.7)_40%,_rgba(20,5,60,0.5)_70%,_rgba(0,0,0,1)_100%)]"></div>
            
            {/* Finer static-like noise texture with mix-blend-overlay for seamless integration */}
            <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold tracking-tight mb-6 text-white drop-shadow-sm text-balance leading-tight">
              Ready to dive into<br />Startup Validation?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 font-medium mb-10 max-w-xl text-balance">
              Join 10,000+ founders accelerating their journey.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="flex gap-2 items-center justify-center px-6 py-2.5 rounded-full bg-[#6c28ff] hover:bg-[#5a1ec0] transition-colors duration-200 text-white font-semibold text-sm shadow-[0_0_20px_rgba(108,40,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#7c3aed] mb-8"
            >
              <span className="font-mono text-[13px] mr-1">{'>_'}</span>
              Get Started
            </button>

            <a href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 border-b border-gray-500 hover:border-gray-300 pb-0.5">
              See what our investors say <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer has been removed here because it's managed globally by App.tsx */}
    </div>
  );
};

export default Landing;