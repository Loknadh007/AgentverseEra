import { useEffect, useState } from 'react';

interface PreLoaderProps {
  onComplete: () => void;
}

export default function PreLoader({ onComplete }: PreLoaderProps) {
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealing(true);
    }, 300);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/10">
      {/* Layered Grid Manifestation with 3D Parallax */}
      <div className="absolute inset-0">
        {/* Grid Layer 1 - Slowest */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'grid-flow 12s ease-in-out infinite alternate',
          }}
        />
        
        {/* Grid Layer 2 - Medium Speed */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-flow 8s ease-in-out infinite alternate',
            animationDelay: '0.5s',
          }}
        />
        
        {/* Grid Layer 3 - Fastest */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-flow 6s ease-in-out infinite alternate',
            animationDelay: '1s',
          }}
        />

        {/* Data Flow Lines - Vertical */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent"
            style={{
              left: `${(i + 1) * 12}%`,
              animation: 'grid-flow 10s ease-in-out infinite alternate',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Data Flow Lines - Horizontal */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            style={{
              top: `${(i + 1) * 16}%`,
              animation: 'grid-flow 8s ease-in-out infinite alternate',
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles for Eye-Catching Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full animate-particle-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Central Content with Text Reveal */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Geometric Center Element - Enhanced */}
        <div className="relative animate-float-smooth">
          <div className="w-40 h-40 relative">
            {/* Outer rotating ring with gradient */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-glow" />
            
            {/* Second ring - opposite rotation */}
            <div 
              className="absolute inset-3 rounded-full border-2 border-secondary/30 animate-border-glow"
              style={{
                animation: 'spin 6s linear infinite reverse',
              }}
            />
            
            {/* Third inner ring */}
            <div 
              className="absolute inset-6 rounded-full border-2 border-primary/40"
              style={{
                animation: 'spin 4s linear infinite',
              }}
            />
            
            {/* Central hexagon */}
            <div className="absolute inset-12 flex items-center justify-center">
              <div 
                className="w-16 h-16 border-2 border-primary/60 rotate-45 shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                style={{
                  animation: 'pulse-glow 3s ease-in-out infinite',
                }}
              />
            </div>
            
            {/* Center pulsing core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse-glow" />
            </div>

            {/* Orbiting particles */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`orbit-${i}`}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: 'spin 8s linear infinite',
                  animationDelay: `${i * -2}s`,
                }}
              >
                <div className="w-2 h-2 bg-secondary rounded-full absolute" style={{ top: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Staggered Text Reveal */}
        <div className="text-center space-y-3">
          <h1 
            className={`font-sans text-2xl tracking-wide uppercase text-primary font-bold transition-all duration-1000 ${
              isRevealing ? 'opacity-100 scale-100 animate-text-reveal' : 'opacity-0 scale-95'
            }`}
          >
            Initializing Bug Buster
          </h1>
          <h2 
            className={`font-sans text-xl tracking-wide uppercase text-primary/80 transition-all duration-1000 delay-300 ${
              isRevealing ? 'opacity-100 scale-100 animate-text-reveal' : 'opacity-0 scale-95'
            }`}
          >
            Core Logic...
          </h2>
          
          {/* Pulse indicators */}
          <div 
            className={`flex items-center justify-center gap-2 pt-6 transition-all duration-1000 delay-500 ${
              isRevealing ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
