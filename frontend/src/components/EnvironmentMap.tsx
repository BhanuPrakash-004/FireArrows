import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

export function EnvironmentMap() {
  const { scene } = useGLTF('/models/ancient_chinese_courtyard_park.glb')
  
  // You might want to traverse the scene to enable receiveShadow/castShadow
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.receiveShadow = true
      child.castShadow = true
    }
  })

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} position={[0, -0.5, 0]} scale={[1, 1, 1]} />
    </RigidBody>
  )
}

useGLTF.preload('/models/ancient_chinese_courtyard_park.glb')
