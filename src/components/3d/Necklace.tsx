import React, { useMemo } from 'react'
import { Torus } from '@react-three/drei'
import * as THREE from 'three'
import { Charm } from './Charm'
import type { Necklace as NecklaceType } from '../../types'

export interface NecklaceProps {
  necklace: NecklaceType
  showAttachmentPoints?: boolean
  animateCharms?: boolean
  onCharmClick?: (charmId: string) => void
  onCharmHover?: (charmId: string | null) => void
}

export const Necklace: React.FC<NecklaceProps> = ({
  necklace,
  showAttachmentPoints = false,
  animateCharms = true,
  onCharmClick,
  onCharmHover,
}) => {
  
  // Generate necklace chain geometry based on type
  const renderNecklaceBase = () => {
    const { base } = necklace
    const material = base.material

    // Create base material
    const baseMaterial = (
      <meshStandardMaterial
        color={material.color}
        metalness={material.metallic || 1}
        roughness={material.roughness || 0.1}
      />
    )

    switch (base.type) {
      case 'chain':
        return renderChainNecklace(baseMaterial)
      case 'cord':
        return renderCordNecklace(baseMaterial)
      case 'beaded':
        return renderBeadedNecklace(baseMaterial)
      case 'wire':
        return renderWireNecklace(baseMaterial)
      default:
        return renderChainNecklace(baseMaterial)
    }
  }

  // Chain necklace - series of connected links
  const renderChainNecklace = (material: React.ReactElement) => {
    const numLinks = Math.floor(necklace.base.length * 10) // 10 links per unit
    const radius = necklace.base.length / (2 * Math.PI) // Calculate radius for circular shape
    
    return (
      <group>
        {Array.from({ length: numLinks }, (_, i) => {
          const angle = (i / numLinks) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = -0.5 // Slight droop
          
          return (
            <Torus
              key={i}
              args={[0.05, 0.02, 4, 8]}
              position={[x, y, z]}
              rotation={[0, angle, Math.PI / 2]}
            >
              {material}
            </Torus>
          )
        })}
      </group>
    )
  }

  // Cord necklace - smooth circular cord
  const renderCordNecklace = (material: React.ReactElement) => {
    const radius = necklace.base.length / (2 * Math.PI)
    
    return (
      <mesh>
        <torusGeometry args={[radius, 0.03, 8, 32]} />
        {material}
      </mesh>
    )
  }

  // Beaded necklace - series of beads
  const renderBeadedNecklace = (material: React.ReactElement) => {
    const numBeads = Math.floor(necklace.base.length * 8)
    const radius = necklace.base.length / (2 * Math.PI)
    
    return (
      <group>
        {Array.from({ length: numBeads }, (_, i) => {
          const angle = (i / numBeads) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = -0.5
          
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              {material}
            </mesh>
          )
        })}
      </group>
    )
  }

  // Wire necklace - thin wire
  const renderWireNecklace = (material: React.ReactElement) => {
    const radius = necklace.base.length / (2 * Math.PI)
    
    return (
      <mesh>
        <torusGeometry args={[radius, 0.01, 4, 16]} />
        {material}
      </mesh>
    )
  }

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
      {renderNecklaceBase()}
      
      {/* Attachment Point Indicators */}
      {renderAttachmentPoints()}
      
      {/* Charms */}
      {renderCharms()}
    </group>
  )
} 