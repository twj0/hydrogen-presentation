import React from 'react';
import { SlideData } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SlideRendererProps {
  slide: SlideData;
  step: number;
  direction: number;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, step, direction }) => {
  
  // Cinematic Slide Transitions
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)',
      zIndex: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    })
  };

  const content = (
    <motion.div 
      key={slide.id}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full h-full absolute top-0 left-0 overflow-hidden"
    >
        {/* Layout Switcher Logic */}
        {renderLayout(slide, step)}
    </motion.div>
  );

  return (
    <AnimatePresence initial={false} custom={direction} mode="popLayout">
      {content}
    </AnimatePresence>
  );
};

// Helper to render layout content
const renderLayout = (slide: SlideData, step: number) => {
    const commonClasses = "w-full h-full flex flex-col relative z-10";

    if (slide.layout === 'cover') {
        return (
          <div className={commonClasses}>
            {/* Background Image with Overlay */}
            {slide.backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img src={slide.backgroundImage} alt="bg" className="w-full h-full object-cover opacity-40 animate-pulse-slow" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
                </div>
            )}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
                {slide.content(step)}
            </div>
          </div>
        );
    }
    
    if (slide.layout === 'image-right') {
        return (
            <div className={`${commonClasses} flex-row`}>
                <div className="w-1/2 h-full relative p-12 flex flex-col justify-center z-10">
                    {slide.content(step)}
                </div>
                <div className="w-1/2 h-full relative overflow-hidden">
                     {/* Improved gradient mask for smoother blending */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/20 to-transparent z-10" />
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        src={slide.image} 
                        className="w-full h-full object-cover opacity-70"
                        alt="slide visual" 
                    />
                </div>
            </div>
        );
    }

    if (slide.layout === 'image-left') {
        return (
            <div className={`${commonClasses} flex-row`}>
                 <div className="w-1/2 h-full relative overflow-hidden">
                     {/* Improved gradient mask for smoother blending */}
                    <div className="absolute inset-0 bg-gradient-to-l from-[#020617] via-[#020617]/20 to-transparent z-10" />
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        src={slide.image} 
                        className="w-full h-full object-cover opacity-70"
                        alt="slide visual" 
                    />
                </div>
                <div className="w-1/2 h-full relative p-12 flex flex-col justify-center z-10">
                    {slide.content(step)}
                </div>
            </div>
        );
    }

    if (slide.layout === 'two-cols') {
        return (
             <div className={`${commonClasses} p-12`}>
                {slide.content(step)}
             </div>
        );
    }

    if (slide.layout === 'center') {
        return (
            <div className={`${commonClasses} p-12 items-center justify-center`}>
                {slide.content(step)}
            </div>
        );
    }

    // Default
    return (
        <div className={`${commonClasses} p-12`}>
            {slide.content(step)}
        </div>
    );
}

export default SlideRenderer;