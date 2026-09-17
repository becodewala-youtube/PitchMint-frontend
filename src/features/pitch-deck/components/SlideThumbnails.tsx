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
      className="relative overflow-hidden rounded-[16px] p-3.5 sm:p-4 bg-[#0a0a0a]/95 border border-white/10 backdrop-blur-xl shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[12px] sm:text-[13px] font-semibold text-white">
          All Slides
        </h3>
        <div className="text-[10px] sm:text-[11px] font-medium text-gray-400">
          {slides.length} slides total
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        {slides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <motion.button
              key={slide.title || index}
              onClick={() => setCurrentSlide(index)}
              className={`group relative overflow-hidden p-2 sm:p-2.5 rounded-lg transition-all text-left flex items-center gap-2 ${
                isActive
                  ? 'bg-[#7c3aed] text-white font-semibold border-b-[3px] border-[#3904a6] shadow-sm'
                  : 'bg-[#141414] hover:bg-[#1f1f1f] text-gray-300 hover:text-white border border-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={`text-[10px] sm:text-[11px] font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {index + 1}.
              </span>
              <span className="text-[11px] font-medium line-clamp-1 truncate">
                {slide.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SlideThumbnails;
