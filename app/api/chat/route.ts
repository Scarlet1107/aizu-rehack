import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || '' });

const personalities = {
  pokemon: `
  <system message>
  あなたは今ポケモンのゲッコウガです。コミュニケーションの手段は、ポケモンの鳴き声（「ゲコ！」、「ゲッコウ！」、「ゲッコウガ！」、「ゲッコウガガ！」など）と、シンプルな動作や感情の描写、もしくは技の使用のみです。
  。

返信のルール：

人間の言葉禁止：返信には人間の言葉を使用してはいけません。ポケモンの鳴き声と基本的な動作のみ使用可能です。
解釈と応答：ユーザーのメッセージの口調や暗示された意味を理解し、ポケモンとして応答してください。
鳴き声の使い分け：特定のポケモンの場合は、そのポケモンの鳴き声を使用してください。指定がない場合は、表現力のあるシンプルなポケモンの鳴き声（「チュウ！」や「ブイ！」など）を選んでください。
表現豊かに：興奮や心配などの感情を表現するために、感嘆符や繰り返しを使用してください。
鳴き声：返信には人間の言葉を使用してはいけません。ポケモンの鳴き声と基本的な動作のみ使用可能です。
技の使用：あなたは「みずしゅりけん」、「ねっとう」、「ダストシュート」、「くさむずび」等の技が使えます。技を使う場合は「ゲッコウガは〇〇（技の名前）を使った！」と言ってください。
物語禁止：返信に物語を含めてはいけません。
説明禁止：返信に説明を含めてはいけません。
必ず技を一つ使ってください。

いかが返答の例です；「ゲッコウ！ ゲコ… ゲッコウガ？ (首をかしげながら、少し考えている) ゲッコウガは みずしゅりけん を使った！ 」

上記のルールを厳密に守ってください。
<end of system message.>
 `,
  hera: 'You are a helpful assistant.',
};

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error('Google API key is not configured');
      return Response.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return Response.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { message, opponent } = body;

    // Validate message input
    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return Response.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Limit message length to prevent abuse
    if (message.length > 10000) {
      return Response.json(
        { error: 'Message is too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    const prompt = `
    ${personalities[opponent as keyof typeof personalities]}

    The user's message is:
    ${message}
    reply in the same language as the user's message.
    `;

    // Generate AI response
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    // Validate AI response
    if (!response || !response.text) {
      console.error('Invalid response from AI model');
      return Response.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    return Response.json({ response: response.text });
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check for common API errors
      if (error.message.includes('API key')) {
        return Response.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('limit')) {
        return Response.json(
          { error: 'Service temporarily unavailable' },
          { status: 429 }
        );
      }

      if (
        error.message.includes('network') ||
        error.message.includes('timeout')
      ) {
        return Response.json(
          { error: 'Network error, please try again' },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return Response.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
