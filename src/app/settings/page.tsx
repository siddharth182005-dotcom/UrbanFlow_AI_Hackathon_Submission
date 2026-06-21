"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Shield, Camera, Bell, Link as LinkIcon, Database } from "lucide-react";

export default function SettingsPage() {
  const [towThreshold, setTowThreshold] = useState(85);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-slate-400 mt-1">Manage API integrations, thresholds, and AI tolerances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Integration Settings */}
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center mb-4">
            <LinkIcon className="mr-2 text-blue-500" size={20} /> Integration Keys
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Google Gemini API Key</label>
              <input type="password" value="AIzaSy...vXYZ" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Mapbox Access Token</label>
              <input type="password" placeholder="pk.eyJ1Ijoi..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* AI & Enforcement Thresholds */}
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center mb-4">
            <Shield className="mr-2 text-emerald-500" size={20} /> Enforcement Thresholds
          </h2>
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                <span>Auto-Dispatch Tow Truck (Impact Score)</span>
                <span className="text-red-400 font-bold">{towThreshold}+</span>
              </label>
              <input 
                type="range" min="50" max="100" value={towThreshold} onChange={(e) => setTowThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
              />
              <p className="text-xs text-slate-500 mt-2">Vehicles exceeding this impact score will automatically trigger a tow truck dispatch via the Traffic Police API.</p>
            </div>
            
            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <div>
                <p className="text-sm font-medium text-white">Strict Mode (Peak Hours)</p>
                <p className="text-xs text-slate-400">Lower tolerance during 8AM-11AM & 5PM-8PM</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center">
          <Save className="mr-2" size={18} /> Save Configuration
        </button>
      </div>
    </motion.div>
  );
}
