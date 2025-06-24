import * as THREE from 'three'

// Material types for jewelry
export interface JewelryMaterial {
  type: 'metal' | 'gemstone' | 'pearl' | 'fabric' | 'leather'
  name: string
  color: string
  metallic?: number
  roughness?: number
  transparency?: number
  refraction?: number
  textureUrl?: string
  normalMapUrl?: string
}

// Common metals for necklaces
export const METALS = {
  GOLD_18K: { type: 'metal', name: '18K Gold', color: '#FFD700', metallic: 1, roughness: 0.1 },
  SILVER_925: { type: 'metal', name: '925 Silver', color: '#C0C0C0', metallic: 1, roughness: 0.15 },
  PLATINUM: { type: 'metal', name: 'Platinum', color: '#E5E4E2', metallic: 1, roughness: 0.1 },
  ROSE_GOLD: { type: 'metal', name: 'Rose Gold', color: '#E8B4B8', metallic: 1, roughness: 0.1 },
} as const

// Attachment point for charms on the necklace
export interface AttachmentPoint {
  id: string
  position: THREE.Vector3Tuple // [x, y, z] position on the necklace
  rotation: THREE.Euler // Rotation for proper charm orientation
  type: 'link' | 'clasp' | 'centerpiece' | 'segment' // Type of attachment
  maxCharmSize: number // Maximum size of charm that can be attached
  occupied: boolean // Whether this point has a charm attached
}

// Individual charm/pendant definition
export interface Charm {
  id: string
  name: string
  type: 'pendant' | 'bead' | 'gemstone' | 'ornament'
  modelPath: string // Path to 3D model file
  material: JewelryMaterial
  size: number // Relative size (0.1 to 2.0)
  weight: number // Affects physics simulation
  attachmentType: AttachmentPoint['type'] // Which attachment points this charm can use
  metadata?: {
    description?: string
    price?: number
    artisan?: string
    rarity?: 'common' | 'rare' | 'legendary'
  }
}

// Necklace chain/base structure
export interface NecklaceBase {
  id: string
  name: string
  type: 'chain' | 'cord' | 'beaded' | 'wire'
  modelPath: string
  material: JewelryMaterial
  length: number // Length in 3D units
  attachmentPoints: AttachmentPoint[] // Where charms can be attached
  physics: {
    segments: number // Number of physics segments for simulation
    stiffness: number // Chain stiffness (0-1)
    damping: number // Movement damping (0-1)
  }
}

// Complete necklace with base and attached charms
export interface Necklace {
  id: string
  name: string
  base: NecklaceBase
  charms: Array<{
    charm: Charm
    attachmentPointId: string
    customPosition?: THREE.Vector3Tuple // Override position if needed
    customRotation?: THREE.Euler // Override rotation if needed
  }>
  displaySettings: {
    defaultCameraPosition: THREE.Vector3Tuple
    defaultCameraTarget: THREE.Vector3Tuple
    lighting: 'studio' | 'natural' | 'dramatic' | 'soft'
    background: 'gradient' | 'hdri' | 'solid'
  }
  metadata: {
    description: string
    category: string
    tags: string[]
    created: Date
    modified: Date
    price?: number
    availability?: boolean
  }
}

// Collection of necklaces
export interface NecklaceCollection {
  id: string
  name: string
  description: string
  necklaces: Necklace[]
  featured: string[] // Array of necklace IDs that are featured
}

// User interaction state
export interface ViewerState {
  selectedNecklaceId: string | null
  selectedCharmId: string | null
  cameraMode: 'orbit' | 'preset' | 'cinematic'
  displayMode: 'floating' | 'mannequin' | 'flat'
  lighting: 'studio' | 'natural' | 'dramatic' | 'soft'
  showPhysics: boolean
  showAttachmentPoints: boolean
}

// Animation states for necklaces
export interface AnimationState {
  isAnimating: boolean
  animationType: 'rotation' | 'sway' | 'bounce' | 'custom'
  speed: number
  amplitude: number
}

// Export commonly used type unions
export type MaterialType = JewelryMaterial['type']
export type CharmType = Charm['type']
export type NecklaceType = NecklaceBase['type']
export type AttachmentType = AttachmentPoint['type'] 