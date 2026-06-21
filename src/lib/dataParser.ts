import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export interface TrafficEvent {
  id: string;
  event_type: string;
  latitude: number;
  longitude: number;
  address: string;
  event_cause: string;
  start_datetime: string;
  status: string;
  veh_type: string;
  impact: number;
  time: string;
}

let cachedEvents: TrafficEvent[] | null = null;

export function getTrafficEvents(): TrafficEvent[] {
  if (cachedEvents) return cachedEvents;

  const csvPath = path.join(process.cwd(), 'src', 'data', 'astram_events.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn("CSV file not found at", csvPath);
    return [];
  }

  const csvFile = fs.readFileSync(csvPath, 'utf8');
  
  const results = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  });

  const parsedEvents: TrafficEvent[] = (results.data as any[])
    .filter(row => row.latitude && row.longitude && row.latitude !== '0' && row.longitude !== '0' && row.latitude !== 'NULL')
    .map(row => {
      let impactScore = 50;
      if (row.priority === 'High') impactScore += 30;
      if (row.event_cause === 'accident') impactScore += 15;
      if (row.status === 'closed' || row.status === 'resolved') impactScore -= 20;
      
      impactScore = Math.max(0, Math.min(100, impactScore));
      
      const eventDate = new Date(row.start_datetime);
      let friendlyTime = 'Unknown';
      if (eventDate.getTime()) {
         friendlyTime = eventDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }

      return {
        id: row.id || `evt_${Math.random()}`,
        event_type: row.event_type || 'unknown',
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        address: row.address || 'Unknown Location',
        event_cause: row.event_cause || 'other',
        start_datetime: row.start_datetime,
        status: row.status || 'open',
        veh_type: row.veh_type || 'Unknown Vehicle',
        impact: impactScore,
        time: friendlyTime,
        _rawDate: eventDate.getTime() || 0,
      };
    })
    .sort((a, b) => (b as any)._rawDate - (a as any)._rawDate);

  cachedEvents = parsedEvents;
  return parsedEvents;
}
