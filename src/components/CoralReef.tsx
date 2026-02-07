import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoralReefProps {
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export function CoralReef({ position, scale = 1, rotation = [0, 0, 0] }: CoralReefProps) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Brain coral */}
      <BrainCoral position={[0, 0.5, 0]} color="#ff6b9d" />

      {/* Fan corals */}
      <FanCoral position={[1.5, 0, 0.5]} color="#ff8c42" rotation={[0, 0.5, 0]} />
      <FanCoral position={[-1, 0, -0.5]} color="#ffd700" rotation={[0, -0.3, 0]} scale={0.8} />

      {/* Tube corals */}
      <TubeCoral position={[0.5, 0, -1]} color="#00ffd0" />
      <TubeCoral position={[-0.5, 0, 1]} color="#4db8d6" />

      {/* Branch corals */}
      <BranchCoral position={[-1.5, 0, 0]} color="#ff6b9d" />
      <BranchCoral position={[1, 0, -1.5]} color="#00ffe0" scale={0.7} />

      {/* Anemones */}
      <Anemone position={[0.3, 0.2, 0.8]} color="#ff4d8d" />
      <Anemone position={[-0.8, 0.1, 0.3]} color="#9d4dff" />
    </group>
  )
}

function BrainCoral({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.8, 32, 32)
    const positions = geo.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const z = positions[i + 2]
      const noise = Math.sin(x * 8) * Math.cos(z * 8) * 0.08
      const length = Math.sqrt(x * x + y * y + z * z)
      const scale = (0.8 + noise) / length
      positions[i] *= scale
      positions[i + 1] *= scale * 0.7
      positions[i + 2] *= scale
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
  })

  return (
    <mesh ref={ref} geometry={geometry} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.6}
      />
    </mesh>
  )
}

function FanCoral({ position, color, rotation = [0, 0, 0], scale = 1 }: {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null!)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.05
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={ref}>
        {/* Fan shape made of thin planes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[0, 0.8 + i * 0.15, 0]}
            rotation={[0, 0, (i - 3.5) * 0.08]}
          >
            <planeGeometry args={[0.3 - i * 0.02, 0.2, 1, 1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        {/* Stem */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#3a2a2a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function TubeCoral({ position, color }: { position: [number, number, number]; color: string }) {
  const tubes = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      x: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.4,
      height: 0.5 + Math.random() * 0.8,
      radius: 0.08 + Math.random() * 0.06,
    }))
  }, [])

  return (
    <group position={position}>
      {tubes.map((tube, i) => (
        <mesh key={i} position={[tube.x, tube.height / 2, tube.z]}>
          <cylinderGeometry args={[tube.radius, tube.radius * 1.2, tube.height, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function BranchCoral({ position, color, scale = 1 }: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const branches = useMemo(() => {
    const result: Array<{
      pos: [number, number, number];
      rot: [number, number, number];
      height: number;
    }> = []

    // Main trunk
    result.push({ pos: [0, 0.4, 0], rot: [0, 0, 0], height: 0.8 })

    // Primary branches
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.3
      result.push({
        pos: [Math.cos(angle) * 0.15, 0.6 + Math.random() * 0.2, Math.sin(angle) * 0.15],
        rot: [Math.random() * 0.3 - 0.15, angle, 0.3 + Math.random() * 0.2],
        height: 0.4 + Math.random() * 0.3,
      })
    }

    // Secondary branches
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2
      result.push({
        pos: [Math.cos(angle) * 0.25, 0.8 + Math.random() * 0.3, Math.sin(angle) * 0.25],
        rot: [Math.random() * 0.4 - 0.2, angle, 0.4 + Math.random() * 0.3],
        height: 0.2 + Math.random() * 0.2,
      })
    }

    return result
  }, [])

  return (
    <group position={position} scale={scale}>
      {branches.map((branch, i) => (
        <mesh key={i} position={branch.pos} rotation={branch.rot}>
          <capsuleGeometry args={[0.04, branch.height, 4, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.25}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function Anemone({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!)
  const tentacles = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      offset: Math.random() * Math.PI * 2,
    })), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    tentacles.forEach((tentacle, i) => {
      const child = ref.current.children[i + 1] as THREE.Mesh
      if (child) {
        child.rotation.x = Math.sin(t * 2 + tentacle.offset) * 0.2
        child.rotation.z = Math.cos(t * 1.5 + tentacle.offset) * 0.15
      }
    })
  })

  return (
    <group ref={ref} position={position}>
      {/* Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.15, 12]} />
        <meshStandardMaterial color="#4a3a3a" roughness={0.8} />
      </mesh>

      {/* Tentacles */}
      {tentacles.map((tentacle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(tentacle.angle) * 0.1,
            0.25,
            Math.sin(tentacle.angle) * 0.1
          ]}
          rotation={[0.3, tentacle.angle, 0]}
        >
          <capsuleGeometry args={[0.02, 0.2, 4, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}
