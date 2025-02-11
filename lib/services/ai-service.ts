import axios from 'axios';

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class AIService {
  private static readonly API_URL = "https://api.hyperbolic.xyz/v1/chat/completions";
  private static readonly API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlaWdodGJlcnJ5NjUzQGdtYWlsLmNvbSIsImlhdCI6MTczODI4NzYzM30.jYtowW2eL5VoNO8_-EFIL3hZzHUrd3PuIZmW7ySo6cY";

  static async generateStoreDetails(storeType: string, targetAudience: string) {
    try {
      const prompt = `Create a creative store name and description for a digital content store.
      Store Type: ${storeType}
      Target Audience: ${targetAudience}
      
      Format the response as JSON with:
      {
        "name": "A creative, memorable store name (max 30 characters)",
        "bio": "A compelling store description (max 150 characters)",
        "username": "A URL-friendly username based on the store name"
      }`;

      const response = await axios.post<DeepSeekResponse>(
        this.API_URL,
        {
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          model: "deepseek-ai/DeepSeek-R1-Zero",
          max_tokens: 508,
          temperature: 0.7,
          top_p: 0.9
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.API_KEY}`
          }
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("AI generation error:", error);
      throw error;
    }
  }
}