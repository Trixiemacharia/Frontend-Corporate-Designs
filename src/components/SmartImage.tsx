import { useState } from 'react'

type Props = { src: string; alt: string; className?: string; priority?: boolean }

export default function SmartImage({ src, alt, className = '', priority = false }: Props) {
  const [bad, setBad] = useState(false)
  if (bad) {
    return <div role="img" aria-label={alt} className={`bg-gradient-to-br from-forest via-[#1c5445] to-charcoal ${className}`} />
  }
  return (
    <img
      src={src} alt={alt} onError={() => setBad(true)}
      loading={priority ? 'eager' : 'lazy'} className={`object-cover ${className}`}
    />
  )
}