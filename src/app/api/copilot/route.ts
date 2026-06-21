import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getTrafficEvents } from '@/lib/dataParser';

// Initialize the Gemini client
// Note: Ensure GEMINI_API_KEY is in .env.local
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Extract context from our Astram dataset
    const events = getTrafficEvents();
    const activeEvents = events.filter(e => e.status !== 'closed' && e.status !== 'resolved');
    
    const totalIncidents = activeEvents.length;
    const criticalViolations = activeEvents.filter(e => e.impact > 70);
    
    // Create a context string for Gemini
    const contextStr = `
CURRENT TRAFFIC STATUS (Bengaluru):
- Total Active Incidents: ${totalIncidents}
- Critical Violations/Hotspots: ${criticalViolations.length}

Top 5 Most Critical Active Events:
${criticalViolations.slice(0, 5).map(e => `- ${e.event_type.toUpperCase()} at ${e.address.split(',')[0]} | Cause: ${e.event_cause} | Vehicle: ${e.veh_type} | Impact Score: ${e.impact}`).join('\n')}

INSTRUCTIONS:
You are "UrbanFlow AI Copilot", a highly advanced, Palantir Gotham-style AI assistant integrated into a futuristic traffic management dashboard.
You must:
1. Speak professionally, analytically, and concisely. Use military/tactical phrasing occasionally (e.g., "units dispatched", "anomaly detected").
2. Answer questions based on the CURRENT TRAFFIC STATUS provided above. If the user asks about traffic, reference the specific incidents above.
3. Be fully multilingual. If the user speaks in Hindi, Kannada, Spanish, etc., reply in that exact language but maintain the tactical persona.
4. If asked for recommendations, propose deploying specific resources (e.g., "Dispatching Rapid Response Unit 4", "Rerouting corridor traffic").
5. Format your output cleanly in Markdown. Use bolding for emphasis and bullet points for lists.
    `;

    // Format history for the new @google/genai SDK
    // The SDK expects { role: 'user' | 'model', parts: [{ text: string }] }
    // The incoming messages are { role: 'user' | 'assistant', text: string }
    const formattedHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Add the system instruction to the model configuration
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: contextStr,
        temperature: 0.3, // Keep it analytical
      }
    });

    return NextResponse.json({ 
      text: response.text || "I was unable to process that request." 
    });

  } catch (error: any) {
    console.error("Copilot API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process AI request" }, { status: 500 });
  }
}
