import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function OceanFloor() {
  const meshRef = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 64, 64)
    const positions = geo.attributes.position.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      // Create gentle undulating terrain
      positions[i + 2] =
        Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.8 +
        Math.sin(x * 0.3 + y * 0.2) * 0.3 +
        Math.random() * 0.15
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group>
      {/* Main ocean floor */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#1a3a4a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Sandy patches */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            0.05,
            (Math.random() - 0.5) * 40
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <circleGeometry args={[1 + Math.random() * 2, 16]} />
          <meshStandardMaterial
            color="#2a4a5a"
            roughness={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Rocks scattered around */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Rock
          key={i}
          position={[
            (Math.random() - 0.5) * 30,
            0,
            (Math.random() - 0.5) * 30
          ]}
          scale={0.3 + Math.random() * 0.8}
        />
      ))}

      {/* Seaweed patches */}
      {Array.from({ length: 25 }).map((_, i) => (
        <Seaweed
          key={i}
          position={[
            (Math.random() - 0.5) * 35,
            0,
            (Math.random() - 0.5) * 35
          ]}
        />
      ))}
    </group>
  )
}

function Rock({ position, scale }: { position: [number, number, number]; scale: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1, 0)
    const positions = geo.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] *= 0.8 + Math.random() * 0.4
      positions[i + 1] *= 0.6 + Math.random() * 0.4
      positions[i + 2] *= 0.8 + Math.random() * 0.4
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh
      geometry={geometry}
      position={position}
      scale={scale}
      rotation={[Math.random(), Math.random(), Math.random()]}
    >
      <meshStandardMaterial
        color="#1a2a35"
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  )
}

function Seaweed({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  const height = useMemo(() => 1.5 + Math.random() * 2, [])
  const color = useMemo(() => {
    const colors = ['#0a4a2a', '#0a3a3a', '#1a5a4a', '#0a5a2a']
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.z = Math.sin(t + offset) * 0.15
    ref.current.rotation.x = Math.cos(t * 0.7 + offset) * 0.1
  })

  return (
    <group position={position}>
      <group ref={ref}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 0.3,
              height / 2 * (0.8 + i * 0.1),
              (Math.random() - 0.5) * 0.3
            ]}
          >
            <capsuleGeometry args={[0.05, height * (1 - i * 0.2), 4, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
