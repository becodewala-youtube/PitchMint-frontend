import { Link } from 'react-router-dom';
import { Home, FileQuestion, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 overflow-hidden relative">
      {/* Background Noise / Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        
        {/* Animated Illustration */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          {/* Glowing backdrop */}
          <div className="absolute inset-0 bg-[#7c3aed]/20 blur-[60px] rounded-full" />
          
          {/* Rotating Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-dashed border-white/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 border border-dashed border-[#7c3aed]/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-16 border border-white/10 rounded-full"
          />

          {/* Floating Document */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-20 h-20 bg-[#141414] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <FileQuestion className="w-10 h-10 text-[#7c3aed]" />
            
            {/* Orbiting Search Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-40px]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a] border border-white/20 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-4 h-4 text-gray-300" />
              </div>
            </motion.div>

            {/* Orbiting Planet */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-75px]"
            >
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-600 to-[#7c3aed] shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-white/10 overflow-hidden">
                {/* Planet surface details */}
                <div className="absolute w-12 h-3 bg-black/30 rounded-full -rotate-45 translate-y-3 blur-[2px]" />
                <div className="absolute w-3 h-3 bg-white/40 rounded-full top-2 right-2 blur-[1px]" />
              </div>
            </motion.div>
          </motion.div>
          
          {/* Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0], 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3 + i, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5 
              }}
              className="absolute"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
            >
              <Sparkles className="w-3 h-3 text-[#7c3aed]/60" />
            </motion.div>
          ))}
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-[#141414] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-[20px] p-8 sm:p-10 text-center w-full max-w-md backdrop-blur-xl"
        >
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10">
            <span className="text-[12px] font-semibold tracking-wider text-gray-400 uppercase">Error 404</span>
          </div>
          
          <h1 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight mb-3">
            Lost in Space
          </h1>
          
          <p className="text-[13px] sm:text-[14px] text-gray-400 mb-8 leading-relaxed">
            We've searched the entire universe, but the page you're looking for seems to have vanished into a black hole.
          </p>

          <Link
            to="/"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Base</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
