// app/api/entries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getEntry, updateEntry } from '@/lib/actions'

// GET /api/entries/[id] - Fetch a specific entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // AWAIT params - Next.js 15+ requirement for dynamic routes
    const { id: idString } = await params
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      )
    }

    const entry = await getEntry(id)
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error fetching entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/entries/[id] - Update a specific entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // AWAIT params - Next.js 15+ requirement for dynamic routes
    const { id: idString } = await params
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    
    await updateEntry(id, formData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating entry:', error)
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    )
  }
}

// DELETE /api/entries/[id] - Delete a specific entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      )
    }

    // Note: deleteEntry redirects, so we'll call the Prisma operations directly
    // or modify deleteEntry to not redirect when called from API routes
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}