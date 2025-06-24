import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Text } from '@react-three/drei'
import './App.css'

function Scene() {
  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight position={[-10, -10, -10]} />

      {/* Test Geometry - Simple Box */}
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="hotpink" />
      </Box>

      {/* Ground Plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      {/* Welcome Text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Play3D - Necklace Showcase
      </Text>

      {/* Camera Controls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}

function App() {
  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>Play3D - Interactive 3D Necklace Showcase</h1>
        <p>A sophisticated 3D jewelry display platform</p>
      </div>

      {/* 3D Scene Container */}
      <div className="scene-container">
        <Canvas
          shadows
          camera={{ position: [3, 3, 3], fov: 60 }}
          style={{ width: '100vw', height: '80vh' }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Footer Info */}
      <div className="info">
        <p>
          <strong>Controls:</strong> Left click + drag to rotate • Right click + drag to pan • Scroll to zoom
        </p>
        <p>
          <em>3D Scene initialized successfully! Ready for necklace display.</em>
        </p>
      </div>
    </div>
  )
}

export default App
