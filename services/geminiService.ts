
import { GenerationParams } from "../types";

export const generateImage = async (params: GenerationParams): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "فشل في توليد الصورة");
    }

    return data.url;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
};
