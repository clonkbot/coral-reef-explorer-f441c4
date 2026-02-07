import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TropicalFishProps {
  count: number
  center: [number, number, number]
  color: string
}

export function TropicalFish({ count, center, color }: TropicalFishProps) {
  const fishData = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      offset: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.3,
      yOffset: (Math.random() - 0.5) * 2,
      scale: 0.15 + Math.random() * 0.1,
      wobble: Math.random() * Math.PI * 2,
    })), [count])

  return (
    <group position={center}>
      {fishData.map((fish, i) => (
        <Fish
          key={i}
          offset={fish.offset}
          radius={fish.radius}
          speed={fish.speed}
          yOffset={fish.yOffset}
          scale={fish.scale}
          color={color}
          wobble={fish.wobble}
        />
      ))}
    </group>
  )
}

interface FishProps {
  offset: number
  radius: number
  speed: number
  yOffset: number
  scale: number
  color: string
  wobble: number
}

function Fish({ offset, radius, speed, yOffset, scale, color, wobble }: FishProps) {
  const ref = useRef<THREE.Group>(null!)
  const tailRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset

    // Circular swimming path with some variation
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const y = yOffset + Math.sin(t * 2 + wobble) * 0.3

    ref.current.position.set(x, y, z)

    // Face direction of movement
    const angle = Math.atan2(-Math.sin(t), -Math.cos(t))
    ref.current.rotation.y = angle + Math.PI / 2

    // Subtle body wobble
    ref.current.rotation.z = Math.sin(t * 8) * 0.08

    // Tail animation
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 10) * 0.4
    }
  })

  const lighterColor = useMemo(() => {
    const c = new THREE.Color(color)
    c.offsetHSL(0, -0.1, 0.2)
    return c
  }, [color])

  const darkerColor = useMemo(() => {
    const c = new THREE.Color(color)
    c.offsetHSL(0, 0, -0.2)
    return c
  }, [color])

  return (
    <group ref={ref} scale={scale}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Body stretch */}
      <mesh scale={[1.3, 0.8, 0.6]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial
          color={lighterColor}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Eye left */}
      <mesh position={[0.5, 0.2, 0.4]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.2, 0.5]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>

      {/* Eye right */}
      <mesh position={[0.5, 0.2, -0.4]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.2, -0.5]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>

      {/* Dorsal fin */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshStandardMaterial
          color={darkerColor}
          emissive={color}
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Tail */}
      <group ref={tailRef} position={[-1.2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.6, 0.8, 4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* Side fins */}
      <mesh position={[0.2, -0.2, 0.5]} rotation={[0.8, 0.3, 0]}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial
          color={lighterColor}
          emissive={color}
          emissiveIntensity={0.15}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0.2, -0.2, -0.5]} rotation={[-0.8, -0.3, 0]}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial
          color={lighterColor}
          emissive={color}
          emissiveIntensity={0.15}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Stripes for detail */}
      {[0.3, 0, -0.3].map((xPos, i) => (
        <mesh key={i} position={[xPos, 0, 0]} scale={[0.1, 0.9, 0.7]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={darkerColor}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}
