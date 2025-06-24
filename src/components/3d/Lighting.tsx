import React from 'react'

export interface LightingProps {
  preset?: 'studio' | 'natural' | 'dramatic' | 'soft'
  intensity?: number
}

export const Lighting: React.FC<LightingProps> = ({ 
  preset = 'studio', 
  intensity = 1 
}) => {
  const getStudioLighting = () => (
    <>
      {/* Key Light - Main illumination */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={intensity * 1.2} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />
      
      {/* Fill Light - Soft ambient lighting */}
      <ambientLight intensity={intensity * 0.4} color="#f0f8ff" />
      
      {/* Rim Light - Jewelry edge highlighting */}
      <pointLight 
        position={[-8, 6, -6]} 
        intensity={intensity * 0.8} 
        color="#ffe4b5"
      />
      
      {/* Accent Light - Detail enhancement */}
      <pointLight 
        position={[5, -5, 8]} 
        intensity={intensity * 0.6} 
        color="#e6e6fa"
      />
    </>
  )

  const getNaturalLighting = () => (
    <>
      {/* Soft directional light mimicking window light */}
      <directionalLight 
        position={[5, 8, 3]} 
        intensity={intensity * 0.9} 
        castShadow
        color="#fff8dc"
      />
      
      {/* Ambient daylight */}
      <ambientLight intensity={intensity * 0.6} color="#87ceeb" />
      
      {/* Reflected light from surfaces */}
      <pointLight 
        position={[-3, 2, -4]} 
        intensity={intensity * 0.4} 
        color="#faebd7"
      />
    </>
  )

  const getDramaticLighting = () => (
    <>
      {/* Strong key light for contrast */}
      <directionalLight 
        position={[8, 12, 4]} 
        intensity={intensity * 1.5} 
        castShadow
        color="#ffffff"
      />
      
      {/* Minimal ambient lighting */}
      <ambientLight intensity={intensity * 0.2} color="#191970" />
      
      {/* Dramatic accent light */}
      <spotLight
        position={[-10, 8, -2]}
        angle={0.3}
        penumbra={0.5}
        intensity={intensity * 1.0}
        castShadow
        color="#ffd700"
      />
    </>
  )

  const getSoftLighting = () => (
    <>
      {/* Gentle directional light */}
      <directionalLight 
        position={[4, 6, 3]} 
        intensity={intensity * 0.7} 
        castShadow
        color="#fff5ee"
      />
      
      {/* Soft ambient lighting */}
      <ambientLight intensity={intensity * 0.8} color="#f5f5dc" />
      
      {/* Multiple soft fill lights */}
      <pointLight 
        position={[-4, 4, -3]} 
        intensity={intensity * 0.3} 
        color="#ffe4e1"
      />
      <pointLight 
        position={[4, -2, 4]} 
        intensity={intensity * 0.3} 
        color="#f0fff0"
      />
    </>
  )

  const renderLighting = () => {
    switch (preset) {
      case 'natural':
        return getNaturalLighting()
      case 'dramatic':
        return getDramaticLighting()
      case 'soft':
        return getSoftLighting()
      case 'studio':
      default:
        return getStudioLighting()
    }
  }

  return <>{renderLighting()}</>
} 