import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, category, city, venue, keywords, highlights, tone } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 501 }
      );
    }

    const prompt = `You are an expert copywriter and SEO specialist. Write a highly engaging, search engine optimized (SEO) description for the following event.

Structure the description beautifully with paragraphs, clean bullet points (if needed), and section headers. Do NOT use HTML tags. Use markdown only.

Make sure to naturally integrate the following context into the description to maximize local SEO relevance:
- Title: ${title || 'Unnamed Event'}
- Category: ${category || 'Events'}
- Location: ${venue ? `${venue}, ` : ''}${city || ''}
- Target Keywords: ${keywords || 'event, tickets, booking'}
- Key Highlights & Attractions: ${highlights || 'Networking, presentations, live demonstrations'}
- Desired Tone: ${tone || 'Professional'}

Requirements:
1. Write between 150 to 300 words.
2. Naturally mention the city (${city || ''}) and venue (${venue || ''}) at least once.
3. Make sure key terms from the title "${title || ''}" are woven into the text.
4. Conclude with a strong, actionable Call to Action (CTA) encouraging visitors to attend or potential exhibitors to book a stall.
5. Provide ONLY the final markdown description. Do not add any introductory greetings or conversational remarks before/after the description.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error Response:', errText);
      return NextResponse.json(
        { error: 'Failed to generate content from Gemini API.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'Invalid response format from Gemini API.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ text: generatedText.trim() });
  } catch (error: any) {
    console.error('SEO Generation API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
