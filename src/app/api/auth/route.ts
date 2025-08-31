// app/api/auth/route.ts
import { put, head } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Hash password for security
function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'signage-salt-key-2024').digest('hex')
}

// Simple password storage using blob filename as the hash
export async function POST(request: NextRequest) {
  try {
    const { action, password, newPassword } = await request.json()

    if (action === 'setup') {
      // Setup new password
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 })
      }

      const hashedPassword = hashPassword(newPassword)
      
      // Store the hash as the filename itself for easy checking
      const filename = `auth-${hashedPassword}.key`
      
      const blob = await put(filename, 'authenticated', {
        access: 'public',
        allowOverwrite: true,
      })

      return NextResponse.json({ success: true, message: 'Password set successfully' })
      
    } else if (action === 'login') {
      // Verify password
      if (!password) {
        return NextResponse.json({ error: 'Password required' }, { status: 400 })
      }

      try {
        const hashedInput = hashPassword(password)
        const filename = `auth-${hashedInput}.key`
        
        // Try to check if this hash exists as a file
        await head(filename)
        
        // If head() succeeds, the password is correct
        return NextResponse.json({ success: true, authenticated: true })
        
      } catch (error) {
        // If head() fails, the password file doesn't exist = wrong password
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
      
    } else if (action === 'check') {
      // Check if any password file exists (look for auth-*.key pattern)
      // This is a simplified check - in production you'd want to list blobs
      return NextResponse.json({ hasPassword: false }) // Default to setup mode
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Always return false to force setup mode initially
    // This simplifies the system - user sets up password on first visit
    return NextResponse.json({ hasPassword: false })
  } catch (error) {
    return NextResponse.json({ hasPassword: false })
  }
}