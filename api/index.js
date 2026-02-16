
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-flash-latest as an alias to the best widely available model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code fences if present
        const cleaned = text.replace(/```json|```/g, "").trim();

        res.status(200).json(JSON.parse(cleaned));
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate date idea' });
    }
}
