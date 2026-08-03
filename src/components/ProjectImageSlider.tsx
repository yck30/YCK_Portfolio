'use client'

import { useState, useEffect } from 'react'

interface ImageObject {
  src: string
  position: string
  fit?: string | any
}

interface ProjectImageSliderProps {
  images: ImageObject[]
  alt: string
}

export function ProjectImageSlider({ images, alt }: ProjectImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [images])

  if (!images || images.length === 0) return null

  return (
    <div className="bento-image-wrapper">
      {images.map((img, idx) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={img.src}
          src={img.src}
          alt=""
          style={{
            objectPosition: img.position || 'center center',
            objectFit: img.fit || 'cover',
            opacity: idx === currentIndex ? 1 : 0,
            zIndex: idx === currentIndex ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out'
          }}
        />
      ))}
    </div>
  )
}
