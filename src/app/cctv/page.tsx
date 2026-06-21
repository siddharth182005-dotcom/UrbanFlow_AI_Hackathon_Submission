"use client";

import { motion } from "framer-motion";
import { Camera, AlertTriangle, ShieldAlert, Crosshair } from "lucide-react";
import { useState, useEffect } from "react";

export default function LiveCCTVPage() {
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <span className={`w-3 h-3 bg-red-500 rounded-full mr-3 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity duration-300`}></span>
            Live CCTV Feeds (Bengaluru)
          </h1>
          <p className="text-slate-400 mt-1">Real-time YOLOv11 & ByteTrack Inference Pipeline</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center">
          <ShieldAlert className="text-emerald-500 mr-2" size={18} />
          <span className="text-sm font-medium text-white">System Active: 182 Cameras</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-xl overflow-hidden border border-slate-700/50 relative bg-slate-900 aspect-video shadow-2xl flex items-center justify-center group">
            {/* Native Local Video Feed */}
            {mounted && (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen"
              >
                <source src="/traffic.mp4" type="video/mp4" />
              </video>
            )}

            {/* Mock YOLO UI Overlay */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded font-mono border border-slate-700">CAM-SILK-01 (Silk Board)</span>
              <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded font-mono font-bold animate-pulse">DETECTING VIOLATIONS</span>
            </div>
            
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-black/70 text-green-400 text-xs px-2 py-1 rounded font-mono border border-slate-700">60 FPS | 14ms Latency</span>
            </div>

            {/* Simulating Bounding Boxes */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="absolute top-[40%] left-[30%] w-32 h-24 border-2 border-red-500 bg-red-500/20 flex flex-col justify-end p-1 z-20"
            >
              <span className="text-[10px] font-mono font-bold text-white bg-red-500 px-1 w-max">TRUCK - 0.96 (ILLEGAL PARK: 25m)</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="absolute top-[60%] left-[60%] w-20 h-16 border-2 border-emerald-500 bg-emerald-500/20 flex flex-col justify-end p-1 z-20"
            >
              <span className="text-[10px] font-mono font-bold text-white bg-emerald-500 px-1 w-max">CAR - 0.88</span>
            </motion.div>

            {/* Crosshair Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-10">
              <Crosshair size={200} className="text-blue-500 animate-spin-slow" />
            </div>

            <p className="absolute bottom-4 right-4 text-white/50 font-mono text-xs z-10">[Live ByteTrack Feed Simulated]</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="glass rounded-xl aspect-video border border-slate-700/50 relative bg-slate-900 overflow-hidden">
               {mounted && (
                 <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale">
                   <source src="/traffic.mp4" type="video/mp4" />
                 </video>
               )}
               <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1 rounded font-mono z-10">CAM-KRP-04 (KR Puram)</span>
             </div>
             <div className="glass rounded-xl aspect-video border border-slate-700/50 relative bg-slate-900 overflow-hidden">
               {mounted && (
                 <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" style={{ animationDelay: '-2s' }}>
                   <source src="/traffic.mp4" type="video/mp4" />
                 </video>
               )}
               <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1 rounded font-mono z-10">CAM-HEB-02 (Hebbal)</span>
             </div>
          </div>
        </div>

        {/* Live Detections Feed */}
        <div className="glass rounded-xl p-4 flex flex-col shadow-xl border border-slate-700/50 h-[calc(100vh-12rem)]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-slate-700 pb-2">
            <AlertTriangle className="mr-2 text-orange-500" size={18} />
            Live Violation Log
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
             {[
               {id: 1, loc: "Silk Board", type: "Truck (Double Park)", time: "Just now", impact: 94.5, spd: "Dropped to 4.5 km/h"},
               {id: 2, loc: "Hebbal Flyover", type: "Bus (Blocked Lane)", time: "2m ago", impact: 88.0, spd: "Dropped to 11 km/h"},
               {id: 3, loc: "KR Puram", type: "Car (No Parking Zone)", time: "5m ago", impact: 76.0, spd: "Dropped to 13.2 km/h"},
               {id: 4, loc: "Tin Factory", type: "Auto (Bus Stop)", time: "8m ago", impact: 82.0, spd: "Dropped to 9 km/h"},
               {id: 5, loc: "Silk Board", type: "Delivery Van", time: "12m ago", impact: 65.5, spd: "Dropped to 14.6 km/h"},
             ].map((log, i) => (
               <motion.div 
                 key={log.id}
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
               >
                 <div className="flex justify-between items-start mb-1">
                   <span className="font-bold text-white text-sm">{log.loc}</span>
                   <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">{log.time}</span>
                 </div>
                 <p className="text-xs text-red-400 font-medium">{log.type}</p>
                 <div className="flex justify-between items-center mt-2">
                   <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1 rounded">{log.spd}</span>
                   <span className="text-xs font-bold text-orange-400">Impact: {log.impact}</span>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
