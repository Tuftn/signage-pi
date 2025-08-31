// app/components/PasswordProtection.tsx
'use client'

import { useState, useEffect } from 'react'

interface PasswordProtectionProps {
  children: React.ReactNode
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if password is set in blob storage and if user is authenticated
    const checkAuthStatus = async () => {
      try {
        // Check if admin password exists in blob storage
        const response = await fetch('/api/auth')
        const result = await response.json()
        
        setHasPassword(result.hasPassword)
        
        if (!result.hasPassword) {
          setIsSettingUp(true)
        } else {
          // Check session authentication
          const authToken = sessionStorage.getItem('admin-auth')
          if (authToken === 'authenticated') {
            setIsAuthenticated(true)
          }
        }
        
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsSettingUp(true) // Fallback to setup if check fails
      }
      
      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const handleSetupPassword = async () => {
    setError('')
    
    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters long')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setup',
          newPassword: newPassword
        })
      })

      if (response.ok) {
        sessionStorage.setItem('admin-auth', 'authenticated')
        setHasPassword(true)
        setIsAuthenticated(true)
        setIsSettingUp(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Setup failed')
      }
    } catch (error) {
      setError('Setup failed. Please try again.')
    }
  }

  const handleLogin = async () => {
    setError('')
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          password: password
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.authenticated) {
          sessionStorage.setItem('admin-auth', 'authenticated')
          setIsAuthenticated(true)
        }
      } else {
        setError('Incorrect password')
        setPassword('')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth')
    setIsAuthenticated(false)
    setPassword('')
  }

  const resetPassword = async () => {
    if (confirm('Are you sure you want to reset the admin password? This will allow you to set a new one.')) {
      try {
        // For now, we'll clear session and go to setup
        // In a full implementation, you'd delete the blob and reset
        sessionStorage.removeItem('admin-auth')
        setHasPassword(false)
        setIsAuthenticated(false)
        setIsSettingUp(true)
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
      } catch (error) {
        setError('Reset failed. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div>
        {/* Logout button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
        {children}
      </div>
    )
  }

  if (isSettingUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Setup Admin Password</h1>
            <p className="text-gray-600">Set a password to protect your digital signage admin panel</p>
            <div className="mt-2 text-sm text-blue-600">
              Password will be stored securely in cloud storage
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                minLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm password"
                onKeyPress={(e) => e.key === 'Enter' && handleSetupPassword()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSetupPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Set Password & Continue
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>This password will be stored securely in cloud storage</p>
            <p>It will work across all devices and browsers</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter your password to access the admin panel</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={resetPassword}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Forgot password? Reset it
          </button>
        </div>
      </div>
    </div>
  )
}