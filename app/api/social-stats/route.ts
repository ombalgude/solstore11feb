import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import { SocialService } from '@/lib/services/social-service'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user's social links from database
    const { data: user, error } = await supabase
      .from('users')
      .select('social_links')
      .eq('username', username)
      .single()

    if (error) throw error
    if (!user?.social_links) {
      return NextResponse.json({ stats: [], total: 0 })
    }

    // Get social stats
    const stats = await SocialService.getAllSocialStats(user.social_links)
    const total = SocialService.calculateTotalFollowers(stats)

    return NextResponse.json({ stats, total })
  } catch (error: any) {
    console.error("Error fetching social stats:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch social stats" },
      { status: 500 }
    )
  }
}