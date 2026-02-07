import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function UnderwaterFog() {
  const ref1 = useRef<THREE.Mesh>(null!)
  const ref2 = useRef<THREE.Mesh>(null!)
  const ref3 = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Slowly moving fog layers
    if (ref1.current) {
      ref1.current.position.x = Math.sin(t * 0.1) * 5
      ref1.current.position.z = Math.cos(t * 0.08) * 3
    }
    if (ref2.current) {
      ref2.current.position.x = Math.cos(t * 0.07) * 4
      ref2.current.position.z = Math.sin(t * 0.12) * 5
    }
    if (ref3.current) {
      ref3.current.position.x = Math.sin(t * 0.05 + 2) * 6
      ref3.current.position.z = Math.cos(t * 0.09 + 1) * 4
    }
  })

  return (
    <group>
      {/* Light rays from surface */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -15 + i * 8,
            12,
            -5 + (i % 2) * 10
          ]}
          rotation={[0, 0, 0.1 + i * 0.05]}
        >
          <cylinderGeometry args={[0.5, 2, 25, 8]} />
          <meshStandardMaterial
            color="#40a0d0"
            emissive="#40a0d0"
            emissiveIntensity={0.15}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Atmospheric fog volumes */}
      <mesh ref={ref1} position={[0, 8, 0]}>
        <sphereGeometry args={[15, 16, 16]} />
        <meshStandardMaterial
          color="#1a4a6a"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={ref2} position={[-10, 5, -10]}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshStandardMaterial
          color="#0a3a4a"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={ref3} position={[8, 10, 5]}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshStandardMaterial
          color="#2a5a6a"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Particle dust */}
      {Array.from({ length: 40 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  )
}

function FloatingParticle({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const startPos = {
    x: (Math.random() - 0.5) * 50,
    y: Math.random() * 20,
    z: (Math.random() - 0.5) * 50,
  }
  const speed = 0.2 + Math.random() * 0.3
  const offset = Math.random() * Math.PI * 2

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.x = startPos.x + Math.sin(t * speed + offset) * 2
    ref.current.position.y = startPos.y + Math.sin(t * speed * 0.5 + offset) * 1
    ref.current.position.z = startPos.z + Math.cos(t * speed * 0.7 + offset) * 2

    // Subtle scale pulsing
    const scale = 0.02 + Math.sin(t * 2 + index) * 0.01
    ref.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={ref} position={[startPos.x, startPos.y, startPos.z]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#80c0d0"
        emissive="#60a0b0"
        emissiveIntensity={0.3}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}
