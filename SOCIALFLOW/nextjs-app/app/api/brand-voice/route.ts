import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json()

    if (!text || !voice) {
      return NextResponse.json(
        { error: 'Both text and voice are required' },
        { status: 400 }
      )
    }

    const prompt = `Rewrite the following social media caption to match the specified brand voice.

Text:
"""
${text}
"""

Brand voice: ${voice}

Guidelines:
- Keep meaning intact, improve clarity and engagement
- Maintain length within ±20% of original
- Add subtle tone markers (emojis) only if natural
- Avoid hashtags and mentions unless already present
- Return ONLY the rewritten caption, no preface or explanation`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()

    return NextResponse.json({
      rewritten: (data.response || '').trim(),
    })
  } catch (error) {
    console.error('Brand Voice API error:', error)
    return NextResponse.json(
      { error: 'Failed to tune brand voice' },
      { status: 500 }
    )
  }
}


