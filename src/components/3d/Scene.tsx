import React, { useState } from 'react'
import { OrbitControls, Text } from '@react-three/drei'
import { Lighting } from './Lighting'
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

  // Create a demo necklace if none is provided
  const demoNecklace: NecklaceType = {
    id: 'demo-necklace',
    name: 'Demo Gold Chain',
    base: {
      id: 'demo-base',
      name: 'Gold Chain Base',
      type: 'chain',
      modelPath: '/models/chain.gltf',
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
          position: [-1, -0.5, 0.8],
          rotation: { _x: 0, _y: 0, _z: 0, _order: 'XYZ' } as any,
          type: 'segment',
          maxCharmSize: 1,
          occupied: true,
        },
        {
          id: 'right',
          position: [1, -0.5, 0.8],
          rotation: { _x: 0, _y: 0, _z: 0, _order: 'XYZ' } as any,
          type: 'segment',
          maxCharmSize: 1,
          occupied: false,
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
          modelPath: '/models/heart.gltf',
          material: METALS.GOLD_18K,
          size: 1.5,
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
          id: 'pearl-bead',
          name: 'Pearl Bead',
          type: 'bead',
          modelPath: '/models/pearl.gltf',
          material: {
            type: 'pearl',
            name: 'Natural Pearl',
            color: '#f8f8ff',
            metallic: 0.1,
            roughness: 0.2,
          },
          size: 0.8,
          weight: 0.1,
          attachmentType: 'segment',
          metadata: {
            description: 'A lustrous natural pearl',
            rarity: 'rare',
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
      description: 'A demo necklace showcasing the charm system',
      category: 'demo',
      tags: ['gold', 'chain', 'pendant', 'pearl'],
      created: new Date(),
      modified: new Date(),
    },
  }

  const currentNecklace = selectedNecklace || demoNecklace
  const lighting = viewerState?.lighting || 'studio'
  const showAttachmentPoints = viewerState?.showAttachmentPoints || false

  const handleCharmHover = (charmId: string | null) => {
    setHoveredCharm(charmId)
    onCharmHover?.(charmId)
  }

  return (
    <>
      {/* Lighting System */}
      <Lighting preset={lighting} intensity={1} />

      {/* Main Necklace */}
      <Necklace
        necklace={currentNecklace}
        showAttachmentPoints={showAttachmentPoints}
        animateCharms={true}
        onCharmClick={onCharmClick}
        onCharmHover={handleCharmHover}
      />

      {/* Ground Plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Welcome Text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {currentNecklace.name}
      </Text>

      {/* Hovered Charm Info */}
      {hoveredCharm && (
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.3}
          color="#4ecdc4"
          anchorX="center"
          anchorY="middle"
        >
          {currentNecklace.charms.find(c => c.charm.id === hoveredCharm)?.charm.name || 'Unknown Charm'}
        </Text>
      )}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={10}
        minDistance={2}
        target={[0, 0, 0]}
      />
    </>
  )
} 