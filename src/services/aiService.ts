import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;
  private readonly SYSTEM_PROMPT = `You are an expert Algorand smart contract developer. 
Generate accurate and production-ready code for Algorand smart contracts in both TypeScript and Python.
Always include proper error handling, comments, and follow best practices.
Format your response as JSON with 'typescript' and 'python' keys containing the respective code.`;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
  }

  async generateCode(prompt: string): Promise<{ typescript: string; python: string }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        typescript: response.typescript || '',
        python: response.python || ''
      };
    } catch (error) {
      console.error('Error generating code with AI:', error);
      throw error;
    }
  }
} 