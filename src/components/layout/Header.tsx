import React from 'react'

export interface HeaderProps {
  title?: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({
  title = "Play3D - Interactive 3D Necklace Showcase",
  subtitle = "A sophisticated 3D jewelry display platform"
}) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
} 