import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const Background: React.FC = () => {
  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      mouseX.set((clientX - centerX) / centerX);
      mouseY.set((clientY - centerY) / centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Generate random bubbles with stable IDs
  const [bubbles] = useState(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 20,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }))
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0F172A] pointer-events-none">
      {/* Background Gradient Orbs - reacting to mouse */}
      {/* Primary Teal Orb */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] mix-blend-screen"
        style={{ x: useTransform(mouseX, value => value * -20), y: useTransform(mouseY, value => value * -20) }}
      />
      {/* Secondary Blue Orb */}
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"
        style={{ x: useTransform(mouseX, value => value * -30), y: useTransform(mouseY, value => value * -30) }}
      />
      {/* Accent Purple Orb */}
      <motion.div 
        className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen"
        style={{ x: useTransform(mouseX, value => value * 20), y: useTransform(mouseY, value => value * 20) }}
      />
      
      {/* Floating Hydrogen Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full border border-teal-400/10 bg-teal-400/5 backdrop-blur-[1px]"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            bottom: -150,
            x: useTransform(mouseX, value => value * bubble.size * 0.2), // Parallax based on size
          }}
          animate={{
            y: -1200, // Move up
            opacity: [0, 0.4, 0], // Fade in/out
          }}
          transition={{
            y: {
                duration: bubble.duration,
                repeat: Infinity,
                ease: "linear",
                delay: bubble.delay,
            },
            opacity: {
                duration: bubble.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bubble.delay,
                times: [0, 0.5, 1]
            }
          }}
        />
      ))}

      {/* Noise Texture for Film Grain effect */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0F172A]/90"></div>
    </div>
  );
};

export default Background;