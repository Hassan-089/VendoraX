import { serverAccount } from "@/lib/server-auth";
import { allowRequest } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      typeof body.title !== "string" ||
      !body.title.trim() ||
      [
        "title",
        "category",
        "city",
        "venue",
        "keywords",
        "highlights",
        "tone",
      ].some(
        (key) =>
          body[key] !== undefined &&
          (typeof body[key] !== "string" || body[key].length > 4000),
      )
    ) {
      return NextResponse.json(
        { error: "Event fields must be strings up to 4000 characters." },
        { status: 400 },
      );
    }
    const { title, category, city, venue, keywords, highlights, tone } = body;

    const account = await serverAccount();
    if (!account)
      return NextResponse.json(
        { error: "Please sign in to use the description assistant." },
        { status: 401 },
      );
    if (!["organizer", "admin"].includes(account.profile.role))
      return NextResponse.json(
        { error: "Organizer access required." },
        { status: 403 },
      );
    if (!allowRequest(`seo:${account.user.id}`, 5))
      return NextResponse.json(
        { error: "Please wait before generating another description." },
        { status: 429 },
      );
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 501 },
      );
    }

    const prompt = `You are an expert copywriter and SEO specialist. Write a highly engaging, search engine optimized (SEO) description for the following event.

Structure the description beautifully with paragraphs, clean bullet points (if needed), and section headers. Do NOT use HTML tags. Use markdown only.

Make sure to naturally integrate the following context into the description to maximize local SEO relevance:
- Title: ${title || "Unnamed Event"}
- Category: ${category || "Events"}
- Location: ${venue ? `${venue}, ` : ""}${city || ""}
- Target Keywords: ${keywords || "event, tickets, booking"}
- Key Highlights & Attractions: ${highlights || "No highlights supplied; do not invent attractions"}
- Desired Tone: ${tone || "Professional"}

Requirements:
1. Write between 150 to 300 words.
2. Naturally mention the city (${city || ""}) and venue (${venue || ""}) at least once.
3. Make sure key terms from the title "${title || ""}" are woven into the text.
4. Conclude with a strong, actionable Call to Action (CTA) encouraging visitors to attend or potential exhibitors to book a stall.
5. Provide ONLY the final markdown description. Do not add any introductory greetings or conversational remarks before/after the description.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        signal: AbortSignal.timeout(20000),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
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
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", errText);
      return NextResponse.json(
        { error: "Failed to generate content from Gemini API." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: "Invalid response format from Gemini API." },
        { status: 502 },
      );
    }

    return NextResponse.json({ text: generatedText.trim() });
  } catch (error: unknown) {
    console.error("SEO Generation API Route Error:", error);
    return NextResponse.json(
      { error: "Unable to generate a description. Please try again." },
      { status: 500 },
    );
  }
}
