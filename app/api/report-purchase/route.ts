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

    const { purchaseId, reason } = await req.json()

    // Create purchase report
    const { data: report, error: reportError } = await supabase
      .from('purchase_reports')
      .insert([{
        purchase_id: purchaseId,
        reporter_id: session.user.id,
        reason,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (reportError) throw reportError

    // Get purchase details to find seller
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('product:products(creator_id)')
      .eq('id', purchaseId)
      .single()

    if (purchaseError) throw purchaseError

    // Freeze seller's store
    const { error: freezeError } = await supabase
      .from('users')
      .update({ is_frozen: true })
      .eq('id', purchase.product.creator_id)

    if (freezeError) throw freezeError

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Error reporting purchase:", error)
    return NextResponse.json(
      { error: error.message || "Failed to report purchase" },
      { status: 500 }
    )
  }
}