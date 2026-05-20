import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname')

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.storage.from('portfolio').createSignedUrl(pathname, 60 * 60)

    if (error || !data?.signedUrl) {
      console.error('Signed URL error:', error)
      return new NextResponse('Not found', { status: 404 })
    }

    return NextResponse.redirect(data.signedUrl)
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
