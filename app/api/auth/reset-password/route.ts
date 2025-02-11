import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { email } = await req.json()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    })

    if (error) throw error

    return NextResponse.json({
      message: "Password reset instructions sent to your email"
    })
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send reset instructions" },
      { status: 500 }
    )
  }
}