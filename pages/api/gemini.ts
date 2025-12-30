import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_AIP_KEY;

if (!apiKey) {
  // Note: we don't throw at import time to keep dev server running, but handler will error.
  console.warn('GEMINI_AIP_KEY is not set. API route will fail without it.');
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
    console.error('Gemini API Error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to generate SVG' });
  }
}
