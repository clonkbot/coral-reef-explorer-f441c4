import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Bubbles() {
  const count = 60
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const bubbleData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      speed: 0.5 + Math.random() * 1,
      offset: Math.random() * 20,
      scale: 0.05 + Math.random() * 0.15,
      wobbleSpeed: 1 + Math.random() * 2,
      wobbleAmount: 0.5 + Math.random() * 1,
    }))
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    bubbleData.forEach((bubble, i) => {
      // Reset when bubble reaches top
      let y = ((t * bubble.speed + bubble.offset) % 25) - 2

      // Wobble motion
      const wobbleX = Math.sin(t * bubble.wobbleSpeed + i) * bubble.wobbleAmount
      const wobbleZ = Math.cos(t * bubble.wobbleSpeed * 0.7 + i) * bubble.wobbleAmount * 0.5

      dummy.position.set(
        bubble.x + wobbleX,
        y,
        bubble.z + wobbleZ
      )
      dummy.scale.setScalar(bubble.scale * (1 + Math.sin(t * 3 + i) * 0.1))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#80d0ff"
        emissive="#40a0d0"
        emissiveIntensity={0.2}
        transparent
        opacity={0.4}
        roughness={0.1}
        metalness={0.2}
      />
    </instancedMesh>
  )
}
