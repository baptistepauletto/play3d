import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/3d/Scene'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import type { ViewerState } from './types'
import './App.css'

function App() {
  const [viewerState, setViewerState] = useState<ViewerState>({
    selectedNecklaceId: null,
    selectedCharmId: null,
    cameraMode: 'orbit',
    displayMode: 'floating',
    lighting: 'studio',
    showPhysics: false,
    showAttachmentPoints: false,
  })

  const handleCharmClick = (charmId: string) => {
    setViewerState(prev => ({
      ...prev,
      selectedCharmId: charmId
    }))
    console.log('Charm clicked:', charmId)
  }

  const handleCharmHover = (charmId: string | null) => {
    console.log('Charm hovered:', charmId)
  }

  return (
    <div className="app">
      {/* Header */}
      <Header />

      {/* 3D Scene Container */}
      <div className="scene-container">
        <Canvas
          shadows
          camera={{ position: [3, 3, 3], fov: 60 }}
          style={{ width: '100vw', height: '80vh' }}
        >
          <Scene
            viewerState={viewerState}
            onCharmClick={handleCharmClick}
            onCharmHover={handleCharmHover}
          />
        </Canvas>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
