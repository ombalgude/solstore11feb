import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { storeId, rating, comment } = await req.json()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: existingRating, error: checkError } = await supabase
      .from('ratings')
      .select()
      .eq('store_id', storeId)
      .eq('reviewer_id', session.user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing rating:", checkError)
      return NextResponse.json(
        { error: "Error checking existing rating" },
        { status: 500 }
      )
    }

    if (existingRating) {
      const { error: updateError } = await supabase
        .from('ratings')
        .update({ rating, comment })
        .eq('id', existingRating.id)

      if (updateError) {
        console.error("Error updating rating:", updateError)
        return NextResponse.json(
          { error: "Failed to update rating" },
          { status: 500 }
        )
      }
    } else {
      const { error: insertError } = await supabase
        .from('ratings')
        .insert([{
          store_id: storeId,
          reviewer_id: session.user.id,
          rating,
          comment
        }])

      if (insertError) {
        console.error("Error creating rating:", insertError)
        return NextResponse.json(
          { error: "Failed to create rating" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling rating:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}