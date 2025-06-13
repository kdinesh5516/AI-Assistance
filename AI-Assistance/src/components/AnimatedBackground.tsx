import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
      
      const darkColors = ['#00BFFF', '#00FF41', '#8A2BE2', '#FF4500', '#FF1493', '#00CED1'];
      const lightColors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
      const colors = isDarkMode ? darkColors : lightColors;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      particlesRef.current = particles;
    };

    const drawParticles = () => {
      // Clear with theme-appropriate background
      if (isDarkMode) {
        ctx.fillStyle = 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)';
      } else {
        ctx.fillStyle = 'radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 100%)';
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      
      // Draw neural connections
      ctx.strokeStyle = isDarkMode ? 'rgba(0, 191, 255, 0.15)' : 'rgba(79, 70, 229, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = (1 - distance / 180) * 0.4;
            ctx.stroke();
          }
        }
      }
      
      // Draw neuron nodes
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Enhanced glow effect
        ctx.shadowBlur = isDarkMode ? 25 : 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? '#ffffff' : particle.color;
        ctx.globalAlpha = particle.opacity * 0.8;
        ctx.shadowBlur = 0;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Smooth bounce off edges
        if (particle.x <= particle.size || particle.x >= canvas.width - particle.size) {
          particle.vx *= -0.8;
        }
        if (particle.y <= particle.size || particle.y >= canvas.height - particle.size) {
          particle.vy *= -0.8;
        }
        
        // Keep particles in bounds with padding
        particle.x = Math.max(particle.size, Math.min(canvas.width - particle.size, particle.x));
        particle.y = Math.max(particle.size, Math.min(canvas.height - particle.size, particle.y));
        
        // Subtle opacity pulsing
        particle.opacity += (Math.random() - 0.5) * 0.02;
        particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500"
      style={{ 
        background: isDarkMode 
          ? 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' 
          : 'radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 100%)'
      }}
    />
  );
};

export default AnimatedBackground;