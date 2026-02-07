import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { OceanFloor } from './components/OceanFloor'
import { CoralReef } from './components/CoralReef'
import { TropicalFish } from './components/TropicalFish'
import { PirateShip } from './components/PirateShip'
import { TreasureChest } from './components/TreasureChest'
import { Bubbles } from './components/Bubbles'
import { UnderwaterFog } from './components/UnderwaterFog'
import { GameUI } from './components/GameUI'

function App() {
  const [treasuresFound, setTreasuresFound] = useState(0)
  const [showInfo, setShowInfo] = useState<string | null>(null)

  const handleTreasureClick = () => {
    setTreasuresFound(prev => prev + 1)
    setShowInfo('✨ You found treasure!')
    setTimeout(() => setShowInfo(null), 2000)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #001220 0%, #002030 30%, #001825 100%)' }}>
      {/* Underwater caustics overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-10"
        style={{
          background: `
            radial-gradient(ellipse 100px 80px at 20% 30%, rgba(0,180,220,0.3) 0%, transparent 50%),
            radial-gradient(ellipse 80px 60px at 70% 20%, rgba(0,200,180,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 120px 100px at 40% 70%, rgba(0,150,200,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 90px 70px at 80% 60%, rgba(0,180,160,0.15) 0%, transparent 50%)
          `,
          animation: 'caustics 8s ease-in-out infinite'
        }}
      />

      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Underwater lighting */}
          <ambientLight intensity={0.3} color="#1a4a6e" />
          <directionalLight
            position={[10, 30, 10]}
            intensity={0.8}
            color="#4db8d6"
            castShadow
          />
          <pointLight position={[-5, 10, -10]} intensity={0.5} color="#00ffe0" />
          <pointLight position={[8, 5, 5]} intensity={0.3} color="#ff6b9d" />

          {/* Environment for reflections */}
          <Environment preset="night" />

          {/* Underwater atmosphere */}
          <fog attach="fog" args={['#0a3040', 5, 50]} />
          <UnderwaterFog />

          {/* Stars become distant particles */}
          <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.5} />

          {/* Ocean floor */}
          <OceanFloor />

          {/* Coral reef clusters */}
          <CoralReef position={[-8, 0, -5]} scale={1.2} />
          <CoralReef position={[6, 0, -8]} scale={0.9} rotation={[0, Math.PI / 3, 0]} />
          <CoralReef position={[-3, 0, 3]} scale={0.7} rotation={[0, -Math.PI / 4, 0]} />
          <CoralReef position={[10, 0, 2]} scale={1.1} rotation={[0, Math.PI / 2, 0]} />

          {/* Tropical fish schools */}
          <TropicalFish count={8} center={[0, 4, 0]} color="#ff6b9d" />
          <TropicalFish count={6} center={[-5, 6, -3]} color="#ffd700" />
          <TropicalFish count={5} center={[7, 3, -5]} color="#00ffd0" />
          <TropicalFish count={4} center={[3, 8, 3]} color="#ff8c42" />

          {/* Sunken pirate ship */}
          <PirateShip position={[0, 0.5, -12]} rotation={[0.1, 0.3, 0.15]} />

          {/* Treasure chests */}
          <TreasureChest
            position={[-6, 0.3, 0]}
            onClick={handleTreasureClick}
            glowColor="#ffd700"
          />
          <TreasureChest
            position={[4, 0.3, -3]}
            onClick={handleTreasureClick}
            glowColor="#00ffd0"
          />
          <TreasureChest
            position={[1, 1.5, -10]}
            onClick={handleTreasureClick}
            glowColor="#ff6b9d"
            scale={0.8}
          />

          {/* Floating bubbles */}
          <Bubbles />

          {/* Camera controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={35}
            maxPolarAngle={Math.PI / 2 + 0.3}
            enablePan={true}
          />
        </Suspense>
      </Canvas>

      {/* Game UI overlay */}
      <GameUI treasuresFound={treasuresFound} showInfo={showInfo} />

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 py-3 px-4 text-center">
        <p className="text-[10px] md:text-xs tracking-widest uppercase opacity-40"
          style={{
            color: '#4db8d6',
            fontFamily: '"Cormorant Garamond", serif',
            letterSpacing: '0.2em'
          }}>
          Requested by @0xPaulius · Built by @clonkbot
        </p>
      </footer>

      <style>{`
        @keyframes caustics {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -5px) scale(1.05); }
          50% { transform: translate(-5px, 10px) scale(0.95); }
          75% { transform: translate(-10px, -10px) scale(1.02); }
        }
      `}</style>
    </div>
  )
}

export default App
