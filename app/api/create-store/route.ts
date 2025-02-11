import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { name, username, bio } = await req.json()

    // Validate input
    if (!name || !username || !bio) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if username is taken
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking username:", checkError)
      return NextResponse.json(
        { error: "Error checking username availability" },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      )
    }

    // Create new user record
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          name,
          username,
          bio,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (createError) {
      console.error("Error creating user:", createError)
      return NextResponse.json(
        { error: "Failed to create store" },
        { status: 500 }
      )
    }

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error creating store:", error)
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    )
  }
}