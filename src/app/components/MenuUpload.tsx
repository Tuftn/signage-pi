'use client'

import { useState, useRef } from 'react'

interface MenuUploadProps {
  screenId: string
  screenName: string
  onUploadComplete: (screenId: string, imageUrl: string) => void
  onClose: () => void
}

export default function MenuUpload({ screenId, screenName, onUploadComplete, onClose }: MenuUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileUpload(imageFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Vercel Blob via API route
      const formData = new FormData()
      formData.append('file', file)
      formData.append('screenId', screenId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      
      // Save URL to localStorage for immediate access
      const menuData = {
        screenId,
        imageUrl: result.url,
        filename: result.filename,
        uploadedAt: new Date().toISOString()
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(`menu-${screenId}`, JSON.stringify(menuData))
      }
      
      onUploadComplete(screenId, result.url)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upload Menu for {screenName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewUrl} 
                alt="Menu preview"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg object-contain"
              />
              <p className="text-green-600 font-medium">Menu preview ready!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📁</div>
              <div>
                <p className="text-xl font-medium text-gray-700 mb-2">
                  Drag &amp; drop your menu image here
                </p>
                <p className="text-gray-500 mb-4">or click to select a file</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={isUploading}
                >
                  Select Image
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File Requirements */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2">📋 Requirements:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ Image format: PNG, JPG, JPEG, WEBP</li>
            <li>✅ Max file size: 5MB</li>
            <li>✅ Recommended: 1920x1080 (Full HD) for TV display</li>
            <li>✅ Use high contrast text for better visibility</li>
          </ul>
        </div>

        {/* Action Buttons */}
        {previewUrl && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const file = fileInputRef.current?.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
              }}
              disabled={isUploading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                'Upload Menu'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}