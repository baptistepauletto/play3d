import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import type { GLTF } from 'three-stdlib'

export interface ModelLoadingState {
  model: GLTF | null
  isLoading: boolean
  error: string | null
}

export const useNecklaceLoader = (modelPath: string): ModelLoadingState => {
  const [state, setState] = useState<ModelLoadingState>({
    model: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Reset state when model path changes
    setState({
      model: null,
      isLoading: true,
      error: null,
    })
  }, [modelPath])

  try {
    // Load the GLTF model
    const gltf = useGLTF(modelPath)
    
    useEffect(() => {
      if (gltf) {
        setState({
          model: gltf,
          isLoading: false,
          error: null,
        })
      }
    }, [gltf])

  } catch (error) {
    useEffect(() => {
      setState({
        model: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load model',
      })
    }, [error])
  }

  return state
}

// Preload function for better performance
export const preloadNecklaceModel = (modelPath: string) => {
  try {
    useGLTF.preload(modelPath)
  } catch (error) {
    console.warn(`Failed to preload model: ${modelPath}`, error)
  }
}

// Utility function to get fallback model paths
export const getModelPath = (modelPath: string, type: 'necklace' | 'charm'): string => {
  // If the model path is not available, return a fallback
  if (!modelPath || modelPath.startsWith('/models/')) {
    // For demo purposes, we'll create fallback paths
    switch (type) {
      case 'necklace':
        return '/models/fallback/chain.gltf'
      case 'charm':
        return '/models/fallback/charm.gltf'
      default:
        return '/models/fallback/default.gltf'
    }
  }
  return modelPath
}

// Model validation utility
export const validateModel = (gltf: GLTF): boolean => {
  try {
    // Basic validation - check if the model has a scene
    return !!(gltf?.scene && gltf.scene.children.length > 0)
  } catch {
    return false
  }
} 