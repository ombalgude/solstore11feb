import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { message, productId } = await req.json()

    const supabase = createRouteHandlerClient({ cookies })
    
    // Get product and creator details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        creator:users(*)
      `)
      .eq('id', productId)
      .single()

    if (productError) throw productError

    // Get AI agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', product.creator.id)
      .single()

    if (agentError) throw agentError

    // Generate response using fine-tuned model
    const completion = await openai.chat.completions.create({
      model: agent.model_id,
      messages: [
        {
          role: "system",
          content: "You are a helpful product support agent. Use the training data to answer questions accurately."
        },
        {
          role: "user",
          content: message
        }
      ]
    })

    const response = completion.choices[0].message.content

    // Log conversation for analytics
    await supabase
      .from('ai_conversations')
      .insert([{
        agent_id: agent.id,
        product_id: productId,
        message,
        response,
        created_at: new Date().toISOString()
      }])

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    )
  }
}