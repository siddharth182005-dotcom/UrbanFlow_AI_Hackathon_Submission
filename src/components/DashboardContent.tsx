"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Car, TrendingUp, Clock, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function DashboardContent() {
  const [stats, setStats] = useState({
    activeHotspots: 0,
    totalImpact: 0,
    camerasOnline: 0,
    recentViolations: [] as any[],
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats({
          activeHotspots: data.kpis?.activeHotspots || 0,
          totalImpact: data.kpis?.avgImpact || 0,
          camerasOnline: 24, // keep mock for cameras since it's not in CSV
          recentViolations: data.recentViolations || [],
        });
      })
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400 mt-2 text-lg">Live City-Wide Congestion Overview: <span className="text-white font-medium">Bengaluru</span></p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
          className="bg-blue-600/80 backdrop-blur hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
          <Zap className="mr-2 text-yellow-300 animate-pulse" size={20} />
          <span className="relative z-10 neon-text-blue">Auto-Dispatch Tows</span>
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard variants={itemVariants} title="Active Hotspots" value={stats.activeHotspots} icon={AlertCircle} color="text-red-500" pulse />
        <StatCard variants={itemVariants} title="Avg Impact Score" value={`${stats.totalImpact}/100`} icon={TrendingUp} color="text-orange-500" />
        <StatCard variants={itemVariants} title="Cameras Online" value={stats.camerasOnline} icon={MapPin} color="text-emerald-500" />
        <StatCard variants={itemVariants} title="Avg Resolution Time" value="11m" icon={Clock} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map Area */}
        <motion.div variants={itemVariants} className="lg:col-span-2 min-h-[500px] glass-panel rounded-2xl p-1 overflow-hidden relative shadow-2xl glow-border-blue">
          <div className="absolute inset-0 bg-scanlines pointer-events-none z-0 opacity-30"></div>
          
          {/* Radar Sweep Effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] radar-sweep opacity-20 pointer-events-none z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981] mr-2"></span>
              Live Gridlock Radar
            </h2>
          </div>
          <div className="relative z-10 h-full w-full">
            <MapComponent />
          </div>
        </motion.div>

        {/* Recent Violations Feed */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 flex flex-col shadow-2xl border border-slate-700/50 h-[500px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="mr-2 text-red-500" size={20} />
            Critical Violations
          </h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {stats.recentViolations.map((v: any, i: number) => (
              <motion.div 
                key={v.id} 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.1), type: 'spring' }}
                whileHover={{ scale: 1.02, x: -5 }}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white text-sm">{v.location}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.impact > 85 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                    Impact: {v.impact}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center bg-slate-900 px-2 py-1 rounded-md border border-slate-700"><Car size={12} className="mr-1 text-slate-300"/> {v.vehicle}</span>
                  <span className="font-medium text-slate-500">{v.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, variants, pulse }: any) {
  const shadowColor = color === "text-red-500" ? "rgba(239, 68, 68, 0.4)" : 
                      color === "text-emerald-500" ? "rgba(16, 185, 129, 0.4)" :
                      color === "text-orange-500" ? "rgba(249, 115, 22, 0.4)" : "rgba(59, 130, 246, 0.4)";
                      
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5, scale: 1.02, boxShadow: `0 0 25px ${shadowColor}`, borderColor: shadowColor }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
    >
      <div className={`absolute -right-4 -top-4 opacity-10 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 ${color}`}>
        <Icon size={100} />
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-slate-400 font-medium tracking-wide">{title}</h3>
        <Icon size={20} className={`${color} ${pulse ? 'animate-pulse drop-shadow-[0_0_8px_currentColor]' : ''}`} />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={`text-4xl font-bold text-white relative z-10 ${color === 'text-red-500' ? 'neon-text-red' : color === 'text-emerald-500' ? 'neon-text-emerald' : 'neon-text-blue'}`}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
