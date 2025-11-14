import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Mail, Send, MessageSquare, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'general', label: 'General Support' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Credits' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'business', label: 'Business Inquiry' }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY; 
      
      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: categories.find(cat => cat.value === formData.category)?.label,
        message: formData.message,
        to_email: import.meta.env.VITE_EMAILJS_EMAILID
      };
      
      // Send email using EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setLoading(false);
      alert('Failed to send message. Please try again or contact us directly at antik8795@gmail.com');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-[#0a0118]" : "bg-gray-50"}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        

        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-cyan-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-center">
              <div
                className={`hidden md:flex md:w-8 md:h-8 w-6 h-6 rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 items-center justify-center shadow-2xl ${
                  darkMode ? "shadow-cyan-500/50" : "shadow-cyan-500/30"
                }`}
              >
                <Mail className="md:w-4 md:h-4 w-4 h-4 text-white" />
              </div>

              <div>
                <h1 className={`text-lg md:text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Contact{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Us
                  </span>
                </h1>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                  We're here to help you succeed with your startup
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-5 ${
            darkMode ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
          } backdrop-blur-xl shadow-2xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={`absolute -inset-1 bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-indigo-600/20 opacity-50 blur-xl`} />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-xl ${darkMode ? 'shadow-cyan-500/50' : 'shadow-cyan-500/30'}`}>
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-sm md:text-md font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Send us a Message
              </h2>
            </div>
            
            {success && (
              <motion.div 
                className={`mb-4 p-4 rounded-xl border ${
                  darkMode 
                    ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Message sent successfully! We'll get back to you soon.</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl text-xs outline-none transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    }`}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl text-xs outline-none transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-xl text-xs outline-none transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-800/50 border border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      : "bg-gray-50 border border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-xl text-xs outline-none transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  }`}
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-2 rounded-xl text-xs outline-none transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  }`}
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-1 sm:py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We typically respond within 24-48 hours. For urgent matters, please email us directly at{' '}
            <a href="mailto:antik8795@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              antik8795@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;