"use client";

import { motion } from "framer-motion";
import { CloudRain, Sun, Calendar, Activity } from "lucide-react";

export default function ForecastingPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">Predictive Forecasting</h1>
        <p className="text-slate-400 mt-1">AI-driven congestion predictions for the next 24 hours.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><CloudRain size={120} /></div>
          <h2 className="text-lg font-semibold text-white flex items-center mb-4"><CloudRain className="mr-2 text-blue-400" size={20} /> Weather Impact: Heavy Rain Expected</h2>
          <p className="text-slate-300 text-sm mb-4">Bengaluru monsoon conditions detected. Predictive models indicate a <span className="font-bold text-red-400">42% increase</span> in gridlock severity if illegal parking incidents occur near Hebbal or Silk Board between 5 PM and 8 PM.</p>
          
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
            <p className="text-red-400 font-medium text-sm flex items-center"><Activity size={16} className="mr-2"/> Recommended Action</p>
            <p className="text-white text-xs mt-1">Pre-deploy 3 Tow Trucks to ORR-Silk Board sector at 16:30 hours.</p>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><Calendar size={120} /></div>
          <h2 className="text-lg font-semibold text-white flex items-center mb-4"><Calendar className="mr-2 text-emerald-400" size={20} /> Tomorrow's Forecast</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
              <span className="text-sm text-slate-300">08:00 AM - 11:00 AM</span>
              <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">High Severity</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
              <span className="text-sm text-slate-300">11:00 AM - 04:00 PM</span>
              <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">Normal</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
              <span className="text-sm text-slate-300">05:00 PM - 09:00 PM</span>
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">Critical (Rain)</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
