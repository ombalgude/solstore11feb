import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { productId, rating, comment } = await req.json()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check for existing rating
    const { data: existingRating, error: checkError } = await supabase
      .from('product_ratings')
      .select()
      .eq('product_id', productId)
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
      // Update existing rating
      const { error: updateError } = await supabase
        .from('product_ratings')
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
      // Create new rating
      const { error: insertError } = await supabase
        .from('product_ratings')
        .insert([{
          product_id: productId,
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