import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { createFallbackCharm } from '../../utils/modelFallbacks'
import type { Charm as CharmType } from '../../types'

export interface CharmProps {
  charm: CharmType
  position: THREE.Vector3Tuple
  rotation?: THREE.Euler
  scale?: number
  animate?: boolean
  onClick?: (charm: CharmType) => void
  onHover?: (charm: CharmType | null) => void
}

// Loading fallback component
const CharmFallback: React.FC<{ charm: CharmType; materialElement: React.ReactElement }> = ({ charm, materialElement }) => {
  const fallbackGeometry = useMemo(() => {
    return createFallbackCharm(charm.type)
  }, [charm.type])

  return (
    <primitive object={fallbackGeometry}>
      {/* Apply material to all meshes in the fallback geometry */}
      {fallbackGeometry.children.map((child, index) => {
        if (child instanceof THREE.Mesh) {
          return (
            <mesh key={index} geometry={child.geometry} position={child.position} rotation={child.rotation}>
              {materialElement}
            </mesh>
          )
        }
        return null
      })}
    </primitive>
  )
}

// GLTF Model component
const CharmModel: React.FC<{ modelPath: string; materialElement: React.ReactElement; charm: CharmType }> = ({ 
  modelPath, 
  materialElement, 
  charm 
}) => {
  try {
    const { scene } = useGLTF(modelPath)
    
    // Clone the scene to avoid modifying the original
    const clonedScene = useMemo(() => scene.clone(), [scene])
    
    // Apply materials to all meshes in the loaded model
    useMemo(() => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Store original material for potential restoration
          child.userData.originalMaterial = child.material
        }
      })
    }, [clonedScene])

    return <primitive object={clonedScene} />
  } catch (error) {
    console.warn(`Failed to load model ${modelPath}, using fallback`, error)
    return <CharmFallback charm={charm} materialElement={materialElement} />
  }
}

export const Charm: React.FC<CharmProps> = ({
  charm,
  position,
  rotation = new THREE.Euler(0, 0, 0),
  scale = 1,
  animate = false,
  onClick,
  onHover,
}) => {
  const meshRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  // Enhanced material is available via JewelryMaterials.createMaterial(charm.material) if needed for Three.js objects

  // Create JSX element for the material (for fallback geometry)
  const materialElement = useMemo(() => {
    const mat = charm.material
    
    switch (mat.type) {
      case 'metal':
        return (
          <meshStandardMaterial
            color={mat.color}
            metalness={mat.metallic || 1}
            roughness={mat.roughness || 0.1}
            envMapIntensity={1.5}
          />
        )
      case 'gemstone':
        return (
          <meshPhysicalMaterial
            color={mat.color}
            metalness={0}
            roughness={mat.roughness || 0.02}
            transmission={mat.transparency || 0.95}
            ior={mat.refraction || 1.5}
            thickness={0.8}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            envMapIntensity={2.0}
          />
        )
      case 'pearl':
        return (
          <meshStandardMaterial
            color={mat.color}
            metalness={0.1}
            roughness={0.2}
            envMapIntensity={1.8}
            transparent={true}
            opacity={0.95}
          />
        )
      default:
        return (
          <meshStandardMaterial
            color={mat.color}
            metalness={mat.metallic || 0}
            roughness={mat.roughness || 0.5}
          />
        )
    }
  }, [charm.material])

  // Animation frame update
  useFrame((_state, delta) => {
    if (!meshRef.current || !animate) return
    
    time.current += delta
    
    // Gentle swaying motion for charms
    const swayAmount = 0.02 * charm.weight // Heavier charms sway less
    meshRef.current.rotation.z = Math.sin(time.current * 2) * swayAmount
    
    // Small bounce effect
    const bounceAmount = 0.01
    meshRef.current.position.y = position[1] + Math.sin(time.current * 3) * bounceAmount
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onClick?.(charm)
  }

  const handlePointerEnter = () => {
    onHover?.(charm)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    onHover?.(null)
    document.body.style.cursor = 'default'
  }



  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
              <Suspense fallback={<CharmFallback charm={charm} materialElement={materialElement} />}>
          <CharmModel modelPath={charm.modelPath} materialElement={materialElement} charm={charm} />
        </Suspense>
      
      {/* Add a subtle glow effect for rare charms */}
      {charm.metadata?.rarity === 'legendary' && (
        <pointLight
          position={[0, 0, 0]}
          intensity={0.2}
          color={charm.material.color}
          distance={2}
          decay={2}
        />
      )}
    </group>
  )
} 