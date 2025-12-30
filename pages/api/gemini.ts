import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

// Accept either GEMINI_AIP_KEY (used earlier) or GEMINI_API_KEY (what you set in Netlify/UI)
const apiKeyFromAip = process.env.GEMINI_AIP_KEY;
const apiKeyFromApi = process.env.GEMINI_API_KEY;
const apiKey = apiKeyFromAip || apiKeyFromApi;

if (!apiKey) {
  // Keep the log generic — do NOT print the actual key.
  console.warn('Gemini API key not found in environment. Checked GEMINI_AIP_KEY and GEMINI_API_KEY.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured with Gemini API key (GEMINI_AIP_KEY or GEMINI_API_KEY).' });
  }

  try {
    const systemPrompt = `You are a world-class expert in Scalable Vector Graphics (SVG) design and coding.\nReturn ONLY the raw SVG code without any explanation or markdown fences.`;

    const fullPrompt = `Create an SVG representation of the following object/item: "${prompt}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
      },
    });

    const rawText = (response as any).text || '';
    const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
    const svg = svgMatch ? svgMatch[0] : rawText.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ svg });
  } catch (err: any) {
    // Try to surface a helpful error code/status without leaking secrets.
    console.error('Gemini API Error:', err?.message || err);

    const status = err?.status || err?.statusCode || err?.code || null;
    const message = err?.message || String(err || 'Unknown error');

    if (status === 401 || /unauthoriz/i.test(message)) {
      return res.status(401).json({ error: { message: 'Unauthorized to Gemini API', upstream: { code: status, message } } });
    }

    return res.status(500).json({ error: { message: 'Failed to generate SVG', upstream: { code: status, message } } });
  }
}
