import React from 'react';
import { motion } from 'framer-motion';
import PageBackground from '../ui/PageBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
  theme?: 'violet' | 'amber' | 'emerald' | 'blue' | 'orange' | 'cyan' | 'purple' | 'red';
  badgeText?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  theme = 'violet',
  badgeText = 'Secure & encrypted connection'
}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0118] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <PageBackground theme={theme} />
      
      <div className="relative z-10 max-w-md w-full">
        {children}

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-400">
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
