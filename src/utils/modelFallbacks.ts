import * as THREE from 'three'

// Create fallback geometries that match the expected GLTF structure
export const createFallbackCharm = (type: 'pendant' | 'bead' | 'gemstone' | 'ornament') => {
  const group = new THREE.Group()
  
  switch (type) {
    case 'pendant':
      // Heart-shaped pendant fallback
      const heartShape = new THREE.Shape()
      heartShape.moveTo(0, 0.5)
      heartShape.bezierCurveTo(0, 0.5, -0.4, 0.8, -0.4, 0.4)
      heartShape.bezierCurveTo(-0.4, 0, 0, -0.3, 0, -0.8)
      heartShape.bezierCurveTo(0, -0.3, 0.4, 0, 0.4, 0.4)
      heartShape.bezierCurveTo(0.4, 0.8, 0, 0.5, 0, 0.5)
      
      const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      })
      
      const heartMesh = new THREE.Mesh(heartGeometry)
      heartMesh.rotation.x = Math.PI
      group.add(heartMesh)
      
      // Add attachment ring
      const ringGeometry = new THREE.TorusGeometry(0.08, 0.02, 8, 16)
      const ringMesh = new THREE.Mesh(ringGeometry)
      ringMesh.position.set(0, 0.6, 0)
      ringMesh.rotation.x = Math.PI / 2
      group.add(ringMesh)
      break
      
    case 'bead':
      const beadGeometry = new THREE.SphereGeometry(0.3, 16, 12)
      const beadMesh = new THREE.Mesh(beadGeometry)
      group.add(beadMesh)
      break
      
    case 'gemstone':
      // Octahedral crystal shape
      const crystalGeometry = new THREE.OctahedronGeometry(0.25, 0)
      const crystalMesh = new THREE.Mesh(crystalGeometry)
      group.add(crystalMesh)
      break
      
    case 'ornament':
      // Celtic knot-inspired torus
      const ornamentGeometry = new THREE.TorusKnotGeometry(0.2, 0.05, 32, 8, 2, 3)
      const ornamentMesh = new THREE.Mesh(ornamentGeometry)
      group.add(ornamentMesh)
      break
  }
  
  return group
}

export const createFallbackNecklace = (type: 'chain' | 'cord' | 'beaded' | 'wire', length: number = 8) => {
  const group = new THREE.Group()
  const radius = length / (2 * Math.PI)
  
  switch (type) {
    case 'chain':
      // Create chain links
      const numLinks = Math.floor(length * 8)
      for (let i = 0; i < numLinks; i++) {
        const angle = (i / numLinks) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = -0.5
        
        const linkGeometry = new THREE.TorusGeometry(0.04, 0.015, 6, 12)
        const linkMesh = new THREE.Mesh(linkGeometry)
        linkMesh.position.set(x, y, z)
        linkMesh.rotation.y = angle
        linkMesh.rotation.z = Math.PI / 2
        group.add(linkMesh)
      }
      break
      
    case 'cord':
      // Smooth cord
      const cordCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0)
      const cordPoints = cordCurve.getPoints(64)
      const cordGeometry = new THREE.BufferGeometry().setFromPoints(
        cordPoints.map(p => new THREE.Vector3(p.x, -0.5, p.y))
      )
      const cordMaterial = new THREE.LineBasicMaterial({ color: 0x8B4513 })
      const cordLine = new THREE.Line(cordGeometry, cordMaterial)
      group.add(cordLine)
      
      // Add thickness with tube geometry
      const cordShape = new THREE.CatmullRomCurve3(
        cordPoints.map(p => new THREE.Vector3(p.x, -0.5, p.y))
      )
      cordShape.closed = true
      const tubeGeometry = new THREE.TubeGeometry(cordShape, 64, 0.02, 8, true)
      const tubeMesh = new THREE.Mesh(tubeGeometry)
      group.add(tubeMesh)
      break
      
    case 'beaded':
      // Beaded necklace
      const numBeads = Math.floor(length * 6)
      for (let i = 0; i < numBeads; i++) {
        const angle = (i / numBeads) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = -0.5
        
        const beadGeometry = new THREE.SphereGeometry(0.03, 8, 6)
        const beadMesh = new THREE.Mesh(beadGeometry)
        beadMesh.position.set(x, y, z)
        group.add(beadMesh)
      }
      break
      
    case 'wire':
      // Thin wire
      const wireShape = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0)
      const wirePoints = wireShape.getPoints(128)
      const wireCurve = new THREE.CatmullRomCurve3(
        wirePoints.map(p => new THREE.Vector3(p.x, -0.5, p.y))
      )
      wireCurve.closed = true
      const wireGeometry = new THREE.TubeGeometry(wireCurve, 128, 0.005, 4, true)
      const wireMesh = new THREE.Mesh(wireGeometry)
      group.add(wireMesh)
      break
  }
  
  return group
}

// Convert our fallback geometry to a GLTF-like structure
export const createFallbackGLTF = (scene: THREE.Group) => {
  return {
    scene: scene,
    scenes: [scene],
    cameras: [],
    animations: [],
    asset: {
      generator: 'Play3D Fallback Generator',
      version: '2.0'
    },
    userData: {
      isFallback: true
    }
  }
} 