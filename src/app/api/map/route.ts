import { NextResponse } from 'next/server';
import { getTrafficEvents } from '@/lib/dataParser';

export async function GET() {
  const events = getTrafficEvents();

  if (!events || events.length === 0) {
    return NextResponse.json({ error: "No data available" }, { status: 500 });
  }

  // Active events mapped for the MapComponent
  const activeEvents = events.filter(e => e.status !== 'closed' && e.status !== 'resolved');

  // Take the top 50 active events so we don't overload Leaflet
  const hotspots = activeEvents.slice(0, 50).map(e => {
    let statusLabel = "Warning";
    if (e.impact >= 80) statusLabel = "Critical";
    if (e.impact <= 40) statusLabel = "Normal";

    return {
      id: e.id,
      position: [e.latitude, e.longitude],
      impact: e.impact,
      cause: e.event_cause,
      status: statusLabel,
      address: e.address.split(',')[0],
      vehicle: e.veh_type
    };
  });

  return NextResponse.json({ hotspots });
}
