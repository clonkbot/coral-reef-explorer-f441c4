import { useState, useEffect } from 'react'

interface GameUIProps {
  treasuresFound: number
  showInfo: string | null
}

export function GameUI({ treasuresFound, showInfo }: GameUIProps) {
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-4 md:pt-6 px-4 text-center pointer-events-none">
        <h1
          className="text-2xl md:text-4xl lg:text-5xl tracking-wider mb-2"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            color: '#4db8d6',
            textShadow: '0 0 20px rgba(77, 184, 214, 0.5), 0 0 40px rgba(77, 184, 214, 0.3)',
            letterSpacing: '0.15em'
          }}
        >
          CORAL REEF EXPLORER
        </h1>
        <p
          className="text-xs md:text-sm tracking-widest uppercase opacity-60"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: '#80d0e0',
            letterSpacing: '0.3em'
          }}
        >
          Underwater Aquarium
        </p>
      </div>

      {/* Treasure counter */}
      <div
        className="absolute top-20 md:top-24 right-4 md:right-6 z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 40, 60, 0.85) 0%, rgba(0, 30, 50, 0.9) 100%)',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid rgba(77, 184, 214, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="text-2xl md:text-3xl"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
            }}
          >
            💎
          </div>
          <div>
            <p
              className="text-[10px] md:text-xs uppercase tracking-widest opacity-70"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#80d0e0',
                letterSpacing: '0.2em'
              }}
            >
              Treasures
            </p>
            <p
              className="text-xl md:text-2xl font-light"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#ffd700',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}
            >
              {treasuresFound} / 3
            </p>
          </div>
        </div>
      </div>

      {/* Instructions panel */}
      {showInstructions && (
        <div
          className="absolute bottom-20 md:bottom-16 left-4 md:left-6 z-20 max-w-xs md:max-w-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 40, 60, 0.9) 0%, rgba(0, 30, 50, 0.95) 100%)',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid rgba(77, 184, 214, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            animation: 'fadeInUp 0.6s ease-out'
          }}
        >
          <h3
            className="text-sm md:text-base mb-3 tracking-wider"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#4db8d6',
              letterSpacing: '0.1em'
            }}
          >
            HOW TO EXPLORE
          </h3>
          <ul
            className="text-xs md:text-sm space-y-2 opacity-80"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#a0d0e0'
            }}
          >
            <li className="flex items-center gap-2">
              <span className="text-base">🖱️</span>
              <span>Drag to rotate view</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🔍</span>
              <span>Scroll to zoom in/out</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">💎</span>
              <span>Click treasure chests to open</span>
            </li>
          </ul>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-3 text-[10px] md:text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#4db8d6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.15em'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Info popup */}
      {showInfo && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 180, 0, 0.15) 100%)',
            borderRadius: '16px',
            padding: '20px 32px',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            animation: 'popIn 0.3s ease-out'
          }}
        >
          <p
            className="text-xl md:text-2xl tracking-wider"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#ffd700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
            }}
          >
            {showInfo}
          </p>
        </div>
      )}

      {/* Victory message */}
      {treasuresFound >= 3 && (
        <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30 text-center"
          style={{
            animation: 'fadeInUp 0.8s ease-out'
          }}
        >
          <p
            className="text-3xl md:text-5xl tracking-wider mb-2"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)'
            }}
          >
            🏆 ALL TREASURES FOUND! 🏆
          </p>
          <p
            className="text-sm md:text-base tracking-widest uppercase opacity-70"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#80d0e0',
              letterSpacing: '0.2em'
            }}
          >
            You are a true explorer
          </p>
        </div>
      )}

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-10 opacity-30">
        <svg viewBox="0 0 100 100" fill="none" stroke="#4db8d6" strokeWidth="1">
          <path d="M0 30 L0 0 L30 0" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-10 opacity-30">
        <svg viewBox="0 0 100 100" fill="none" stroke="#4db8d6" strokeWidth="1">
          <path d="M70 0 L100 0 L100 30" />
        </svg>
      </div>
      <div className="absolute bottom-12 left-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-10 opacity-30">
        <svg viewBox="0 0 100 100" fill="none" stroke="#4db8d6" strokeWidth="1">
          <path d="M0 70 L0 100 L30 100" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-10 opacity-30">
        <svg viewBox="0 0 100 100" fill="none" stroke="#4db8d6" strokeWidth="1">
          <path d="M70 100 L100 100 L100 70" />
        </svg>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  )
}
