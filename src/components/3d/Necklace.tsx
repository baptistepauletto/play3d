import React, { useMemo, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Charm } from './Charm'
import { createFallbackNecklace } from '../../utils/modelFallbacks'
import type { Necklace as NecklaceType } from '../../types'

export interface NecklaceProps {
  necklace: NecklaceType
  showAttachmentPoints?: boolean
  animateCharms?: boolean
  onCharmClick?: (charmId: string) => void
  onCharmHover?: (charmId: string | null) => void
}

// Fallback necklace component
const NecklaceFallback: React.FC<{ 
  base: NecklaceType['base'] 
  material: React.ReactElement 
}> = ({ base, material }) => {
  const fallbackGeometry = useMemo(() => {
    return createFallbackNecklace(base.type, base.length)
  }, [base.type, base.length])

  return (
    <primitive object={fallbackGeometry}>
      {/* Apply material to all meshes in the fallback geometry */}
      {fallbackGeometry.children.map((child, index) => {
        if (child instanceof THREE.Mesh) {
          return (
            <mesh key={index} geometry={child.geometry} position={child.position} rotation={child.rotation}>
              {material}
            </mesh>
          )
        } else if (child instanceof THREE.Line) {
          return (
            <primitive key={index} object={child} />
          )
        }
        return null
      })}
    </primitive>
  )
}

// GLTF Necklace Model component
const NecklaceModel: React.FC<{ 
  modelPath: string
  material: React.ReactElement
  base: NecklaceType['base']
}> = ({ modelPath, material, base }) => {
  try {
    const { scene } = useGLTF(modelPath)
    
    // Clone the scene to avoid modifying the original
    const clonedScene = useMemo(() => scene.clone(), [scene])
    
    // Scale the model based on necklace length
    const scale = base.length / 8 // Normalize to our standard length
    clonedScene.scale.setScalar(scale)
    
    // Apply materials to all meshes in the loaded model
    useMemo(() => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData.originalMaterial = child.material
          // Apply our jewelry material
          child.material = new THREE.MeshStandardMaterial({
            color: base.material.color,
            metalness: base.material.metallic || 1,
            roughness: base.material.roughness || 0.1,
          })
        }
      })
    }, [clonedScene, base.material])

    return <primitive object={clonedScene} />
  } catch (error) {
    console.warn(`Failed to load necklace model ${modelPath}, using fallback`, error)
    return <NecklaceFallback base={base} material={material} />
  }
}

export const Necklace: React.FC<NecklaceProps> = ({
  necklace,
  showAttachmentPoints = false,
  animateCharms = true,
  onCharmClick,
  onCharmHover,
}) => {
  
  // Create base material
  const baseMaterial = useMemo(() => {
    const material = necklace.base.material
    return (
      <meshStandardMaterial
        color={material.color}
        metalness={material.metallic || 1}
        roughness={material.roughness || 0.1}
      />
    )
  }, [necklace.base.material])

  // Calculate attachment point positions along the necklace
  const calculateAttachmentPositions = useMemo(() => {
    const radius = necklace.base.length / (2 * Math.PI)
    
    return necklace.base.attachmentPoints.map((point, index) => {
      // Distribute attachment points evenly around the necklace
      const angle = (index / necklace.base.attachmentPoints.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = -0.5 // Base height
      
      return {
        ...point,
        calculatedPosition: [x, y, z] as THREE.Vector3Tuple,
        calculatedRotation: new THREE.Euler(0, angle, 0)
      }
    })
  }, [necklace.base.attachmentPoints, necklace.base.length])

  // Render attachment point indicators
  const renderAttachmentPoints = () => {
    if (!showAttachmentPoints) return null

    return calculateAttachmentPositions.map((point) => (
      <mesh key={point.id} position={point.calculatedPosition}>
        <sphereGeometry args={[0.02]} />
        <meshBasicMaterial 
          color={point.occupied ? "#ff4444" : "#44ff44"} 
          transparent 
          opacity={0.7} 
        />
      </mesh>
    ))
  }

  // Render all charms attached to the necklace
  const renderCharms = () => {
    return necklace.charms.map((charmData, index) => {
      const attachmentPoint = calculateAttachmentPositions.find(
        point => point.id === charmData.attachmentPointId
      )

      if (!attachmentPoint) return null

      const position = charmData.customPosition || attachmentPoint.calculatedPosition
      const rotation = charmData.customRotation || attachmentPoint.calculatedRotation

      return (
        <Charm
          key={`${charmData.charm.id}-${index}`}
          charm={charmData.charm}
          position={position}
          rotation={rotation}
          animate={animateCharms}
          onClick={(charm) => onCharmClick?.(charm.id)}
          onHover={(charm) => onCharmHover?.(charm?.id || null)}
        />
      )
    })
  }

  return (
    <group>
      {/* Necklace Base */}
      <Suspense fallback={<NecklaceFallback base={necklace.base} material={baseMaterial} />}>
        <NecklaceModel 
          modelPath={necklace.base.modelPath} 
          material={baseMaterial} 
          base={necklace.base}
        />
      </Suspense>
      
      {/* Attachment Point Indicators */}
      {renderAttachmentPoints()}
      
      {/* Charms */}
      {renderCharms()}
    </group>
  )
} 