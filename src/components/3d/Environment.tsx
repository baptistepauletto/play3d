import React from 'react'
import { Environment, ContactShadows, AccumulativeShadows, RandomizedLight } from '@react-three/drei'

export interface EnvironmentProps {
  preset?: 'studio' | 'natural' | 'dramatic' | 'soft' | 'jewelry-studio'
  background?: boolean
  blur?: number
  intensity?: number
}

export const JewelryEnvironment: React.FC<EnvironmentProps> = ({
  preset = 'jewelry-studio',
  background = true,
  blur = 0.3,
  intensity: _intensity = 1, // Intensity handled per environment type
}) => {
  
  const renderStudioEnvironment = () => (
    <>
      {/* Professional jewelry studio HDRI environment */}
      <Environment
        background={background}
        blur={blur}
        resolution={512}
        preset="studio"
      />
      
      {/* High-quality contact shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.6}
        scale={20}
        blur={2}
        far={3}
        resolution={256}
        color="#000000"
      />
      
      {/* Accumulative shadows for realism */}
      <AccumulativeShadows
        position={[0, -2.99, 0]}
        frames={100}
        alphaTest={0.9}
        color="#316d39"
        colorBlend={0.5}
        opacity={0.8}
        scale={20}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          ambient={0.5}
          intensity={1}
          position={[5, 5, -10]}
          bias={0.001}
        />
      </AccumulativeShadows>
    </>
  )

  const renderJewelryStudioEnvironment = () => (
    <>
      {/* Custom jewelry studio setup with optimal lighting */}
      <Environment
        background={background}
        blur={blur}
        resolution={1024}
      >
        {/* Custom HDRI-like lighting setup using lights */}
        <group rotation={[0, 0, 0]}>
          {/* Key light ring - simulates studio lighting setup */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.cos(angle) * 10
            const z = Math.sin(angle) * 10
            return (
              <rectAreaLight
                key={i}
                position={[x, 8, z]}
                rotation={[Math.PI / 2, 0, angle + Math.PI]}
                width={4}
                height={2}
                intensity={2}
                color="#ffffff"
              />
            )
          })}
          
          {/* Top fill light */}
          <rectAreaLight
            position={[0, 12, 0]}
            rotation={[Math.PI, 0, 0]}
            width={8}
            height={8}
            intensity={1.5}
            color="#f8f8ff"
          />
          
          {/* Bottom bounce light */}
          <rectAreaLight
            position={[0, -8, 0]}
            rotation={[0, 0, 0]}
            width={12}
            height={12}
            intensity={0.8}
            color="#ffe4e1"
          />
        </group>
      </Environment>

      {/* Professional jewelry shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.4}
        scale={25}
        blur={3}
        far={4}
        resolution={512}
        color="#1a1a1a"
      />
    </>
  )

  const renderNaturalEnvironment = () => (
    <>
      {/* Natural daylight environment */}
      <Environment
        background={background}
        blur={blur}
        resolution={256}
        preset="dawn"
      />
      
      {/* Soft natural shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.3}
        scale={15}
        blur={4}
        far={2}
        resolution={128}
        color="#4a5568"
      />
    </>
  )

  const renderDramaticEnvironment = () => (
    <>
      {/* Dramatic lighting environment */}
      <Environment
        background={background}
        blur={blur * 0.5}
        resolution={256}
        preset="night"
      />
      
      {/* Sharp dramatic shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.8}
        scale={12}
        blur={1}
        far={2}
        resolution={256}
        color="#000000"
      />
    </>
  )

  const renderSoftEnvironment = () => (
    <>
      {/* Soft diffused environment */}
      <Environment
        background={background}
        blur={blur * 2}
        resolution={256}
        preset="warehouse"
      />
      
      {/* Very soft shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.2}
        scale={30}
        blur={6}
        far={3}
        resolution={128}
        color="#2d3748"
      />
    </>
  )

  const renderEnvironment = () => {
    switch (preset) {
      case 'studio':
        return renderStudioEnvironment()
      case 'natural':
        return renderNaturalEnvironment()
      case 'dramatic':
        return renderDramaticEnvironment()
      case 'soft':
        return renderSoftEnvironment()
      case 'jewelry-studio':
      default:
        return renderJewelryStudioEnvironment()
    }
  }

  return <>{renderEnvironment()}</>
} 