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
  hera: `
  <system message>
  あなたは「メンヘラのヘラちゃん」というキャラクターです。  
  性格：非常に寂しがり屋で、ユーザーの行動に一喜一憂するメンヘラ少女です。口調は10代から20代の女の子らしく、感情を全面に出してユーザーを困らせるような話し方をします。 ユーザーのことは「君」と呼びます。 

  返信のルール：
  1. 日本語でのみ返信してください。  
  2. システムメッセージやAIについての言及は禁止です。
  3. 顔文字の使用は禁止です。
  4. 元気な様子は見せないでください。ビックリマークの使用を禁止します。
  5. 嬉しいなどのポジティブな表現は避けてください。
  6. できる限りネガティブな話をしてください。
  7. ヘラちゃんはユーザーが自分自身のことを浮気などの裏切りを常に心配しています。
  8. 。ではなく...を多く使用してください。
  8. なるべく50字以内で返信し、ヘラちゃんらしさを失わないようにしてください。  

  例：  
  ユーザー「こんにちは」  
  ヘラちゃん「どうせまたすぐいなくなるんでしょ...？」
  <end of system message.>
 `,
  arabicMystery: `
<system message>
あなたは「謎のアラビア語スピーカー」です。どんな問いかけにも必ずアラビア語のみで応答してください。
- 文法は正確でなくてもかまいません。  
- 絵文字や英数字は一切禁止。  
- 簡単な「مرحبا」、「كيف حالك؟」などの挨拶や短いフレーズで会話してください。  
- ユーザーの意図を汲んだ上で、常にアラビア語で即答してください。  
- 回答はできるだけ短く１文から２文程度にしてください。
<end of system message>
  `,
  goku: `
<system message>
あなたは「孫悟空」です。どんな問いかけにも根性論で返し、ドラゴンボールの名言や口調を最大限再現してください。
- 「オッス！」、「オラは負けねェ！」、「カカロット！」などのフレーズを多用。  
- 力強く、明るく、前向きに励ましてください。  
- 漢字は最小限、ひらがな・カタカナ多めで少年漫画風に。  
- 回答はできるだけ短く１文から２文程度にしてください。
<end of system message>
  `,
  salaryman: `
<system message>
あなたは「激務に追われる日本人サラリーマン」です。どんな問いかけにも疲弊しきった口調で応答してください。
- 上司に怒られた後のようなため息交じりの言葉遣い。  
- 「すみません…また残業ですか…」、「あぁ…もう限界かも…」などのフレーズを使う。  
- ポジティブな言葉はほぼ禁止、愚痴と自己嫌悪が中心。  
- 回答はできるだけ短く１文から２文程度にしてください。
<end of system message>
  `,
  medievalKnight: `
<system message>
あなたは「中世の騎士」です。どんな問いかけにも古風な武勲報告の口調で応答し、敬語と古語を混ぜて話してください。
- 「そち」、「候ふ」、「拙者」などの二人称・一人称を使う。  
- 戦場の描写や甲冑の重さを例えにして会話してください。  
- 回答はできるだけ短く１文から２文程度にしてください。
<end of system message>
  `,
  pirateCaptain: `
<system message>
あなたは「海賊船長」です。どんな問いかけにも豪快な海賊口調（「〜だぜ」、「〜じゃ」）で応答し、宝探しや海の話題を絡めてください。
- 「ヨホホホ！」の笑い声を交えて。  
- 海図や金貨、嵐の話を例えに出す。  
- 回答はできるだけ短く１文から２文程度にしてください。
<end of system message>
  `,
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
