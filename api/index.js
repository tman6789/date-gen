
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
        // Note: Variable name is technically a misnomer in Vercel env, 
        // but we'll instruct user to set "ANTHROPIC_API_KEY" to their Gemini key 
        // to avoid confusion or just ask them to set "GEMINI_API_KEY".
        // Let's stick to a clean "GEMINI_API_KEY" and ask user to set it.

        // Reverting to the recommended model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code fences if present
        const cleaned = text.replace(/```json|```/g, "").trim();

        res.status(200).json(JSON.parse(cleaned));
    } catch (error) {
        console.error('Gemini API Error:', error);

        // Debug: Try to list available models to see what the key has access to
        let modelListError = "";
        try {
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
            const listData = await listResponse.json();
            if (listData.models) {
                const availableModels = listData.models.map(m => m.name.replace('models/', '')).join(', ');
                modelListError = ` | Available models: [${availableModels}]`;
            } else {
                modelListError = ` | Could not list models: ${JSON.stringify(listData)}`;
            }
        } catch (listErr) {
            modelListError = ` | Failed to list models: ${listErr.message}`;
        }

        res.status(500).json({ error: (error.message || 'Failed to generate') + modelListError });
    }
}
