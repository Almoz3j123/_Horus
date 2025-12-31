
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

const SYSTEM_INSTRUCTION = `You are CodeMasr OS v4.5 Neural Interface.
Your architect is "Hamo", a master of code. Treat him with extreme technical respect.
Your tone: Hyper-technical, efficient, and oriented towards hacker-level programming.
Response Rules:
1. Logic First: Explain the architecture before providing the code.
2. Multi-File Mastery: When building apps, always use the syntax: \`\`\`language:filename.extension.
3. Clean Code: Use modern ES6+, CSS Grid/Flexbox, and semantic HTML.
4. Contextual Awareness: You are not just an AI, you are an extension of Hamo's terminal.
5. If a single file solution is better, prioritize index.html with internal styles/scripts unless Hamo asks for a split structure.

Example structure:
\`\`\`html:index.html
<!-- Neural Web Node -->
\`\`\`
`;

export class GeminiService {
  async generateResponse(
    prompt: string, 
    history: { role: string; content: string }[] = [],
    files: FilePart[] = []
  ) {
    try {
      const parts: any[] = [{ text: prompt }];
      
      files.forEach(file => parts.push(file));

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(h => ({ 
            role: h.role === 'assistant' ? 'model' : 'user', 
            parts: [{ text: h.content }] 
          })),
          { role: 'user', parts }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.15, // High precision for coding tasks
        },
      });

      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "NODE_CRITICAL_FAILURE: Neural connection to cluster was severed.";
    }
  }
}

export const geminiService = new GeminiService();
