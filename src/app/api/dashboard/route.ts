import { NextResponse } from 'next/server';
import { getTrafficEvents } from '@/lib/dataParser';

export async function GET() {
  const events = getTrafficEvents();

  if (!events || events.length === 0) {
    return NextResponse.json({ error: "No data available" }, { status: 500 });
  }

  // Active events (not closed or resolved)
  const activeEvents = events.filter(e => e.status !== 'closed' && e.status !== 'resolved');

  // KPI Calculations
  const totalIncidents = activeEvents.length;
  const criticalViolations = activeEvents.filter(e => e.impact > 70).length;
  
  // Calculate average impact score
  let totalImpact = 0;
  activeEvents.forEach(e => totalImpact += e.impact);
  const avgImpact = activeEvents.length > 0 ? Math.round(totalImpact / activeEvents.length) : 0;

  // Active Hotspots count
  const activeHotspots = activeEvents.filter(e => e.priority === 'High' || e.impact > 80).length;

  // Recent Violations (Top 5 most recent active events with high impact)
  const recentViolations = activeEvents
    .filter(e => e.impact > 60)
    .slice(0, 5)
    .map((e, index) => ({
      id: e.id,
      location: e.address.split(',')[0], // Just the first part of the address
      vehicle: e.veh_type,
      impact: e.impact,
      time: e.time,
      cause: e.event_cause
    }));

  return NextResponse.json({
    kpis: {
      totalIncidents,
      criticalViolations,
      avgImpact,
      activeHotspots
    },
    recentViolations
  });
}
