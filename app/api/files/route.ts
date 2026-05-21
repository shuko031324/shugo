import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple in-memory cache for signed URLs. Keyed by pathname.
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>()
const SIGNED_URL_TTL = 60 * 60 * 1000 // 1 hour in ms

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname')

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    const cached = signedUrlCache.get(pathname)
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.redirect(cached.url)
    }

    const supabase = await createClient()
    const { data, error } = await supabase.storage.from('portfolio').createSignedUrl(pathname, SIGNED_URL_TTL / 1000)

    if (error || !data?.signedUrl) {
      console.error('Signed URL error:', error)
      return new NextResponse('Not found', { status: 404 })
    }

    // Cache the signed URL until shortly before it expires.
    signedUrlCache.set(pathname, { url: data.signedUrl, expiresAt: Date.now() + SIGNED_URL_TTL - 5000 })

    return NextResponse.redirect(data.signedUrl)
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
