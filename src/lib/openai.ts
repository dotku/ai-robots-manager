import OpenAI from 'openai';

// Initialize OpenAI client with the API key from environment variables
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getChatResponse(message: string): Promise<string> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI assistant embedded in a robot. Respond as if you are the robot's AI system. Keep responses concise and focused on helping users interact with the robot's features."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't process that request.";
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}