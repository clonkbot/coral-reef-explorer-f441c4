import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PirateShipProps {
  position: [number, number, number]
  rotation: [number, number, number]
}

export function PirateShip({ position, rotation }: PirateShipProps) {
  const ref = useRef<THREE.Group>(null!)
  const seaweedRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    // Gentle rocking motion
    const t = state.clock.elapsedTime
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.2) * 0.02
    ref.current.rotation.x = rotation[0] + Math.cos(t * 0.15) * 0.01

    // Animate seaweed on ship
    seaweedRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.z = Math.sin(t + i) * 0.2
      }
    })
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Hull - main body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Hull bottom curve */}
      <mesh position={[0, 0.3, 0]} scale={[1, 0.5, 1]}>
        <cylinderGeometry args={[1.3, 1, 3, 8, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
      </mesh>

      {/* Bow (front) */}
      <mesh position={[0, 1.2, 4.5]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Stern (back) */}
      <mesh position={[0, 2, -4]}>
        <boxGeometry args={[3.2, 3, 1]} />
        <meshStandardMaterial color="#4a3020" roughness={0.85} />
      </mesh>

      {/* Captain's cabin */}
      <mesh position={[0, 3, -3]}>
        <boxGeometry args={[2.5, 1.5, 2]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Cabin roof */}
      <mesh position={[0, 4, -3]} rotation={[0, 0, Math.PI / 4]} scale={[1, 0.3, 1]}>
        <boxGeometry args={[2, 2, 2.5]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
      </mesh>

      {/* Windows (broken) */}
      {[[-0.8, 2.8, -3.5], [0.8, 2.8, -3.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial
            color="#0a2030"
            emissive="#0a3040"
            emissiveIntensity={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Main mast (broken) */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 5, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
      </mesh>

      {/* Cross beam */}
      <mesh position={[0, 5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.1, 3, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
      </mesh>

      {/* Torn sail remnants */}
      <mesh position={[0, 4.5, 0.5]} rotation={[0.3, 0, 0.1]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          color="#8a8070"
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          roughness={1}
        />
      </mesh>

      {/* Front mast (fallen) */}
      <mesh position={[1, 2.5, 2]} rotation={[0.5, 0.2, 0.8]}>
        <cylinderGeometry args={[0.1, 0.15, 4, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
      </mesh>

      {/* Deck rails */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[1.4, 2.2, -2 + i * 1.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`left-${i}`} position={[-1.4, 2.2, -2 + i * 1.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>
      ))}

      {/* Anchor */}
      <group position={[1.6, 0.5, 3]} rotation={[0.2, 0.5, 0.3]}>
        <mesh>
          <torusGeometry args={[0.3, 0.05, 8, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.9, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.6} />
        </mesh>
      </group>

      {/* Barnacles and coral growth */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 3
        const y = Math.random() * 1.5 + 0.5
        const z = (Math.random() - 0.5) * 7
        return (
          <mesh key={i} position={[x > 0 ? 1.5 : -1.5, y, z]}>
            <sphereGeometry args={[0.1 + Math.random() * 0.15, 8, 8]} />
            <meshStandardMaterial
              color={Math.random() > 0.5 ? '#4a6a5a' : '#6a5a4a'}
              roughness={0.95}
            />
          </mesh>
        )
      })}

      {/* Seaweed growing on ship */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) seaweedRefs.current[i] = el }}
          position={[
            (Math.random() - 0.5) * 2.5,
            2.5 + Math.random(),
            (Math.random() - 0.5) * 6
          ]}
        >
          <capsuleGeometry args={[0.03, 0.8 + Math.random() * 0.5, 4, 8]} />
          <meshStandardMaterial
            color="#1a4a3a"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Treasure spilling out of hole */}
      <group position={[-1.2, 0.8, 1]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.random() * 0.5 - 0.7,
              Math.random() * 0.3,
              Math.random() * 0.5
            ]}
            rotation={[Math.random(), Math.random(), Math.random()]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.03, 12]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Ship's wheel (broken, lying on deck) */}
      <group position={[0, 2.3, -1.5]} rotation={[Math.PI / 2 - 0.3, 0, 0.2]}>
        <mesh>
          <torusGeometry args={[0.4, 0.04, 8, 24]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
            <boxGeometry args={[0.03, 0.5, 0.03]} />
            <meshStandardMaterial color="#3d2817" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Cannon */}
      <group position={[1.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.2, 1, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
