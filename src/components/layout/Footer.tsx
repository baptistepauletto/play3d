import React from 'react'

export interface FooterProps {
  showControls?: boolean
  showStatus?: boolean
}

export const Footer: React.FC<FooterProps> = ({
  showControls = true,
  showStatus = true
}) => {
  return (
    <div className="info">
      {showControls && (
        <p>
          <strong>Controls:</strong> Left click + drag to rotate • Right click + drag to pan • Scroll to zoom
        </p>
      )}
      {showStatus && (
        <p>
          <em>3D Scene initialized successfully! Ready for necklace display.</em>
        </p>
      )}
    </div>
  )
} 