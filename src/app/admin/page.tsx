'use client'

import { useState } from 'react'
import Link from 'next/link'
import MenuUpload from '../components/MenuUpload'
import { getAllMenuConfigs, MenuConfig } from '../../../lib/menu-config'

export default function Admin() {
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
    return config.imagePath ? 'Has Menu' : 'No Menu'
  }

  const getStatusColor = (config: MenuConfig) => {
    return config.imagePath ? 'bg-green-500' : 'bg-yellow-500'
  }

  const getStatusTextColor = (config: MenuConfig) => {
    return config.imagePath ? 'text-green-100' : 'text-yellow-100'
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-600 bg-opacity-20 backdrop-blur-lg rounded-xl p-6 border border-blue-500 border-opacity-30">
            <h3 className="text-2xl font-bold text-blue-300">Total Screens</h3>
            <p className="text-4xl font-bold mt-2">{numScreens}</p>
          </div>
          <div className="bg-green-600 bg-opacity-20 backdrop-blur-lg rounded-xl p-6 border border-green-500 border-opacity-30">
            <h3 className="text-2xl font-bold text-green-300">With Menus</h3>
            <p className="text-4xl font-bold mt-2">{menuConfigs.filter(c => c.imagePath).length}</p>
          </div>
          <div className="bg-yellow-600 bg-opacity-20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500 border-opacity-30">
            <h3 className="text-2xl font-bold text-yellow-300">Need Setup</h3>
            <p className="text-4xl font-bold mt-2">{menuConfigs.filter(c => !c.imagePath).length}</p>
          </div>
          <div className="bg-purple-600 bg-opacity-20 backdrop-blur-lg rounded-xl p-6 border border-purple-500 border-opacity-30">
            <h3 className="text-2xl font-bold text-purple-300">Status</h3>
            <p className="text-2xl font-bold mt-2 text-purple-400">All Online</p>
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
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Screen {config.id}</h3>
                <span className={`${getStatusColor(config)} ${getStatusTextColor(config)} px-2 py-1 rounded-full text-xs font-medium`}>
                  {getScreenStatus(config)}
                </span>
              </div>
              
              <p className="text-gray-300 mb-4">{config.name}</p>
              
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
                  className={`w-full ${
                    config.imagePath 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-slate-600 hover:bg-slate-700'
                  } text-white py-2 px-4 rounded-lg transition-colors`}
                >
                  {config.imagePath ? 'Update Menu' : 'Upload Menu'}
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>URL: /display/{config.id}</p>
                <p>Last updated: {config.lastUpdated.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-yellow-600 bg-opacity-20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500 border-opacity-30">
          <h3 className="text-xl font-bold text-yellow-300 mb-3">Raspberry Pi Setup Instructions</h3>
          <div className="text-gray-300 space-y-2">
            <p>1. Configure your Raspberry Pi to boot to: <code className="bg-black bg-opacity-50 px-2 py-1 rounded">yourdomain.vercel.app/display/[ID]</code></p>
            <p>2. Each screen will automatically refresh every 10 minutes</p>
            <p>3. Upload menu images using the &quot;Upload Menu&quot; button above</p>
            <p>4. Time displays automatically in the corner of each screen</p>
            <p>5. Recommended image size: 1920x1080 (Full HD) for best TV display</p>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Bulk Actions</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Export All URLs
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              Generate QR Codes
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Download Setup Guide
            </button>
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