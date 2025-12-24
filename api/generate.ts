
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { prompt, aspectRatio = '1:1', isPro = false, apiKey } = body;

    // تحديد المفتاح: الأولوية للمفتاح المرسل في الطلب، ثم مفتاح البيئة
    const finalApiKey = apiKey || process.env.API_KEY;

    if (!finalApiKey) {
      return new Response(JSON.stringify({ 
        error: 'API Key is missing. Please provide "apiKey" in the request body or set it in server environment variables.' 
      }), { status: 401 });
    }

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: finalApiKey });
    const modelName = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const imageConfig: any = { aspectRatio };
    if (isPro) imageConfig.imageSize = "2K";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig }
    });

    let imageData = null;
    let mimeType = 'image/png';

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType;
          break;
        }
      }
    }

    if (!imageData) {
      // في حالة وجود رسائل نصية من النموذج (مثل رفض المحتوى)
      const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
      return new Response(JSON.stringify({ 
        error: textPart?.text || 'Failed to generate image' 
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      url: `data:${mimeType};base64,${imageData}`,
      prompt,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // للسماح بالطلبات من n8n بشكل أسهل
      }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
