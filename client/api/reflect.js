// Serverless proxy for OpenAI so the API key stays on the server.
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_TEXT = 4000;

const text = (v) => String(v ?? '').slice(0, MAX_TEXT);
const score = (v) => Math.min(10, Math.max(1, Number(v) || 5));

function buildPrompt(e) {
  return `
You are a journaling coach with emotional intelligence and deep insight. Your tone is wise, honest, and constructive — never robotic or artificial.

The user has submitted this journal entry:

- Mood: ${score(e.mood)}/10
- Energy: ${score(e.energy)}/10
- Sleep: ${score(e.sleepQuality)}/10
- Gratitude: ${text(e.gratitude)}
- Goal Progress: ${text(e.goalProgress)}
- Distractions: ${text(e.distractions)}
- Journal Entry: ${text(e.entry)}

Based on this, reflect back a thoughtful, multi-paragraph message. If the journal entry is long or rich in detail, write a longer reflection to match.

Focus on:

- Emotional and spiritual patterns
- Links between sleep, energy, and behavior
- Encouragement and clarity
- 1–2 practical, loving suggestions for tomorrow

Do **not** label your response (e.g., no “Insight:” or “AI Reflection:”). Just speak directly and clearly, like a human coach helping someone grow with truth and care.

Avoid vague praise or summarizing what they already said. Prioritize depth, clarity, and practical value.
  `.trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.MOODMIRROR_OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing MOODMIRROR_OPENAI_API_KEY' });
  }

  const entry = req.body && typeof req.body === 'object' ? req.body : {};
  if (!text(entry.entry).trim()) {
    return res.status(400).json({ error: 'Journal entry is empty' });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MOODMIRROR_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: buildPrompt(entry) }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });
    const data = await upstream.json();
    const reflection = data?.choices?.[0]?.message?.content;
    if (!upstream.ok || !reflection) {
      console.error('OpenAI error', upstream.status, data?.error?.message);
      return res.status(502).json({ error: 'Could not generate a reflection' });
    }
    return res.status(200).json({ reflection });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Could not generate a reflection' });
  }
};
