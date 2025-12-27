
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNutritionAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Nutrition Assistant for the Nutrition Department at Universitas Al-Azhar Indonesia (UAI). Provide academic and clinical nutrition advice based on scientifically proven data. Be professional, encouraging, and informative.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, asisten AI sedang sibuk. Silakan coba lagi nanti.";
  }
};
