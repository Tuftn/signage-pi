// app/api/upload/route.ts
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
    const extension = file.name.split('.').pop() || 'png'
    const filename = `screen-${screenId}-menu.${extension}`

    // Upload to Vercel Blob with overwrite enabled
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true, // Allow overwriting existing menu images
    })

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

    // For now, return a placeholder response
    // In production, you'd check if the blob actually exists
    return NextResponse.json({ 
      url: null,
      exists: false
    })

  } catch (error) {
    console.error('Get menu error:', error)
    return NextResponse.json(
      { error: 'Failed to get menu' }, 
      { status: 500 }
    )
  }
}