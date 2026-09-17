import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  theme?: 'violet' | 'amber' | 'emerald' | 'blue' | 'orange' | 'cyan' | 'purple' | 'red';
  badgeText?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  theme: _theme = 'violet',
  badgeText = 'Secure & encrypted connection'
}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-purple-500/30">
      
      {/* Refined Smooth Background from Landing */}
      <div className="absolute inset-0 z-0 bg-[#000000] overflow-hidden">
        {/* Massive smooth radial gradient from top center */}
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[160vw] h-[1200px] md:h-[1400px] bg-[radial-gradient(ellipse_at_top,_rgba(90,35,220,0.85)_0%,_rgba(60,15,150,0.7)_35%,_rgba(20,5,60,0.3)_65%,_rgba(0,0,0,1)_90%)]"></div>
        
        {/* Finer static-like noise texture with mix-blend-overlay for seamless integration */}
        <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
        
        {/* Edge darkening to ensure perfect blend into below sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000000] pointer-events-none opacity-80"></div>
      </div>
      
      <div className="relative z-10 max-w-[390px] w-full mt-16 sm:mt-20">
        {children}

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-300">
                {badgeText}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
