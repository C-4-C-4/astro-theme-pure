import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const messages = body.messages

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages array provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 獲取設定在環境變數中的 MODELVERSE_API_KEY
    // Astro 服务端支持通过 import.meta.env 安全获取密钥
    const apiKey = import.meta.env.MODELVERSE_API_KEY
    if (!apiKey) {
       return new Response(
        JSON.stringify({ error: 'Server configuration error: MODELVERSE_API_KEY is missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 轉發請求至 modelverse API
    const response = await fetch('https://api.modelverse.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5.4',
        messages: messages,
        stream: true // 強制開啟流式傳輸
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: `ModelVerse API request failed: ${response.status}`, details: errorText }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 將大模型返回的 ReadableStream 透過 Astro Server 端原樣打回前端，形成 SSE 效果
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
