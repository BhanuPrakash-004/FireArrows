import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { RigidBody, RapierRigidBody } from '@react-three/rapier'

interface PlayerProps {
  position?: [number, number, number]
  onSafeStatusChange?: (isSafe: boolean) => void
  /** Called once when this player is struck by an arrow */
  onEliminated?: () => void
  /** Mouse sensitivity multiplier (1.0 = default, higher = faster) */
  sensitivity?: number
  /** Shared ref — Player writes its position here each frame for arrow proximity checks */
  playerPositionRef?: MutableRefObject<{ x: number; y: number; z: number }>
}

export function Player({ position = [0, 0, 0], onSafeStatusChange, onEliminated, sensitivity = 1.0, playerPositionRef }: PlayerProps) {
  const group = useRef<THREE.Group>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const { scene, animations } = useGLTF('/models/Running.glb')
  const { actions, names } = useAnimations(animations, group)

  const keys = useRef<{ [key: string]: boolean }>({})
  const cameraAngle = useRef({ theta: Math.PI, phi: 0.45 })

  // Guard: once eliminated we stop movement and don't fire the callback again
  const isEliminatedRef = useRef(false)
  // Ref so the mousemove handler always sees the latest sensitivity without re-registering
  const sensitivityRef = useRef(sensitivity)

  const CAMERA_DISTANCE = 9
  const SPEED = 4

  // ── FIX: Strip root-motion position tracks so animation plays in-place ───
  useEffect(() => {
    animations.forEach((clip) => {
      clip.tracks = clip.tracks.filter((track) => !track.name.endsWith('.position'))
    })
  }, [animations])

  // ── Keyboard input ───────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true }
    const up   = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }
    document.addEventListener('keydown', down)
    document.addEventListener('keyup',   up)
    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('keyup',   up)
    }
  }, [])

  // Keep sensitivityRef in sync with the prop every render (cheap, no effect needed)
  sensitivityRef.current = sensitivity

  // ── Right-click + Mouse → orbit camera ───────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Only orbit when right mouse button is held (buttons bitmask: 2 = right)
      if (!(e.buttons)) return
      cameraAngle.current.theta -= e.movementX * 0.001 * sensitivityRef.current
      cameraAngle.current.phi = Math.max(
        0.15,
        Math.min(1.25, cameraAngle.current.phi + e.movementY * 0.0015 * sensitivityRef.current)
      )
    }
    // Prevent the right-click context menu from appearing
    const preventContext = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('contextmenu', preventContext)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('contextmenu', preventContext)
    }
  }, [])

  // ── Shadow setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // ── Per-frame logic ──────────────────────────────────────────────────────
  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !group.current) return

    // Eliminated players freeze in place
    if (isEliminatedRef.current) return

    const w = keys.current['w']
    const s = keys.current['s']
    const a = keys.current['a']
    const d = keys.current['d']
    const isMoving = w || s || a || d

    const t = rigidBodyRef.current.translation()
    const pos = new THREE.Vector3(t.x, t.y, t.z)
    const animName = names[0] ?? null

    // Write position for arrow-landing proximity check
    if (playerPositionRef) {
      playerPositionRef.current = { x: pos.x, y: pos.y, z: pos.z }
    }

    // Camera orbit angles
    const theta = cameraAngle.current.theta
    const phi   = cameraAngle.current.phi

    // Movement vectors relative to camera yaw
    const forward = new THREE.Vector3(-Math.sin(theta), 0, -Math.cos(theta)).normalize()
    const right   = new THREE.Vector3( Math.cos(theta), 0, -Math.sin(theta)).normalize()

    const direction = new THREE.Vector3()
    if (w) direction.add(forward)
    if (s) direction.sub(forward)
    if (a) direction.sub(right)
    if (d) direction.add(right)

    if (isMoving && direction.lengthSq() > 0) {
      direction.normalize()
      pos.addScaledVector(direction, SPEED * delta)
      rigidBodyRef.current.setNextKinematicTranslation(pos)

      // Character faces movement direction (not cursor)
      const angle = Math.atan2(direction.x, direction.z)
      const targetQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      group.current.quaternion.slerp(targetQ, 12 * delta)

      // Resume / play running animation
      if (animName && actions[animName]) {
        const action = actions[animName]
        if (!action.isRunning() || action.paused) {
          action.paused = false
          action.play()
        }
      }
    } else {
      if (animName && actions[animName]) {
        actions[animName].paused = true
      }
    }

    // ── Upward raycast — safe / danger ───────────────────────────────────
    const ray = new THREE.Raycaster(pos.clone(), new THREE.Vector3(0, 1, 0))
    const hits = ray
      .intersectObjects(state.scene.children, true)
      .filter(
        (h) =>
          h.object.uuid !== group.current?.uuid &&
          !group.current?.children.some((c) => c.uuid === h.object.uuid)
      )
    const isSafe = hits.length > 0 && hits[0].distance < 100
    onSafeStatusChange?.(isSafe)

    // ── Orbit camera around player ───────────────────────────────────────
    const camX = pos.x + CAMERA_DISTANCE * Math.sin(theta) * Math.cos(phi)
    const camY = pos.y + CAMERA_DISTANCE * Math.sin(phi) + 1.5
    const camZ = pos.z + CAMERA_DISTANCE * Math.cos(theta) * Math.cos(phi)

    state.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.08)
    state.camera.lookAt(pos.x, pos.y + 1, pos.z)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="hull"
      type="kinematicPosition"
    >
      <group ref={group} dispose={null}>
        <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
      </group>
    </RigidBody>
  )
}

useGLTF.preload('/models/Running.glb')
