import { NextResponse } from 'next/server';
import { getTrafficEvents } from '@/lib/dataParser';

export async function GET() {
  const events = getTrafficEvents();

  if (!events || events.length === 0) {
    return NextResponse.json({ error: "No data available" }, { status: 500 });
  }

  // Aggregate incidents by Hour of the Day (0-23)
  const hourlyData = Array(24).fill(0).map((_, i) => ({
    name: `${i.toString().padStart(2, '0')}:00`,
    congestion: 20 + Math.floor(Math.random() * 20), // Base congestion
    incidents: 0
  }));

  events.forEach(e => {
    const date = new Date(e.start_datetime);
    if (date.getTime()) {
      const hour = date.getHours();
      hourlyData[hour].incidents += 1;
      // Bump congestion based on incidents
      hourlyData[hour].congestion = Math.min(100, hourlyData[hour].congestion + 5);
    }
  });

  return NextResponse.json({ chartData: hourlyData });
}
