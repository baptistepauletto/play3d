import React, { useState } from 'react'
import { OrbitControls, Text, Environment } from '@react-three/drei'
import { Necklace } from './Necklace'
import { METALS } from '../../types'
import type { Necklace as NecklaceType, ViewerState } from '../../types'

export interface SceneProps {
  selectedNecklace?: NecklaceType
  viewerState?: ViewerState
  onCharmClick?: (charmId: string) => void
  onCharmHover?: (charmId: string | null) => void
}

export const Scene: React.FC<SceneProps> = ({
  selectedNecklace,
  viewerState,
  onCharmClick,
  onCharmHover,
}) => {
  const [hoveredCharm, setHoveredCharm] = useState<string | null>(null)

  // Create a simple demo necklace with enhanced materials
  const demoNecklace: NecklaceType = {
    id: 'demo-necklace',
    name: 'Brilliant Gold Necklace',
    base: {
      id: 'demo-base',
      name: 'Gold Chain Base',
      type: 'chain',
      modelPath: '/models/fallback/chain.gltf',
      material: METALS.GOLD_18K,
      length: 8,
      attachmentPoints: [
        {
          id: 'center',
          position: [0, -0.5, 1],
          rotation: { _x: 0, _y: 0, _z: 0, _order: 'XYZ' } as any,
          type: 'centerpiece',
          maxCharmSize: 2,
          occupied: true,
        },
        {
          id: 'left',
          position: [-1.2, -0.5, 0.8],
          rotation: { _x: 0, _y: 0, _z: 0, _order: 'XYZ' } as any,
          type: 'segment',
          maxCharmSize: 1,
          occupied: true,
        },
      ],
      physics: {
        segments: 32,
        stiffness: 0.8,
        damping: 0.9,
      },
    },
    charms: [
      {
        charm: {
          id: 'heart-pendant',
          name: 'Gold Heart Pendant',
          type: 'pendant',
          modelPath: '/models/fallback/heart.gltf',
          material: METALS.GOLD_18K,
          size: 1.2,
          weight: 0.3,
          attachmentType: 'centerpiece',
          metadata: {
            description: 'A beautiful gold heart pendant',
            rarity: 'common',
          },
        },
        attachmentPointId: 'center',
      },
      {
        charm: {
          id: 'silver-bead',
          name: 'Silver Accent Bead',
          type: 'bead',
          modelPath: '/models/fallback/pearl.gltf',
          material: METALS.SILVER_925,
          size: 0.5,
          weight: 0.1,
          attachmentType: 'segment',
          metadata: {
            description: 'A polished silver accent bead',
            rarity: 'common',
          },
        },
        attachmentPointId: 'left',
      },
    ],
    displaySettings: {
      defaultCameraPosition: [3, 3, 3],
      defaultCameraTarget: [0, 0, 0],
      lighting: 'studio',
      background: 'gradient',
    },
    metadata: {
      description: 'Brilliant necklace with reflective materials',
      category: 'demo',
      tags: ['gold', 'chain', 'pendant', 'silver'],
      created: new Date(),
      modified: new Date(),
    },
  }

  const currentNecklace = selectedNecklace || demoNecklace

  const handleCharmHover = (charmId: string | null) => {
    setHoveredCharm(charmId)
    onCharmHover?.(charmId)
  }

  return (
    <>
      {/* HDRI Environment for Reflections */}
      <Environment preset="studio" background={false} />

      {/* Bright Studio Lighting */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2.0} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#ffffff"
      />
      <directionalLight 
        position={[-8, 8, 4]} 
        intensity={1.5} 
        color="#f8f8ff"
      />
      <pointLight position={[-8, 6, -6]} intensity={1.5} color="#ffe4b5" />
      <pointLight position={[5, -5, 8]} intensity={1.2} color="#e6e6fa" />
      <pointLight position={[0, 8, 0]} intensity={1.0} color="#ffffff" />

      {/* Bright Ground Plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#444444" 
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Highly Reflective Test Cube */}
      <mesh position={[2, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#ff6b6b" 
          metalness={1.0}
          roughness={0.1}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Additional Test Sphere for reflection comparison */}
      <mesh position={[-2, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial 
          color="#4ecdc4" 
          metalness={1.0}
          roughness={0.0}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Main Necklace */}
      <Necklace
        necklace={currentNecklace}
        showAttachmentPoints={false}
        animateCharms={true}
        onCharmClick={onCharmClick}
        onCharmHover={handleCharmHover}
      />

      {/* Title */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {currentNecklace.name}
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 3.0, 0]}
        fontSize={0.25}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
      >
        HDRI Environment Reflections • Bright Studio Lighting
      </Text>

      {/* Hover info */}
      {hoveredCharm && (
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.35}
          color="#ff6b6b"
          anchorX="center"
          anchorY="middle"
        >
          ✨ {currentNecklace.charms.find(c => c.charm.id === hoveredCharm)?.charm.name}
        </Text>
      )}

      {/* Instructions */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.22}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Bright lighting with realistic reflections • Drag to rotate • Scroll to zoom
      </Text>

      {/* Enhanced Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={10}
        minDistance={2}
        target={[0, -0.5, 0]}
        enableDamping={true}
        dampingFactor={0.08}
        autoRotate={false}
      />
    </>
  )
} 