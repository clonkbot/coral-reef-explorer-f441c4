import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TreasureChestProps {
  position: [number, number, number]
  onClick: () => void
  glowColor: string
  scale?: number
}

export function TreasureChest({ position, onClick, glowColor, scale = 1 }: TreasureChestProps) {
  const ref = useRef<THREE.Group>(null!)
  const lidRef = useRef<THREE.Group>(null!)
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const targetLidRotation = useRef(0)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Gentle floating motion
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.05

    // Glow pulsing
    const glowIntensity = 0.3 + Math.sin(t * 2) * 0.15 + (hovered ? 0.3 : 0)

    // Update materials
    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        if (child.userData.isGlow) {
          child.material.emissiveIntensity = glowIntensity
        }
      }
    })

    // Animate lid opening
    targetLidRotation.current = isOpen ? -Math.PI / 2 : 0
    if (lidRef.current) {
      lidRef.current.rotation.x += (targetLidRotation.current - lidRef.current.rotation.x) * 0.1
    }
  })

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      onClick()
    }
  }

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Glow effect underneath */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ isGlow: true }}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Chest base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
        <meshStandardMaterial
          color="#5a3a1a"
          roughness={0.8}
        />
      </mesh>

      {/* Metal bands */}
      {[-0.35, 0, 0.35].map((z, i) => (
        <mesh key={i} position={[0, 0.3, z]}>
          <boxGeometry args={[1.25, 0.08, 0.06]} />
          <meshStandardMaterial
            color="#8a7a3a"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Corner metal pieces */}
      {[
        [-0.55, 0.1, 0.35], [0.55, 0.1, 0.35],
        [-0.55, 0.1, -0.35], [0.55, 0.1, -0.35],
        [-0.55, 0.5, 0.35], [0.55, 0.5, 0.35],
        [-0.55, 0.5, -0.35], [0.55, 0.5, -0.35],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial
            color="#8a7a3a"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Lid group */}
      <group ref={lidRef} position={[0, 0.6, -0.35]}>
        {/* Lid main */}
        <mesh position={[0, 0.2, 0.35]}>
          <boxGeometry args={[1.2, 0.15, 0.8]} />
          <meshStandardMaterial
            color="#5a3a1a"
            roughness={0.8}
          />
        </mesh>

        {/* Lid curve */}
        <mesh position={[0, 0.35, 0.35]} scale={[1, 0.4, 1]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color="#4a2a0a"
            roughness={0.85}
          />
        </mesh>

        {/* Lid metal bands */}
        {[-0.35, 0, 0.35].map((z, i) => (
          <mesh key={i} position={[0, 0.28, z + 0.35]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.08, 1.25, 0.06]} />
            <meshStandardMaterial
              color="#8a7a3a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Lock */}
      <mesh position={[0, 0.4, 0.42]} userData={{ isGlow: true }}>
        <boxGeometry args={[0.2, 0.25, 0.08]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Treasure inside (visible when open) */}
      {isOpen && (
        <group position={[0, 0.35, 0]}>
          {/* Gold coins pile */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 0.8,
                Math.random() * 0.2,
                (Math.random() - 0.5) * 0.5
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
              <meshStandardMaterial
                color="#ffd700"
                emissive="#ffd700"
                emissiveIntensity={0.4}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          ))}

          {/* Gems */}
          {[
            { pos: [0, 0.15, 0], color: '#ff0040' },
            { pos: [-0.2, 0.1, 0.1], color: '#00ff80' },
            { pos: [0.15, 0.12, -0.1], color: '#0080ff' },
          ].map((gem, i) => (
            <mesh key={i} position={gem.pos as [number, number, number]}>
              <octahedronGeometry args={[0.08]} />
              <meshStandardMaterial
                color={gem.color}
                emissive={gem.color}
                emissiveIntensity={0.6}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}

          {/* Pearl necklace */}
          <group position={[0.25, 0.05, 0.15]}>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} position={[(i - 2) * 0.06, 0, 0]}>
                <sphereGeometry args={[0.03, 12, 12]} />
                <meshStandardMaterial
                  color="#fff8f0"
                  roughness={0.2}
                  metalness={0.3}
                />
              </mesh>
            ))}
          </group>

          {/* Sparkle particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={`sparkle-${i}`}
              position={[
                (Math.random() - 0.5) * 0.6,
                0.2 + Math.random() * 0.3,
                (Math.random() - 0.5) * 0.4
              ]}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
