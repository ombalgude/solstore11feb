import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { 
      businessName,
      businessWebsite,
      businessDescription,
      idDocumentUrl,
      idType,
      idNumber
    } = await req.json()

    // Create verification request
    const { data: verificationRequest, error } = await supabase
      .from('creator_verifications')
      .insert([{
        user_id: session.user.id,
        business_name: businessName,
        business_website: businessWebsite,
        business_description: businessDescription,
        id_document_url: idDocumentUrl,
        id_type: idType,
        id_number: idNumber,
        status: 'pending',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(verificationRequest)
  } catch (error: any) {
    console.error("Error submitting verification:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit verification" },
      { status: 500 }
    )
  }
}