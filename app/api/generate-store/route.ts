import { AIService } from "@/lib/services/ai-service"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { storeType, targetAudience } = await req.json()

    const suggestion = await AIService.generateStoreDetails(storeType, targetAudience)

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error("Error generating store details:", error)
    return NextResponse.json(
      { error: "Failed to generate store details" },
      { status: 500 }
    )
  }
}