"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function HeatmapsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Bengaluru Congestion Heatmaps</h1>
          <p className="text-slate-400 mt-1">Live spatial visualization of parking violations across the city</p>
        </div>
      </div>

      <div className="glass rounded-xl p-2 border border-slate-700 bg-slate-800/50">
         <MapComponent fullScreen={true} />
      </div>
    </div>
  );
}
