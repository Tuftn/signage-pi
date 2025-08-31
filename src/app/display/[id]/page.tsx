// app/display/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function Display() {
  const params = useParams()
  const displayId = params.id as string
  const [menuImage, setMenuImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load menu image from localStorage
    const loadMenuImage = () => {
      try {
        const storedMenu = localStorage.getItem(`menu-${displayId}`)
        if (storedMenu) {
          const menuData = JSON.parse(storedMenu)
          if (menuData.imageUrl || menuData.imageData) {
            setMenuImage(menuData.imageUrl || menuData.imageData)
          }
        }
      } catch (error) {
        console.log('No menu found for screen', displayId)
      }
      setIsLoading(false)
    }

    loadMenuImage()
    
    // Auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      window.location.reload()
    }, 600000)

    // Fullscreen handling - listen for F11
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault()
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
        } else {
          document.exitFullscreen()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      clearInterval(refreshInterval)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [displayId])

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {menuImage ? (
        <div className="w-full h-full">
          <Image
            src={menuImage}
            alt="Menu"
            fill
            className="object-cover w-full h-full"
            priority
            unoptimized
            sizes="100vw"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-6xl font-bold mb-4">Screen {displayId}</h1>
            <p className="text-2xl opacity-70">No menu uploaded</p>
            <p className="text-lg opacity-50 mt-4">Visit /admin to upload</p>
            <p className="text-sm opacity-40 mt-8">Press F11 for fullscreen</p>
          </div>
        </div>
      )}

      {/* Screen indicator - only show when no menu */}
      {!menuImage && (
        <div className="absolute bottom-6 left-6 text-white bg-black bg-opacity-50 px-3 py-1 rounded text-lg">
          Screen {displayId}
        </div>
      )}
    </div>
  )
}