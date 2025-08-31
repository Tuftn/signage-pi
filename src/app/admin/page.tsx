// app/admin/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import PasswordProtection from '../components/PasswordProtection'
import MenuUpload from '../components/MenuUpload'
import { getAllMenuConfigs, MenuConfig } from '../../../lib/menu-config'

function AdminContent() {
  const [numScreens, setNumScreens] = useState(8)
  const [uploadingScreen, setUploadingScreen] = useState<string | null>(null)
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>(() => getAllMenuConfigs(8))

  const handleScreenCountChange = (newCount: number) => {
    setNumScreens(newCount)
    setMenuConfigs(getAllMenuConfigs(newCount))
  }

  const handleUploadComplete = (screenId: string, imageUrl: string) => {
    setMenuConfigs(prev => prev.map(config => 
      config.id === screenId 
        ? { ...config, imagePath: imageUrl, lastUpdated: new Date() }
        : config
    ))
    setUploadingScreen(null)
  }

  const getScreenStatus = (config: MenuConfig) => {
    // Check localStorage for uploaded menu
    const stored = localStorage.getItem(`menu-${config.id}`)
    return stored ? 'Has Menu' : 'No Menu'
  }

  const getStatusColor = (config: MenuConfig) => {
    const stored = localStorage.getItem(`menu-${config.id}`)
    return stored ? 'bg-green-500' : 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Digital Signage Admin</h1>
          <p className="text-xl text-gray-300">Manage your restaurant screens</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-300">Total Screens</h3>
            <p className="text-4xl font-bold mt-2">{numScreens}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-300">With Menus</h3>
            <p className="text-4xl font-bold mt-2">
              {menuConfigs.filter(c => localStorage.getItem(`menu-${c.id}`)).length}
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-yellow-300">Need Setup</h3>
            <p className="text-4xl font-bold mt-2">
              {menuConfigs.filter(c => !localStorage.getItem(`menu-${c.id}`)).length}
            </p>
          </div>
        </div>

        {/* Screen Count Control */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Number of Screens</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="number"
              min="1"
              max="100"
              value={numScreens}
              onChange={(e) => handleScreenCountChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg w-20 text-center"
            />
            <span className="text-gray-300">screens configured</span>
            
            {/* Quick presets */}
            <div className="flex gap-2 ml-6">
              <span className="text-gray-400 text-sm">Quick:</span>
              {[3, 5, 8, 12, 16, 20].map(count => (
                <button
                  key={count}
                  onClick={() => handleScreenCountChange(count)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Screen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuConfigs.map((config) => (
            <div 
              key={config.id}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:bg-opacity-20 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Screen {config.id}</h3>
                <span className={`${getStatusColor(config)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                  {getScreenStatus(config)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Link 
                  href={`/display/${config.id}`}
                  target="_blank"
                  className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                >
                  View Screen
                </Link>
                <button 
                  onClick={() => setUploadingScreen(config.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Upload Menu
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>URL: /display/{config.id}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-yellow-600 bg-opacity-20 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-300 mb-3">Setup Instructions</h3>
          <div className="text-gray-300 space-y-2">
            <p>1. Upload menu images using the buttons above</p>
            <p>2. Point your Raspberry Pi browser to: yourdomain.vercel.app/display/[ID]</p>
            <p>3. Each screen will auto-refresh every 10 minutes</p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadingScreen && (
        <MenuUpload
          screenId={uploadingScreen}
          screenName={`Screen ${uploadingScreen}`}
          onUploadComplete={handleUploadComplete}
          onClose={() => setUploadingScreen(null)}
        />
      )}
    </div>
  )
}

export default function Admin() {
  return (
    <PasswordProtection>
      <AdminContent />
    </PasswordProtection>
  )
}