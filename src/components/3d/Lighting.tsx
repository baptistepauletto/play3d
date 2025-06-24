import React from 'react'

export interface LightingProps {
  preset?: 'studio' | 'natural' | 'dramatic' | 'soft' | 'jewelry-studio'
  intensity?: number
  enableShadows?: boolean
}

export const Lighting: React.FC<LightingProps> = ({ 
  preset = 'jewelry-studio', 
  intensity = 1,
  enableShadows = true
}) => {
  
  const getJewelryStudioLighting = () => (
    <>
      {/* Main Key Light - Primary jewelry illumination */}
      <directionalLight 
        position={[8, 12, 6]} 
        intensity={intensity * 1.4} 
        castShadow={enableShadows}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      
      {/* Secondary Key Light - Fill light from opposite side */}
      <directionalLight 
        position={[-6, 8, 4]} 
        intensity={intensity * 0.8} 
        castShadow={enableShadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#f8f8ff"
      />
      
      {/* Rim Light - Jewelry edge highlighting */}
      <pointLight 
        position={[-8, 6, -8]} 
        intensity={intensity * 1.2} 
        color="#ffe4b5"
        distance={15}
        decay={2}
      />
      
      {/* Detail Light - Gemstone highlighting */}
      <spotLight
        position={[4, 10, 8]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={intensity * 1.0}
        castShadow={enableShadows}
        shadow-mapSize={[1024, 1024]}
        color="#ffffff"
        distance={20}
        decay={2}
      />
      
      {/* Accent Light - Metal surface enhancement */}
      <pointLight 
        position={[6, -2, 6]} 
        intensity={intensity * 0.6} 
        color="#fff8dc"
        distance={12}
        decay={2}
      />
      
      {/* Bounce Light - Simulates reflected light from surfaces */}
      <pointLight 
        position={[0, -6, 0]} 
        intensity={intensity * 0.4} 
        color="#f0f8ff"
        distance={10}
        decay={2}
      />
      
      {/* Ambient Light - Soft overall illumination */}
      <ambientLight intensity={intensity * 0.3} color="#f5f5f5" />
    </>
  )

  const getStudioLighting = () => (
    <>
      {/* Key Light - Main illumination */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={intensity * 1.2} 
        castShadow={enableShadows}
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
      
      {/* Rim Light - Edge highlighting */}
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
        castShadow={enableShadows}
        shadow-mapSize={[1024, 1024]}
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
        intensity={intensity * 1.8} 
        castShadow={enableShadows}
        shadow-mapSize={[2048, 2048]}
        color="#ffffff"
      />
      
      {/* Minimal ambient lighting */}
      <ambientLight intensity={intensity * 0.15} color="#191970" />
      
      {/* Dramatic accent light */}
      <spotLight
        position={[-10, 8, -2]}
        angle={0.3}
        penumbra={0.5}
        intensity={intensity * 1.2}
        castShadow={enableShadows}
        color="#ffd700"
      />
      
      {/* Rim light for dramatic silhouette */}
      <pointLight
        position={[0, 0, -10]}
        intensity={intensity * 0.8}
        color="#4169e1"
      />
    </>
  )

  const getSoftLighting = () => (
    <>
      {/* Gentle directional light */}
      <directionalLight 
        position={[4, 6, 3]} 
        intensity={intensity * 0.7} 
        castShadow={enableShadows}
        shadow-mapSize={[1024, 1024]}
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
        return getStudioLighting()
      case 'jewelry-studio':
      default:
        return getJewelryStudioLighting()
    }
  }

  return <>{renderLighting()}</>
} 