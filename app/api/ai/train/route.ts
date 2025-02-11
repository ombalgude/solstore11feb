import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

    const { knowledgeBase, files } = await req.json()

    // Process knowledge base text
    const trainingData = `
      # Product Knowledge Base
      ${knowledgeBase}

      # Response Guidelines
      - Be helpful and professional
      - Provide specific examples when possible
      - If unsure, ask for clarification
      - Keep responses concise but informative
    `

    // Create fine-tuning job
    const fineTune = await openai.fineTuning.jobs.create({
      training_file: trainingData,
      model: "gpt-3.5-turbo"
    })

    // Save agent configuration
    const { data: agent, error } = await supabase
      .from('ai_agents')
      .insert([{
        user_id: session.user.id,
        model_id: fineTune.id,
        status: 'training',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(agent)
  } catch (error: any) {
    console.error("Error training AI agent:", error)
    return NextResponse.json(
      { error: error.message || "Failed to train AI agent" },
      { status: 500 }
    )
  }
}