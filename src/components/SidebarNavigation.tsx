"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, BarChart3, Bot, Video, Settings, Activity } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Live CCTV", href: "/cctv", icon: Video },
  { name: "Heatmaps", href: "/heatmaps", icon: Map },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Copilot", href: "/copilot", icon: Bot },
  { name: "Forecasting", href: "/forecast", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Map className="text-blue-500 mr-2" size={24} />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-400">
          UrbanFlow AI
        </span>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              suppressHydrationWarning
              className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-blue-900/40 text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-full bg-blue-500 rounded-r-md shadow-[0_0_10px_#3b82f6]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon size={20} className={isActive ? "text-blue-400" : "group-hover:text-blue-400 transition-colors"} />
              <span className={`font-medium ${isActive ? "neon-text-blue" : ""}`}>{item.name}</span>
            </a>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Gridlock Hackathon Round 2<br />
        Built by the Elite Team
      </div>
    </div>
  );
}
