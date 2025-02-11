import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { password } = await req.json()

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) throw error

    return NextResponse.json({
      message: "Password updated successfully"
    })
  } catch (error: any) {
    console.error("Update password error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update password" },
      { status: 500 }
    )
  }
}