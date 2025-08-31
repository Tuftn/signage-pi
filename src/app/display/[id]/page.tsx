'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

// Display configurations with menu image support
const displayConfig = {
  '1': { name: 'Screen 1', bgColor: 'from-orange-600 to-red-700', menuImage: null },
  '2': { name: 'Screen 2', bgColor: 'from-green-600 to-blue-700', menuImage: null },
  '3': { name: 'Screen 3', bgColor: 'from-purple-600 to-pink-700', menuImage: null },
  '4': { name: 'Screen 4', bgColor: 'from-yellow-600 to-orange-700', menuImage: null },
  '5': { name: 'Screen 5', bgColor: 'from-blue-600 to-indigo-700', menuImage: null },
  '6': { name: 'Screen 6', bgColor: 'from-pink-600 to-red-700', menuImage: null },
  '7': { name: 'Screen 7', bgColor: 'from-amber-600 to-brown-700', menuImage: null },
  '8': { name: 'Screen 8', bgColor: 'from-teal-600 to-cyan-700', menuImage: null },
}

// Additional color options for unlimited screens
const colorOptions = [
  'from-red-600 to-pink-700',
  'from-orange-600 to-red-700', 
  'from-yellow-600 to-orange-700',
  'from-green-600 to-blue-700',
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-pink-700',
  'from-pink-600 to-red-700',
  'from-teal-600 to-cyan-700',
  'from-amber-600 to-brown-700',
  'from-slate-600 to-slate-800',
]

export default function Display() {
  const params = useParams()
  const displayId = params.id as string
  const [currentTime, setCurrentTime] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bgGradient, setBgGradient] = useState('from-gray-600 to-gray-800')
  const [menuImage, setMenuImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set display configuration
    const config = displayConfig[displayId as keyof typeof displayConfig]
    if (config) {
      setDisplayName(config.name)
      setBgGradient(config.bgColor)
      setMenuImage(config.menuImage)
    } else {
      // Generate config for screens beyond the default list
      const colorIndex = (parseInt(displayId) - 1) % colorOptions.length
      setDisplayName(`Screen ${displayId}`)
      setBgGradient(colorOptions[colorIndex])
      setMenuImage(null)
    }

    // Try to load menu image from Vercel Blob + localStorage fallback
    const checkForMenuImage = async () => {
      try {
        setIsLoading(true)
        
        // First check localStorage for immediate loading
        const storedMenu = localStorage.getItem(`menu-${displayId}`)
        if (storedMenu) {
          const menuData = JSON.parse(storedMenu)
          if (menuData.imageUrl) {
            setMenuImage(menuData.imageUrl)
            setIsLoading(false)
            return
          }
        }

        // Try to get from API (this would check your blob storage)
        try {
          const response = await fetch(`/api/upload?screenId=${displayId}`)
          if (response.ok) {
            const result = await response.json()
            if (result.url && result.exists) {
              setMenuImage(result.url)
              setIsLoading(false)
              return
            }
          }
        } catch (apiError) {
          console.log('API check failed, using fallback')
        }
        
        setIsLoading(false)
        
      } catch (error) {
        console.log('No menu image found for screen', displayId)
        setIsLoading(false)
      }
    }

    checkForMenuImage()

    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    
    // Auto-refresh page every 10 minutes to get menu updates
    const refreshInterval = setInterval(() => {
      window.location.reload()
    }, 600000) // 10 minutes

    // Clean up intervals
    return () => {
      clearInterval(interval)
      clearInterval(refreshInterval)
    }
  }, [displayId])

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* Menu Display */}
      <div className="w-full h-full relative">
        {menuImage && !imageError ? (
          <>
            {/* Loading overlay */}
            {isLoading && (
              <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} flex items-center justify-center z-10`}>
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-2xl">Loading menu...</p>
                </div>
              </div>
            )}
            
            {/* Menu Image */}
            <Image
              src={menuImage}
              alt={`${displayName} Menu`}
              fill
              className="object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority
            />
          </>
        ) : (
          /* Placeholder when no menu image */
          <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
            <div className="text-white text-center px-8">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
                {displayName.toUpperCase()}
              </h1>
              
              {isLoading ? (
                <>
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl md:text-2xl">Loading menu...</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-6">🍽️</div>
                  <p className="text-lg md:text-2xl lg:text-3xl mb-4 opacity-90">
                    Menu Coming Soon
                  </p>
                  <p className="text-sm md:text-lg lg:text-xl opacity-70 mb-8">
                    Upload your menu image in the admin panel
                  </p>
                  
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm md:text-base opacity-75">
                      Admin Panel: /admin<br/>
                      Screen URL: /display/{displayId}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Time display in corner */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-lg md:text-xl lg:text-2xl font-bold bg-black bg-opacity-60 px-3 md:px-4 py-2 rounded-lg backdrop-blur-sm">
        {currentTime}
      </div>

      {/* Screen ID indicator (bottom left) */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white text-sm md:text-base lg:text-lg font-medium bg-black bg-opacity-40 px-2 md:px-3 py-1 rounded backdrop-blur-sm">
        Screen {displayId}
      </div>

      {/* Refresh indicator (bottom right, only visible briefly) */}
      <div className="absolute bottom-4 right-4 text-white text-xs bg-green-600 bg-opacity-80 px-2 py-1 rounded opacity-0 animate-pulse" id="refresh-indicator">
        ↻ Updated
      </div>
    </div>
  )
}