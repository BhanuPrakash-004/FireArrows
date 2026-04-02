import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useEffect } from 'react'
import * as THREE from 'three'

export function EnvironmentMap() {
  const { scene } = useGLTF('/models/ancient_chinese_courtyard_park.glb')

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        child.receiveShadow = true
        child.castShadow = true
      }
    })
  }, [scene])

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} position={[0, -0.5, 0]} />
    </RigidBody>
  )
}

useGLTF.preload('/models/ancient_chinese_courtyard_park.glb')
