import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ArrowData } from '../types/game'

const GRAVITY = 28
const SPAWN_HEIGHT_MIN = 25
const SPAWN_HEIGHT_MAX = 40

interface FireArrowsProps {
  active: boolean
  arrowCount: number
  arrowDuration: number
  waveId: number
  playerPosition: THREE.Vector3
  paused?: boolean
  onArrowLand?: (position: THREE.Vector3) => void
}

export function FireArrows({ active, arrowCount, arrowDuration, waveId, playerPosition, paused = false, onArrowLand }: FireArrowsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const arrowsRef = useRef<ArrowData[]>([])
  const meshesRef = useRef<THREE.Group[]>([])
  const spawnedWave = useRef(-1)
  const spawnedCount = useRef(0)
  const timeSinceLastBatch = useRef(0)
  const targetPosition = useRef({ x: 0, z: 0 })
  const arrowsPerSecond = useRef(10)
  
  // Shared geometry and materials (created once)
  const materialsRef = useRef<{
    shaft: THREE.MeshStandardMaterial
    head: THREE.MeshStandardMaterial
    fin: THREE.MeshStandardMaterial
    fire: THREE.MeshBasicMaterial
    shaftGeo: THREE.CylinderGeometry
    headGeo: THREE.ConeGeometry
    finGeo: THREE.BoxGeometry
    fireGeo: THREE.SphereGeometry
  } | null>(null)

  // Initialize shared materials
  useEffect(() => {
    if (!materialsRef.current) {
      materialsRef.current = {
        shaftGeo: new THREE.CylinderGeometry(0.03, 0.03, 2, 6),
        headGeo: new THREE.ConeGeometry(0.08, 0.3, 4),
        finGeo: new THREE.BoxGeometry(0.12, 0.25, 0.01),
        fireGeo: new THREE.SphereGeometry(0.1, 6, 6),
        shaft: new THREE.MeshStandardMaterial({ color: 0x4a3728 }),
        head: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.3 }),
        fin: new THREE.MeshStandardMaterial({ color: 0xcc3333, emissive: 0xff2200, emissiveIntensity: 0.4 }),
        fire: new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.7 }),
      }
    }
  }, [])

  // Reset when wave changes
  useEffect(() => {
    if (!active || !groupRef.current) {
      // Clear everything
      if (groupRef.current) {
        while (groupRef.current.children.length > 0) {
          groupRef.current.remove(groupRef.current.children[0])
        }
      }
      arrowsRef.current = []
      meshesRef.current = []
      spawnedWave.current = -1
      spawnedCount.current = 0
      timeSinceLastBatch.current = 0
      return
    }

    if (spawnedWave.current === waveId) return
    
    // New wave - clear old arrows and reset
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0])
    }
    arrowsRef.current = []
    meshesRef.current = []
    spawnedWave.current = waveId
    spawnedCount.current = 0
    timeSinceLastBatch.current = 1 // Spawn first batch immediately
    // Calculate arrows per second based on total arrows and duration
    arrowsPerSecond.current = Math.ceil(arrowCount / arrowDuration)
    targetPosition.current = { x: playerPosition.x, z: playerPosition.z }
  }, [active, waveId, playerPosition, arrowCount, arrowDuration])

  // Create a single arrow mesh
  const createArrowMesh = (arrow: ArrowData) => {
    if (!materialsRef.current || !groupRef.current) return null
    
    const { shaftGeo, headGeo, finGeo, fireGeo, shaft, head, fin, fire } = materialsRef.current
    const arrowGroup = new THREE.Group()
    
    // Shaft
    const shaftMesh = new THREE.Mesh(shaftGeo, shaft)
    arrowGroup.add(shaftMesh)
    
    // Head
    const headMesh = new THREE.Mesh(headGeo, head)
    headMesh.position.y = -1.1
    arrowGroup.add(headMesh)
    
    // Fletching (3 fins)
    for (let j = 0; j < 3; j++) {
      const finMesh = new THREE.Mesh(finGeo, fin)
      finMesh.position.y = 0.8
      finMesh.rotation.y = (j * 120 * Math.PI) / 180
      arrowGroup.add(finMesh)
    }
    
    // Fire glow
    const fireMesh = new THREE.Mesh(fireGeo, fire)
    fireMesh.position.y = -0.9
    arrowGroup.add(fireMesh)
    
    arrowGroup.position.set(arrow.x, arrow.y, arrow.z)
    arrowGroup.rotation.set(arrow.rotX, arrow.rotY, arrow.rotZ)
    
    groupRef.current.add(arrowGroup)
    return arrowGroup
  }

  // Spawn a batch of arrows (called every second)
  const spawnBatch = () => {
    if (!groupRef.current || !materialsRef.current) return
    
    const remaining = arrowCount - spawnedCount.current
    if (remaining <= 0) return
    
    const batchSize = Math.min(arrowsPerSecond.current, remaining)
    const px = targetPosition.current.x
    const pz = targetPosition.current.z
    
    for (let i = 0; i < batchSize; i++) {
      const arrowIndex = spawnedCount.current + i
      
      // Determine spawn position based on distribution
      let x: number, z: number
      const rand = Math.random()
      
      if (rand < 0.5) {
        // 50% target player area (within 6 units)
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * 6
        x = px + Math.cos(angle) * dist
        z = pz + Math.sin(angle) * dist
      } else if (rand < 0.8) {
        // 30% medium ring (6-15 units)
        const angle = Math.random() * Math.PI * 2
        const dist = 6 + Math.random() * 9
        x = px + Math.cos(angle) * dist
        z = pz + Math.sin(angle) * dist
      } else {
        // 20% random across map
        x = (Math.random() - 0.5) * 40
        z = (Math.random() - 0.5) * 40
      }
      
      const arrow: ArrowData = {
        id: arrowIndex,
        x,
        y: SPAWN_HEIGHT_MIN + Math.random() * (SPAWN_HEIGHT_MAX - SPAWN_HEIGHT_MIN),
        z,
        rotX: Math.PI + (Math.random() - 0.5) * 0.2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.2,
        velocity: 0,
        landed: false,
      }
      
      const mesh = createArrowMesh(arrow)
      if (mesh) {
        arrowsRef.current.push(arrow)
        meshesRef.current.push(mesh)
      }
    }
    
    spawnedCount.current += batchSize
  }

  // Animate arrows falling + spawn batches every second
  useFrame((_, delta) => {
    if (paused || !groupRef.current) return
    
    // Spawn new batches every second
    if (spawnedCount.current < arrowCount) {
      timeSinceLastBatch.current += delta
      if (timeSinceLastBatch.current >= 1.0) {
        spawnBatch()
        timeSinceLastBatch.current = 0
      }
    }
    
    // Animate existing arrows
    const arrows = arrowsRef.current
    const meshes = meshesRef.current

    for (let i = 0; i < arrows.length; i++) {
      const arrow = arrows[i]
      if (arrow.landed) continue

      // Apply gravity
      arrow.velocity += GRAVITY * delta
      arrow.y -= arrow.velocity * delta

      // Update mesh position
      if (meshes[i]) {
        meshes[i].position.y = arrow.y
      }

      // Check if landed
      if (arrow.y <= 0.2) {
        arrow.y = 0.2
        arrow.landed = true
        if (meshes[i]) {
          meshes[i].position.y = 0.2
          // Tilt arrow to look stuck in ground
          meshes[i].rotation.x = Math.PI * 0.85 + (Math.random() - 0.5) * 0.3
        }
        onArrowLand?.(new THREE.Vector3(arrow.x, 0, arrow.z))
      }
    }
  })

  return <group ref={groupRef} />
}
