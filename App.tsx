
import React, { useState, useEffect, useCallback } from 'react';
import { slides } from './data/presentation';
import SlideRenderer from './components/SlideRenderer';
import AiAssistant from './components/AiAssistant';
import Background from './components/Background';
import { ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [clickStep, setClickStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = slides[currentSlideIndex];

  const goNext = useCallback(() => {
    if (clickStep < currentSlide.clicks) {
      setClickStep(prev => prev + 1);
    } else if (currentSlideIndex < slides.length - 1) {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
      setClickStep(0);
    }
  }, [clickStep, currentSlide.clicks, currentSlideIndex]);

  const goPrev = useCallback(() => {
    if (clickStep > 0) {
      setClickStep(prev => prev - 1);
    } else if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex(prev => prev - 1);
      setClickStep(0); 
    }
  }, [clickStep, currentSlideIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="w-screen h-screen bg-[#020617] text-slate-50 relative overflow-hidden font-sans select-none selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Animated Background with Parallax */}
      <Background />

      {/* Main Slide Stage */}
      <div className="relative w-full h-full z-10 flex flex-col justify-center items-center">
        <SlideRenderer slide={currentSlide} step={clickStep} direction={direction} />
      </div>

      {/* Navigation & Controls */}
      <div className="fixed bottom-6 left-6 flex items-center gap-4 z-40 group">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
            onClick={goPrev} 
            disabled={currentSlideIndex === 0 && clickStep === 0}
            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition"
            >
            <ChevronLeft size={20} />
            </button>
            <span className="text-xs font-mono text-gray-400 px-2 min-w-[3rem] text-center">
            {currentSlideIndex + 1} / {slides.length}
            </span>
            <button 
            onClick={goNext}
            disabled={currentSlideIndex === slides.length - 1 && clickStep === currentSlide.clicks}
            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition"
            >
            <ChevronRight size={20} />
            </button>
        </div>
        
        <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition opacity-0 group-hover:opacity-100"
        >
            <Maximize2 size={16} />
        </button>
      </div>

      {/* Minimal Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[3px] bg-gray-900 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(6,182,212,0.8)]"
          style={{ width: `${((currentSlideIndex) / (slides.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* AI Assistant */}
      <AiAssistant currentSlideText={currentSlide.ttsText} />

      {/* Branding */}
      <div className="fixed top-6 right-6 z-40 opacity-40 mix-blend-screen pointer-events-none">
        <span className="font-display font-bold text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-lg">H₂ FUTURE</span>
      </div>
    </div>
  );
};

export default App;
