"use client";

import { Bell, Search, UserCircle, AlertTriangle } from "lucide-react";

export default function TopNav() {
  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center bg-slate-800 rounded-full px-4 py-2 w-96 border border-slate-700 focus-within:border-blue-500 transition-colors">
        <Search className="text-slate-400 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search by license plate, location, or camera..."
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
          suppressHydrationWarning
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse">
          <AlertTriangle size={14} className="mr-1.5" />
          2 Critical Hotspots
        </div>
        
        <button suppressHydrationWarning className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2 pl-4 border-l border-slate-700 cursor-pointer">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-white">Cmdr. Rajesh</div>
            <div className="text-xs text-slate-400">Traffic Ops</div>
          </div>
          <UserCircle size={32} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
