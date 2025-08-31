import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const screenId = formData.get('screenId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!screenId) {
      return NextResponse.json({ error: 'No screen ID provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Create filename
    const extension = file.name.split('.').pop()
    const filename = `screen-${screenId}-menu.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false, // Keep consistent filename for each screen
    })

    // Store the URL in edge config or return it to be stored client-side
    // For now, we'll rely on consistent filename pattern
    
    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: filename
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const screenId = searchParams.get('screenId')

    if (!screenId) {
      return NextResponse.json({ error: 'Screen ID required' }, { status: 400 })
    }

    // In a real app, you'd query your database here
    // For now, we'll return the expected blob URL pattern
    const expectedUrl = `https://your-blob-store.vercel-storage.com/screen-${screenId}-menu`
    
    return NextResponse.json({ 
      url: expectedUrl,
      exists: true // You'd check if the file actually exists
    })

  } catch (error) {
    console.error('Get menu error:', error)
    return NextResponse.json(
      { error: 'Failed to get menu' }, 
      { status: 500 }
    )
  }
}