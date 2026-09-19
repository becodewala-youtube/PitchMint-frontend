import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/shared/lib/api';
import AuthLayout from '@/shared/components/layout/AuthLayout';

import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, Mail, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post(`/api/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to send reset email'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout theme="violet">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-[20px] bg-[#141414] shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-10 border border-white/10 relative z-10 w-full max-w-md"
        >
          <div className="relative text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#7c3aed]" />
              </div>
            </div>

            <h2 className="text-[22px] sm:text-[24px] font-bold mb-3 text-white tracking-tight">
              Check Your Email
              <span className="inline-block ml-2">✉️</span>
            </h2>
            <p className="text-[13px] mb-2 text-gray-400">
              We've sent a password reset link to
            </p>
            <p className="text-[14px] font-semibold text-white mb-8">
              {email}
            </p>

            <Link
              to="/reset-password"
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-[13px] font-semibold"
            >
              <span>Continue to Reset Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[12px] text-gray-400">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="font-semibold text-[#7c3aed] hover:text-[#5e17eb] transition-colors"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-center relative z-10"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#141414] border border-white/10 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
              <span className="text-[11px] font-semibold text-gray-400">
                Email sent successfully
              </span>
            </div>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout theme="violet">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-[20px] bg-[#141414] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/10 p-8 sm:p-6 relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="relative text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-300" />
            </div>
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-bold mb-1 text-white tracking-tight">
            Forgot Password?
            <span className="inline-block ml-2">🔐</span>
          </h2>
          <p className="text-[12px] text-gray-400">
            Enter your email address to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative space-y-5">
          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2.5 rounded-lg relative text-[12px] flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Email Field */}
          <div className="relative group">
            <label
              htmlFor="email"
              className="block text-[12px] font-medium mb-1.5 text-gray-300"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#141414] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors w-full pl-9 py-2 pr-3 text-[12px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !email}
            className={`w-full py-2.5 flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl transition-all duration-200 ${
              loading || !email
                ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                : "btn-primary text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Back to Sign In Link */}
          <div className="text-center pt-5 mt-2 border-t border-white/5">
            <Link
              to="/signin"
              className="inline-flex items-center text-[12px] font-medium text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-center relative z-10"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#141414] border border-white/10 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
            <span className="text-[11px] font-medium text-gray-400">
              Secure password recovery
            </span>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;