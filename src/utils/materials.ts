import * as THREE from 'three'
import type { JewelryMaterial } from '../types'

// Enhanced material creation utilities for realistic jewelry rendering
export class JewelryMaterials {
  
  /**
   * Create a physically-based metallic material for jewelry
   */
  static createMetalMaterial(materialDef: JewelryMaterial): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialDef.color),
      metalness: materialDef.metallic || 1.0,
      roughness: materialDef.roughness || 0.1,
      envMapIntensity: 1.5, // Enhanced environment reflections
      
      // Add subtle color variation for realism
      emissive: new THREE.Color(materialDef.color).multiplyScalar(0.02),
    })

    // Load textures if provided
    if (materialDef.textureUrl) {
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load(materialDef.textureUrl)
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      material.map = texture
    }

    if (materialDef.normalMapUrl) {
      const textureLoader = new THREE.TextureLoader()
      const normalMap = textureLoader.load(materialDef.normalMapUrl)
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
      material.normalMap = normalMap
      material.normalScale = new THREE.Vector2(0.5, 0.5)
    }

    return material
  }

  /**
   * Create a gemstone material with refraction and crystal clarity
   */
  static createGemstoneMaterial(materialDef: JewelryMaterial): THREE.MeshPhysicalMaterial {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(materialDef.color),
      metalness: 0,
      roughness: materialDef.roughness || 0.02,
      
      // Refraction properties
      transmission: materialDef.transparency || 0.95,
      ior: materialDef.refraction || 1.5,
      thickness: 0.8,
      
      // Crystal properties
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      
      // Enhanced light interaction
      envMapIntensity: 2.0,
      sheen: 0.5,
      sheenColor: new THREE.Color(materialDef.color).multiplyScalar(0.3),
      
      // Subtle internal glow
      emissive: new THREE.Color(materialDef.color).multiplyScalar(0.05),
      emissiveIntensity: 0.3,
    })

    // Add dispersion effect for diamonds/crystals
    if (materialDef.name.toLowerCase().includes('diamond')) {
      material.dispersion = 0.05
    }

    return material
  }

  /**
   * Create a pearl material with subsurface scattering effect
   */
  static createPearlMaterial(materialDef: JewelryMaterial): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialDef.color),
      metalness: materialDef.metallic || 0.1,
      roughness: materialDef.roughness || 0.2,
      
      // Pearl luster
      envMapIntensity: 1.8,
      
      // Subsurface scattering simulation
      transparent: true,
      opacity: 0.95,
      
      // Pearl iridescence
      emissive: new THREE.Color('#f0f8ff').multiplyScalar(0.03),
      emissiveIntensity: 0.2,
    })

    // Create pearl surface texture procedurally
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 512
    const context = canvas.getContext('2d')!
    
    // Base pearl color
    context.fillStyle = materialDef.color
    context.fillRect(0, 0, 512, 512)
    
    // Add noise for natural pearl surface
    const imageData = context.getImageData(0, 0, 512, 512)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20
      data[i] = Math.max(0, Math.min(255, data[i] + noise))     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)) // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)) // B
    }
    
    context.putImageData(imageData, 0, 0)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    material.map = texture
    
    return material
  }

  /**
   * Create fabric material for textile necklace components
   */
  static createFabricMaterial(materialDef: JewelryMaterial): THREE.MeshLambertMaterial {
    return new THREE.MeshLambertMaterial({
      color: new THREE.Color(materialDef.color),
      transparent: materialDef.transparency ? true : false,
      opacity: materialDef.transparency || 1.0,
    })
  }

  /**
   * Create leather material for cord necklaces
   */
  static createLeatherMaterial(materialDef: JewelryMaterial): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialDef.color),
      metalness: 0,
      roughness: materialDef.roughness || 0.8,
      normalScale: new THREE.Vector2(1.0, 1.0),
    })
  }

  /**
   * Main material factory method
   */
  static createMaterial(materialDef: JewelryMaterial): THREE.Material {
    switch (materialDef.type) {
      case 'metal':
        return this.createMetalMaterial(materialDef)
      case 'gemstone':
        return this.createGemstoneMaterial(materialDef)
      case 'pearl':
        return this.createPearlMaterial(materialDef)
      case 'fabric':
        return this.createFabricMaterial(materialDef)
      case 'leather':
        return this.createLeatherMaterial(materialDef)
      default:
        console.warn(`Unknown material type: ${materialDef.type}, using default`)
        return new THREE.MeshStandardMaterial({ color: materialDef.color })
    }
  }

  /**
   * Apply material to a Three.js Object3D and all its children
   */
  static applyMaterialToObject(object: THREE.Object3D, materialDef: JewelryMaterial): void {
    const material = this.createMaterial(materialDef)
    
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Store original material for potential restoration
        child.userData.originalMaterial = child.material
        child.material = material
        
        // Enable shadows
        child.castShadow = true
        child.receiveShadow = true
        
        // Optimize for jewelry rendering
        if (materialDef.type === 'metal' || materialDef.type === 'gemstone') {
          child.material.needsUpdate = true
        }
      }
    })
  }

  /**
   * Create animated materials with time-based effects
   */
  static createAnimatedMaterial(
    materialDef: JewelryMaterial, 
    animationType: 'shimmer' | 'pulse' | 'rainbow'
  ): THREE.ShaderMaterial {
    // Base material available via this.createMaterial(materialDef) if needed
    
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    
    const fragmentShader = `
      uniform float time;
      uniform vec3 color;
      uniform float metalness;
      uniform float roughness;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      void main() {
        vec3 finalColor = color;
        
        ${animationType === 'shimmer' ? `
          float shimmer = sin(time * 3.0 + vWorldPosition.x * 10.0) * 0.1 + 0.9;
          finalColor *= shimmer;
        ` : ''}
        
        ${animationType === 'pulse' ? `
          float pulse = sin(time * 2.0) * 0.2 + 0.8;
          finalColor *= pulse;
        ` : ''}
        
        ${animationType === 'rainbow' ? `
          float rainbow = sin(time + vWorldPosition.x) * 0.5 + 0.5;
          finalColor = mix(finalColor, vec3(rainbow, 1.0 - rainbow, 0.5), 0.3);
        ` : ''}
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(materialDef.color) },
        metalness: { value: materialDef.metallic || 0 },
        roughness: { value: materialDef.roughness || 0.5 },
      },
      vertexShader,
      fragmentShader,
    })
  }
}

// Predefined premium material presets
export const PREMIUM_MATERIALS = {
  // Metals
  GOLD_24K: { 
    type: 'metal', 
    name: '24K Pure Gold', 
    color: '#FFD700', 
    metallic: 1.0, 
    roughness: 0.05 
  },
  WHITE_GOLD: { 
    type: 'metal', 
    name: 'White Gold', 
    color: '#F8F8FF', 
    metallic: 1.0, 
    roughness: 0.08 
  },
  TITANIUM: { 
    type: 'metal', 
    name: 'Titanium', 
    color: '#C0C0C0', 
    metallic: 0.9, 
    roughness: 0.2 
  },
  
  // Gemstones
  DIAMOND: { 
    type: 'gemstone', 
    name: 'Diamond', 
    color: '#FFFFFF', 
    roughness: 0.01, 
    transparency: 0.95, 
    refraction: 2.42 
  },
  EMERALD: { 
    type: 'gemstone', 
    name: 'Emerald', 
    color: '#50C878', 
    roughness: 0.03, 
    transparency: 0.8, 
    refraction: 1.58 
  },
  RUBY: { 
    type: 'gemstone', 
    name: 'Ruby', 
    color: '#E0115F', 
    roughness: 0.02, 
    transparency: 0.7, 
    refraction: 1.77 
  },
  
  // Pearls
  TAHITIAN_PEARL: { 
    type: 'pearl', 
    name: 'Tahitian Pearl', 
    color: '#36454F', 
    metallic: 0.15, 
    roughness: 0.15 
  },
  AKOYA_PEARL: { 
    type: 'pearl', 
    name: 'Akoya Pearl', 
    color: '#FFF8DC', 
    metallic: 0.1, 
    roughness: 0.2 
  },
} as const

export type PremiumMaterialType = keyof typeof PREMIUM_MATERIALS 