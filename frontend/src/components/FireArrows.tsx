import { useState, useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ArrowData {
  id: number
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  velocity: number
  landed: boolean
}

interface FireArrowsProps {
  active: boolean
  arrowCount?: number
  waveId?: number
  onArrowLand?: (position: THREE.Vector3) => void
}

export function FireArrows({ active, arrowCount, waveId = 0, onArrowLand }: FireArrowsProps) {
  const [arrows, setArrows] = useState<ArrowData[]>([])
  const arrowRefs = useRef<(THREE.Mesh | null)[]>([])
  const dataRef = useRef<ArrowData[]>([])       // mutable copy for useFrame
  const spawnedWave = useRef(-1)

  // Spawn arrows when active changes to true
  useEffect(() => {
    if (!active) {
      setArrows([])
      dataRef.current = []
      spawnedWave.current = -1
      return
    }

    if (spawnedWave.current === waveId) return
    spawnedWave.current = waveId

    const count = arrowCount ?? (Math.floor(Math.random() * 40) + 20)
    console.log(`%c[FireArrows] SPAWNING ${count} arrows — wave ${waveId}`, 'color: orange; font-weight: bold; font-size: 14px')

    const newArrows: ArrowData[] = []
    for (let i = 0; i < count; i++) {
      newArrows.push({
        id: i,
        x: (Math.random() - 0.5) * 40,
        y: 15 + Math.random() * 15,
        z: (Math.random() - 0.5) * 40,
        rotX: Math.PI + (Math.random() - 0.5) * 0.3,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.3,
        velocity: 0,
        landed: false,
      })
    }

    dataRef.current = newArrows
    setArrows(newArrows)
  }, [active, waveId, arrowCount])

  // Animate arrows falling — runs every frame (~60 FPS)
  useFrame((_, delta) => {
    const GRAVITY = 22
    const data = dataRef.current

    for (let i = 0; i < data.length; i++) {
      const arrow = data[i]
      const mesh = arrowRefs.current[i]
      if (!mesh || arrow.landed) continue

      arrow.velocity += GRAVITY * delta
      arrow.y -= arrow.velocity * delta
      mesh.position.y = arrow.y

      if (arrow.y <= 0.2) {
        arrow.y = 0.2
        mesh.position.y = 0.2
        arrow.landed = true
        onArrowLand?.(new THREE.Vector3(arrow.x, 0, arrow.z))
      }
    }
  })

  // Store mesh ref at index i
  const setRef = useCallback(
    (i: number) => (el: THREE.Mesh | null) => {
      arrowRefs.current[i] = el
    },
    []
  )

  return (
    <group>
      {arrows.map((arrow, i) => (
        <mesh
          key={`${waveId}-${arrow.id}`}
          ref={setRef(i)}
          position={[arrow.x, arrow.y, arrow.z]}
          rotation={[arrow.rotX, arrow.rotY, arrow.rotZ]}
          castShadow
        >
          <cylinderGeometry args={[0.06, 0.14, 2.2, 6]} />
          <meshStandardMaterial
            color="#CC2200"
            emissive="#FF6600"
            emissiveIntensity={2.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}
