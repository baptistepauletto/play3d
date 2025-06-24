import React, { useRef, useMemo } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Box, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
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

  // Create material based on charm material definition
  const material = useMemo(() => {
    const mat = charm.material
    
    switch (mat.type) {
      case 'metal':
        return (
          <meshStandardMaterial
            color={mat.color}
            metalness={mat.metallic || 1}
            roughness={mat.roughness || 0.1}
          />
        )
      case 'gemstone':
        return (
          <meshPhysicalMaterial
            color={mat.color}
            metalness={0}
            roughness={mat.roughness || 0.05}
            transmission={mat.transparency || 0.9}
            ior={mat.refraction || 1.5}
            thickness={0.5}
          />
        )
      case 'pearl':
        return (
          <meshStandardMaterial
            color={mat.color}
            metalness={0.1}
            roughness={0.2}
            // Add subsurface scattering effect for pearls
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

  // Render appropriate geometry based on charm type
  const renderGeometry = () => {
    const size = charm.size * scale

    switch (charm.type) {
      case 'pendant':
        // Complex pendant shape - for now using a combination of shapes
        return (
          <group>
            {/* Main pendant body */}
            <Box args={[size * 0.8, size * 1.2, size * 0.3]} position={[0, -size * 0.4, 0]}>
              {material}
            </Box>
            {/* Attachment ring */}
            <Cylinder 
              args={[size * 0.15, size * 0.15, size * 0.1, 8]} 
              position={[0, size * 0.4, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              {material}
            </Cylinder>
          </group>
        )
      
      case 'bead':
        return (
          <Sphere args={[size * 0.5]}>
            {material}
          </Sphere>
        )
      
      case 'gemstone':
        // Octahedral gemstone shape
        return (
          <group>
            <Box args={[size * 0.6, size * 0.6, size * 0.6]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
              {material}
            </Box>
          </group>
        )
      
      case 'ornament':
        // Decorative ornament - using torus for now
        return (
          <group>
            <mesh>
              <torusGeometry args={[size * 0.4, size * 0.2, 8, 16]} />
              {material}
            </mesh>
          </group>
        )
      
      default:
        return (
          <Box args={[size, size, size]}>
            {material}
          </Box>
        )
    }
  }

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
      {renderGeometry()}
      
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