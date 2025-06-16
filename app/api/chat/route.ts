import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || '' });

const personalities = {
  pokemon: 'You are a helpful assistant.',
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
