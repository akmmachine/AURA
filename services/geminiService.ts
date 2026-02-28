
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as per guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getStylingAdvice = async (productName: string, query: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a high-end fashion stylist for the brand AURA. 
      The customer is looking at the "${productName}". 
      They ask: "${query}". 
      Provide a concise, stylish, and helpful advice (max 100 words) that encourages them to style it well with minimalist aesthetics.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    // Fix: Correctly access the .text property
    return response.text;
  } catch (error) {
    console.error("AI Stylist Error:", error);
    return "I'm having trouble connecting to my creative side right now. But generally, minimalist pieces pair best with monochromatic tones and structured accessories.";
  }
};

export const getSmartRecommendations = async (cartItems: string[]) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on a shopping cart containing: ${cartItems.join(', ')}. 
      Recommend 3 types of items (e.g., "leather boots", "silk scarf") that would complete this minimalist look. 
      Return the response as a JSON array of strings only.`,
      config: {
        responseMimeType: "application/json",
        // Fix: Use responseSchema as recommended by the guidelines
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return ["Structured Tote", "Leather Chelsea Boots", "Silk Pocket Square"];
  }
};
