import React from 'react';
import { motion } from 'framer-motion';

interface Slide {
  title: string;
  gradient?: string;
  content: string;
}

interface SlideThumbnailsProps {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

const SlideThumbnails: React.FC<SlideThumbnailsProps> = ({ slides, currentSlide, setCurrentSlide }) => {
  if (!slides || slides.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-3 bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold text-white`}>
          All Slides
        </h3>
        <div className={`text-xs font-medium text-gray-400`}>
          {slides.length} slides total
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {slides.map((slide, index) => (
          <motion.button
            key={slide.title || index}
            onClick={() => setCurrentSlide(index)}
            className={`group relative overflow-hidden p-2 sm:p-3 rounded-xl transition-all duration-300 ${
              currentSlide === index
                ? `bg-gradient-to-br ${slide.gradient || 'from-violet-500 to-purple-500'} text-white shadow-xl`
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700/50'
            } hover:scale-105`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Gradient overlay for non-active slides */}
            {currentSlide !== index && slide.gradient && (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
            )}

            <div className="relative flex items-center gap-2">
              <div
                className={`text-xs font-bold ${currentSlide === index ? "text-white" : ""}`}
              >
                {index + 1}.
              </div>

              <div
                className={`text-xs font-semibold line-clamp-2 ${currentSlide === index ? "text-white" : ""}`}
              >
                {slide.title}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SlideThumbnails;
