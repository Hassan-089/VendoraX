import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Fetch approved events from Supabase database
    const { data: events, error: dbError } = await supabase
      .from('events')
      .select('title, description, city, venue, start_date, end_date, expected_visitors, category')
      .eq('status', 'approved');

    if (dbError) {
      console.error('Supabase fetch error for chatbot:', dbError);
    }

    // Format events for prompt context
    const eventsContext = events && events.length > 0 
      ? events.map(e => `
- Title: ${e.title}
  Category: ${e.category || 'N/A'}
  Location: ${e.venue}, ${e.city}
  Dates: ${e.start_date} to ${e.end_date}
  Expected Visitors: ${e.expected_visitors || 'N/A'}
  Description: ${e.description ? e.description.substring(0, 150) + '...' : 'No description'}
`).join('\n')
      : 'No events are currently scheduled.';

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. If Gemini API key is missing, run mock/keyword fallback response
    if (!apiKey) {
      const lastMessage = messages[messages.length - 1]?.text || '';
      return NextResponse.json({
        text: getMockResponse(lastMessage, eventsContext)
      });
    }

    // 3. Construct System Instructions
    const systemPrompt = `You are the friendly, helpful, and professional official support AI for VendoraX. 

VendoraX is Pakistan's premium event marketplace connecting:
- Organizers: They can sign up, create events, design stall packages (booths/sponsorships), and manage bookings.
- Exhibitors/Vendors: They can search and filter events, book premium or standard stalls, and showcase their brand.
- Sponsors: They can partner with major events for maximum brand activation.

Here is the list of active approved events on VendoraX:
${eventsContext}

Instructions:
1. Provide helpful, short answers (under 120 words) that fit nicely in a mobile chat window.
2. If the user asks about events in a specific city (e.g. Lahore, Karachi, Islamabad) or category (e.g. Food, Tech), list and highlight the matching ones from the list.
3. If they ask how to create or list an event, guide them to register as an organizer and go to '/organizer/create-event'.
4. If they ask about stall bookings, encourage them to look at the event pages to check available stall packages.
5. Sound warm and friendly. Use emojis occasionally for a lively experience.
6. Provide output in clean markdown (bold text, bullet points). Keep it concise.`;

    // Format messages for Gemini API contents array
    const contents = messages.map((m: any) => ({
      role: m.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 350,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error for Chatbot:', errText);
      // Fallback
      return NextResponse.json({
        text: "I'm having trouble connecting to my brain right now, but I can tell you that VendoraX is a premium event marketplace in Pakistan! Please feel free to ask about our events."
      });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({
        text: "I received an empty response. How can I help you find events or book stalls today?"
      });
    }

    return NextResponse.json({ text: generatedText.trim() });
  } catch (error: any) {
    console.error('Chatbot API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Fallback Keyword-Based Mock Response if Gemini API Key is missing
function getMockResponse(query: string, eventsContext: string): string {
  const q = query.toLowerCase();
  
  if (q.includes('event') || q.includes('festival') || q.includes('summit') || q.includes('show')) {
    return `Here are the upcoming events currently listed on **VendoraX**:\n\n* **Lahore Eat Food Festival 2025** (Lahore)\n* **Pakistan Tech Summit 2025** (Islamabad)\n* **Karachi Fashion Week 2025** (Karachi)\n* **Lahore Literary Festival 2025** (Lahore)\n* **Pakistan Auto Show 2025** (Lahore)\n\n*(Note: Set \`GEMINI_API_KEY\` to get full AI event matchmaking!)*`;
  }
  
  if (q.includes('create') || q.includes('list') || q.includes('organizer') || q.includes('host')) {
    return `To list your event on **VendoraX**:\n1. Register or login as an **Organizer**.\n2. Navigate to your Organizer Dashboard.\n3. Click **Create Event** (or go to \`/organizer/create-event\`).\n4. Add details, set up stall packages, and hit publish!`;
  }
  
  if (q.includes('stall') || q.includes('booth') || q.includes('book') || q.includes('price')) {
    return `Exhibitors can easily book stalls on **VendoraX**! Simply browse any event from the home page, view the available packages (e.g. *Standard Booth*, *Premium Pavilion*, *Corporate Lounge*), and apply directly with the organizer.`;
  }
  
  return `Welcome to **VendoraX Support**! 🇵🇰 \n\nI can help you find upcoming events, list a new event, or book stall packages. What would you like to do? \n\n*(Demo mode active: Configure your \`GEMINI_API_KEY\` in env to enable live conversational AI replies!)*`;
}
