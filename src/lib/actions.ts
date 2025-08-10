'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Type definitions for better TypeScript support
export type EntryWithImages = {
  id: number
  title: string | null
  contentHtml: string
  tags: string[]
  categories: string[]
  emotions: string[]
  people: any
  song: any
  challenges: any
  moodScore: number | null
  createdAt: Date
  updatedAt: Date
  images: {
    id: number
    url: string
  }[]
}

// CREATE OPERATIONS
export async function createEntry(formData: FormData) {
  // Get authenticated user
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  try {
    // Extract form data
    const title = formData.get('title') as string
    const contentHtml = formData.get('contentHtml') as string
    const tags = JSON.parse(formData.get('tags') as string || '[]')
    const categories = JSON.parse(formData.get('categories') as string || '[]')
    const emotions = JSON.parse(formData.get('emotions') as string || '[]')
    const people = JSON.parse(formData.get('people') as string || '{}')
    const song = JSON.parse(formData.get('song') as string || 'null')
    const challenges = JSON.parse(formData.get('challenges') as string || 'null')
    const moodScore = parseInt(formData.get('moodScore') as string) || null

    // Create entry with Prisma
    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        title,
        contentHtml,
        tags,
        categories,
        emotions,
        people,
        song,
        challenges,
        moodScore,
      },
      include: {
        images: true // Include related images
      }
    })

    // Revalidate the journal page cache so it shows the new entry
    revalidatePath('/journal')
    
    // Redirect to the new entry
    redirect(`/journal/entry/${entry.id}`)
  } catch (error) {
    console.error('Error creating entry:', error)
    throw new Error('Failed to create entry')
  }
}

// READ OPERATIONS
export async function getEntries(limit?: number): Promise<EntryWithImages[]> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return []
  }

  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId: user.id
      },
      include: {
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: limit })
    })

    return entries
  } catch (error) {
    console.error('Error fetching entries:', error)
    return []
  }
}

export async function getEntry(id: number): Promise<EntryWithImages | null> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        id,
        userId: user.id // Ensure user can only access their own entries
      },
      include: {
        images: true
      }
    })

    return entry
  } catch (error) {
    console.error('Error fetching entry:', error)
    return null
  }
}

// UPDATE OPERATIONS
export async function updateEntry(id: number, formData: FormData) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await (await supabase).auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  try {
    // Verify ownership
    const existingEntry = await prisma.entry.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingEntry) {
      throw new Error('Entry not found or unauthorized')
    }

    // Extract updated data
    const title = formData.get('title') as string
    const contentHtml = formData.get('contentHtml') as string
    const tags = JSON.parse(formData.get('tags') as string || '[]')
    const categories = JSON.parse(formData.get('categories') as string || '[]')
    const emotions = JSON.parse(formData.get('emotions') as string || '[]')
    const people = JSON.parse(formData.get('people') as string || '{}')
    const song = JSON.parse(formData.get('song') as string || 'null')
    const challenges = JSON.parse(formData.get('challenges') as string || 'null')
    const moodScore = parseInt(formData.get('moodScore') as string) || null

    // Update entry
    await prisma.entry.update({
      where: { id },
      data: {
        title,
        contentHtml,
        tags,
        categories,
        emotions,
        people,
        song,
        challenges,
        moodScore,
        updatedAt: new Date()
      }
    })

    revalidatePath(`/journal/entry/${id}`)
    revalidatePath('/journal')
  } catch (error) {
    console.error('Error updating entry:', error)
    throw new Error('Failed to update entry')
  }
}

// DELETE OPERATIONS
export async function deleteEntry(id: number) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  try {
    // Verify ownership
    const existingEntry = await prisma.entry.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingEntry) {
      throw new Error('Entry not found or unauthorized')
    }

    // Delete entry (images will be cascade deleted due to your schema)
    await prisma.entry.delete({
      where: { id }
    })

    revalidatePath('/journal')
    redirect('/journal')
  } catch (error) {
    console.error('Error deleting entry:', error)
    throw new Error('Failed to delete entry')
  }
}

// ANALYTICS OPERATIONS
export async function getEmotionStats() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return []
  }

  try {
    // Get all entries for the user
    const entries = await prisma.entry.findMany({
      where: { userId: user.id },
      select: { emotions: true, createdAt: true }
    })

    // Process emotions data
    const emotionCounts: Record<string, number> = {}
    
    entries.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      })
    })

    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count
    }))
  } catch (error) {
    console.error('Error fetching emotion stats:', error)
    return []
  }
}

export async function getPeopleStats() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return []
  }

  try {
    const entries = await prisma.entry.findMany({
      where: { userId: user.id },
      select: { people: true, emotions: true }
    })

    // Process people data - this is a simplified version
    // You'll want to enhance this based on how you structure people data
    const peopleStats: Record<string, { count: number; sentiment: 'positive' | 'negative' | 'mixed' }> = {}

    entries.forEach(entry => {
      if (entry.people && typeof entry.people === 'object') {
        Object.keys(entry.people as object).forEach(person => {
          if (!peopleStats[person]) {
            peopleStats[person] = { count: 0, sentiment: 'mixed' }
          }
          peopleStats[person].count++
          
          // Simple sentiment analysis based on emotions
          const hasPositive = entry.emotions.some(e => ['optimistic', 'happy', 'excited'].includes(e))
          const hasNegative = entry.emotions.some(e => ['sad', 'angry', 'frustrated'].includes(e))
          
          if (hasPositive && !hasNegative) {
            peopleStats[person].sentiment = 'positive'
          } else if (hasNegative && !hasPositive) {
            peopleStats[person].sentiment = 'negative'
          }
        })
      }
    })

    return Object.entries(peopleStats).map(([name, stats]) => ({
      name,
      ...stats
    })).sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error fetching people stats:', error)
    return []
  }
}