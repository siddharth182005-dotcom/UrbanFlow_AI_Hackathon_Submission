"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingDown, Clock, Car } from "lucide-react";

const tomtomData = [
  { time: '06:00', silkBoard: 35, krPuram: 40, hebbal: 42, avgSpeed: 35 },
  { time: '08:00', silkBoard: 12, krPuram: 18, hebbal: 16, avgSpeed: 18 },
  { time: '10:00', silkBoard: 4.5, krPuram: 8, hebbal: 11, avgSpeed: 14.6 }, // TomTom Morning Peak
  { time: '12:00', silkBoard: 15, krPuram: 22, hebbal: 24, avgSpeed: 20 },
  { time: '14:00', silkBoard: 18, krPuram: 25, hebbal: 22, avgSpeed: 22 },
  { time: '16:00', silkBoard: 14, krPuram: 18, hebbal: 19, avgSpeed: 18 },
  { time: '18:00', silkBoard: 5, krPuram: 7, hebbal: 9, avgSpeed: 13.2 }, // TomTom Evening Peak
  { time: '20:00', silkBoard: 8, krPuram: 12, hebbal: 14, avgSpeed: 16.6 },
];

const violationImpact = [
  { name: 'Silk Board', severity: 94, incidents: 145 },
  { name: 'KR Puram', severity: 88, incidents: 112 },
  { name: 'Hebbal', severity: 76, incidents: 98 },
  { name: 'Tin Factory', severity: 82, incidents: 85 },
];

import { useEffect, useState } from "react";
export default function UrbanFlowAnalyticsPage() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setChartData(data.chartData || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Traffic Incident Analytics</h1>
        <p className="text-slate-400 mt-1">Real-time Bengaluru traffic event data powered by Astram.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl border border-slate-700 border-l-4 border-l-red-500">
          <div className="flex items-center text-slate-400 mb-2"><Clock className="mr-2" size={18} /> Time Lost Per Year</div>
          <div className="text-3xl font-bold text-white">168 Hours</div>
          <p className="text-xs text-slate-500 mt-1">7 Days, 40 Mins stuck in traffic</p>
        </div>
        <div className="glass p-6 rounded-xl border border-slate-700 border-l-4 border-l-orange-500">
          <div className="flex items-center text-slate-400 mb-2"><TrendingDown className="mr-2" size={18} /> Avg Speed (Evening Rush)</div>
          <div className="text-3xl font-bold text-white">13.2 km/h</div>
          <p className="text-xs text-slate-500 mt-1">Silk board drops to 4.5 km/h</p>
        </div>
        <div className="glass p-6 rounded-xl border border-slate-700 border-l-4 border-l-blue-500">
          <div className="flex items-center text-slate-400 mb-2"><Car className="mr-2" size={18} /> Travel Time (per 10km)</div>
          <div className="text-3xl font-bold text-white">36m 09s</div>
          <p className="text-xs text-slate-500 mt-1">City-wide average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Graph */}
        <div className="glass p-6 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-6">Hourly Incident Volume vs Congestion</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.length > 0 ? chartData : tomtomData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={chartData.length > 0 ? "name" : "time"} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                {chartData.length > 0 ? (
                  <>
                    <Line type="monotone" dataKey="incidents" name="Incidents" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="congestion" name="Congestion Level" stroke="#f59e0b" strokeWidth={2} />
                  </>
                ) : (
                  <>
                    <Line type="monotone" dataKey="silkBoard" name="Silk Board" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="krPuram" name="KR Puram" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgSpeed" name="City Avg" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass p-6 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-6">Parking Violation Impact vs Incidents</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="severity" name="Impact Severity Score" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" name="Daily Incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
