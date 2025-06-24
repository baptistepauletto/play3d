import { useRef, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface CameraPreset {
  name: string
  position: THREE.Vector3Tuple
  target: THREE.Vector3Tuple
  description: string
}

export interface CameraControlsState {
  currentPreset: string | null
  isTransitioning: boolean
  autoRotate: boolean
  autoRotateSpeed: number
}

export interface UseCameraControlsProps {
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  enablePan?: boolean
  enableRotate?: boolean
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
  autoRotateSpeed?: number
  target?: THREE.Vector3Tuple
}

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  'front': {
    name: 'Front View',
    position: [0, 0, 4],
    target: [0, 0, 0],
    description: 'Straight-on view of the necklace'
  },
  'three-quarter': {
    name: 'Three Quarter',
    position: [3, 2, 3],
    target: [0, 0, 0],
    description: 'Classic jewelry photography angle'
  },
  'side': {
    name: 'Side Profile',
    position: [4, 0, 0],
    target: [0, 0, 0],
    description: 'Side profile view'
  },
  'top': {
    name: 'Top Down',
    position: [0, 5, 0],
    target: [0, 0, 0],
    description: 'Top-down overhead view'
  },
  'detail': {
    name: 'Detail Close-up',
    position: [1, 1, 2],
    target: [0, 0, 0],
    description: 'Close-up for examining details'
  },
  'glamour': {
    name: 'Glamour Shot',
    position: [2, 4, 4],
    target: [0, -0.5, 0],
    description: 'Elevated glamour photography angle'
  },
  'floating': {
    name: 'Floating View',
    position: [4, 3, 4],
    target: [0, 0, 0],
    description: 'Elegant floating presentation'
  },
}

export const useCameraControls = (props: UseCameraControlsProps = {}) => {
  const {
    enableDamping = true,
    dampingFactor = 0.05,
    enableZoom = true,
    enablePan = true,
    enableRotate = true,
    minDistance = 1,
    maxDistance = 10,
    minPolarAngle = 0,
    maxPolarAngle = Math.PI,
    autoRotateSpeed = 0.5,
    target = [0, 0, 0],
  } = props

  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const isTransitioning = useRef(false)
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const startPosition = useRef(new THREE.Vector3())
  const startLookAt = useRef(new THREE.Vector3())
  const transitionProgress = useRef(0)
  const transitionDuration = useRef(1.5)

  // Camera control state
  const controlsState = useRef<CameraControlsState>({
    currentPreset: null,
    isTransitioning: false,
    autoRotate: false,
    autoRotateSpeed: autoRotateSpeed,
  })

  // Smooth camera transition animation
  useFrame((_state, delta) => {
    if (isTransitioning.current) {
      transitionProgress.current += delta / transitionDuration.current
      
      if (transitionProgress.current >= 1) {
        // Transition complete
        transitionProgress.current = 1
        isTransitioning.current = false
        controlsState.current.isTransitioning = false
      }

      // Smooth interpolation
      const t = smootherstep(transitionProgress.current)
      
      // Interpolate camera position
      const currentPosition = new THREE.Vector3().lerpVectors(
        startPosition.current,
        targetPosition.current,
        t
      )
      
      // Interpolate look-at target
      const currentLookAt = new THREE.Vector3().lerpVectors(
        startLookAt.current,
        targetLookAt.current,
        t
      )

      camera.position.copy(currentPosition)
      camera.lookAt(currentLookAt)
      
      // Update controls target if available
      if (controlsRef.current) {
        controlsRef.current.target.copy(currentLookAt)
        controlsRef.current.update()
      }
    }

    // Auto-rotation when enabled
    if (controlsState.current.autoRotate && controlsRef.current && !isTransitioning.current) {
      controlsRef.current.autoRotate = true
      controlsRef.current.autoRotateSpeed = controlsState.current.autoRotateSpeed
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false
    }
  })

  // Smoothstep function for smooth transitions
  const smootherstep = useCallback((t: number): number => {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }, [])

  // Transition to a camera preset
  const transitionToPreset = useCallback((presetName: string) => {
    const preset = CAMERA_PRESETS[presetName]
    if (!preset) {
      console.warn(`Camera preset "${presetName}" not found`)
      return
    }

    // Store current position and target
    startPosition.current.copy(camera.position)
    if (controlsRef.current) {
      startLookAt.current.copy(controlsRef.current.target)
    } else {
      startLookAt.current.set(0, 0, 0)
    }

    // Set target position and look-at
    targetPosition.current.set(...preset.position)
    targetLookAt.current.set(...preset.target)

    // Start transition
    transitionProgress.current = 0
    isTransitioning.current = true
    controlsState.current.isTransitioning = true
    controlsState.current.currentPreset = presetName

    console.log(`Transitioning to camera preset: ${preset.name}`)
  }, [camera])

  // Transition to custom position
  const transitionToPosition = useCallback((
    position: THREE.Vector3Tuple,
    lookAt: THREE.Vector3Tuple = [0, 0, 0],
    duration: number = 1.5
  ) => {
    startPosition.current.copy(camera.position)
    if (controlsRef.current) {
      startLookAt.current.copy(controlsRef.current.target)
    } else {
      startLookAt.current.set(0, 0, 0)
    }

    targetPosition.current.set(...position)
    targetLookAt.current.set(...lookAt)
    transitionDuration.current = duration

    transitionProgress.current = 0
    isTransitioning.current = true
    controlsState.current.isTransitioning = true
    controlsState.current.currentPreset = null
  }, [camera])

  // Toggle auto-rotation
  const toggleAutoRotate = useCallback(() => {
    controlsState.current.autoRotate = !controlsState.current.autoRotate
    console.log(`Auto-rotation ${controlsState.current.autoRotate ? 'enabled' : 'disabled'}`)
  }, [])

  // Set auto-rotation speed
  const setAutoRotateSpeed = useCallback((speed: number) => {
    controlsState.current.autoRotateSpeed = speed
  }, [])

  // Focus on a specific object or point
  const focusOn = useCallback((
    target: THREE.Vector3Tuple,
    distance: number = 3,
    angle: number = Math.PI / 4
  ) => {
    const targetVec = new THREE.Vector3(...target)
    const offset = new THREE.Vector3(
      Math.cos(angle) * distance,
      distance * 0.5,
      Math.sin(angle) * distance
    )
    const newPosition = targetVec.clone().add(offset)

    transitionToPosition(newPosition.toArray(), target)
  }, [transitionToPosition])

  // Get current camera state
  const getCameraState = useCallback(() => {
    return {
      position: camera.position.toArray() as THREE.Vector3Tuple,
      target: controlsRef.current 
        ? controlsRef.current.target.toArray() as THREE.Vector3Tuple
        : [0, 0, 0] as THREE.Vector3Tuple,
      preset: controlsState.current.currentPreset,
      isTransitioning: controlsState.current.isTransitioning,
      autoRotate: controlsState.current.autoRotate,
    }
  }, [camera])

  // Orbit controls configuration
  const orbitControlsConfig = useMemo(() => ({
    ref: controlsRef,
    enableDamping,
    dampingFactor,
    enableZoom,
    enablePan,
    enableRotate,
    minDistance,
    maxDistance,
    minPolarAngle,
    maxPolarAngle,
    target: new THREE.Vector3(...target),
    autoRotate: false, // Handled manually for smooth transitions
  }), [
    enableDamping,
    dampingFactor,
    enableZoom,
    enablePan,
    enableRotate,
    minDistance,
    maxDistance,
    minPolarAngle,
    maxPolarAngle,
    target,
  ])

  return {
    // Control functions
    transitionToPreset,
    transitionToPosition,
    toggleAutoRotate,
    setAutoRotateSpeed,
    focusOn,
    getCameraState,
    
    // Configuration
    orbitControlsConfig,
    
    // State
    controlsState: controlsState.current,
    presets: CAMERA_PRESETS,
    
    // Refs
    controlsRef,
  }
} 