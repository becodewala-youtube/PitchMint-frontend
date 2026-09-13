import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
