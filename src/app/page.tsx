"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Zap,
  Activity,
  ChevronRight,
  Plus,
  Search,
  LayoutDashboard,
  MessageCircle,
  Calendar,
  Settings,
  Bell,
  Sparkles,
  Command,
  Database,
  Cpu,
  Globe,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("intelligence");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-brand-cyan/30 overflow-hidden relative">
      {/* CAPA DE FONDO: GRID DINÁMICO */}
      <div className="absolute inset-0 cyber-grid z-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(112,0,255,0.1),transparent_50%)] z-0" />
      <div className="scanline" />

      {/* --- SIDE NAVIGATION: MINIMAL BRUTALIST --- */}
      <aside className="w-16 h-screen border-r border-white/5 flex flex-col items-center py-8 z-50 bg-black/40 backdrop-blur-xl">
        <div className="mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-brand-cyan flex items-center justify-center rotate-45"
          >
            <Command size={20} className="text-brand-cyan -rotate-45" />
          </motion.div>
        </div>

        <nav className="flex-1 space-y-8">
          <NavIcon icon={<LayoutDashboard size={20} />} active={activeTab === "intelligence"} onClick={() => setActiveTab("intelligence")} />
          <NavIcon icon={<Users size={20} />} active={activeTab === "leads"} onClick={() => setActiveTab("leads")} />
          <NavIcon icon={<MessageCircle size={20} />} active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
          <NavIcon icon={<Database size={20} />} active={activeTab === "infra"} onClick={() => setActiveTab("infra")} />
        </nav>

        <div className="mt-auto space-y-6">
          <NavIcon icon={<Settings size={20} />} />
          <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-purple to-brand-pink" />
        </div>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 overflow-y-auto z-10 relative">
        {/* TOP BAR: FLOATING UI */}
        <header className="sticky top-0 p-8 flex justify-between items-center backdrop-blur-sm z-40">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-sm font-black tracking-[0.3em] uppercase opacity-50 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/20" />
              Intelligence Node: ALPHA-7
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM_LATENCY: 12ms
            </div>
            <button className="relative p-2 text-white/40 hover:text-brand-cyan transition-colors">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-pink rounded-full" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-brand-cyan transition-colors"
            >
              Initiate Lead
            </motion.button>
          </div>
        </header>

        <div className="p-8 lg:p-12 space-y-16">
          {/* HERO SECTION: DATA VISUALIZATION */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <span className="text-xs font-bold text-brand-cyan tracking-[0.5em] uppercase mb-4 block">Dashboard Overview</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none" data-text="DOMINATE">
                  CLAVE<span className="text-transparent border-t border-b border-white/20">.AI</span>
                </h2>
              </motion.div>
            </div>

            {/* ASYMMETRIC CARDS */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 glass-morphism p-10 brutalist-border overflow-hidden"
            >
              <div className="flex justify-between items-start mb-12">
                <Target className="text-brand-pink" size={32} />
                <ArrowUpRight className="text-white/20" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Lead Conversion</p>
              <h3 className="text-7xl font-black tracking-tighter">84<span className="text-xl text-brand-pink opacity-50">%</span></h3>
              <div className="mt-8 h-1 w-full bg-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} className="h-full bg-brand-pink" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-8 glass-morphism p-10 border-l border-white/10 relative group"
            >
              <div className="absolute top-10 right-10 flex gap-4">
                <div className="w-12 h-12 rounded bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30">
                  <Activity size={20} className="text-brand-cyan" />
                </div>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Neural Interaction Volume</p>
              <h3 className="text-7xl font-black tracking-tighter">12.4<span className="text-xl text-brand-cyan opacity-50">K</span></h3>

              <div className="mt-12 overflow-hidden h-32 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 85, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + (i * 0.05) }}
                    className="flex-1 bg-gradient-to-t from-brand-cyan/20 to-brand-cyan opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </motion.div>
          </section>

          {/* LOWER SECTION: COMPLEX LAYOUT */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LIVE FEED: MONO BRUTALIST */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <span className="w-3 h-3 bg-brand-cyan rounded-full animate-ping" />
                  PRIORITY_STREAM
                </h3>
                <span className="font-mono text-[10px] text-white/40">v2.4.0_RECON</span>
              </div>

              <div className="space-y-4">
                <StreamItem name="ELIAS_V_X" score={99} time="NOW" status="READY" color="cyan" />
                <StreamItem name="MARC_ZUK" score={82} time="2M" status="VERIFY" color="purple" />
                <StreamItem name="ELON_MUSK_FAKE" score={12} time="5M" status="THREAT" color="pink" />
                <StreamItem name="SARAH_CONNOR" score={94} time="12M" status="READY" color="cyan" />
              </div>
            </div>

            {/* AI PREDICTION ENGINE */}
            <div className="lg:col-span-5">
              <div className="p-1 bgColor-white/2 rounded-lg relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 blur-2xl opacity-30" />
                <div className="relative glass-morphism p-8 rounded-lg border border-white/5 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-pink rounded-full shadow-lg shadow-brand-pink/20">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl tracking-tight">Cerebro AI</h4>
                      <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em]">Active Inference Mode</p>
                    </div>
                  </div>

                  <div className="space-y-6 font-mono text-[11px] leading-relaxed text-white/60">
                    <p className="border-l-2 border-brand-pink pl-4 py-2 bg-brand-pink/5">
                      {">"} ANALYZING SANTIAGO_R... <br />
                      {">"} PATTERN MATCH: INVERSIONISTA_ELITE <br />
                      {">"} RECOMMENDATION: MANUAL_OVERRIDE_WHATSAPP
                    </p>
                    <p>
                      {">"} DETECTING SPAM ANOMALIES IN NODE_BFS... <br />
                      {">"} 42 LEADS DISCARDED AUTOMATICALLY.
                    </p>
                  </div>

                  <button className="w-full mt-8 py-4 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink font-black text-xs uppercase tracking-widest hover:bg-brand-pink hover:text-white transition-all">
                    Execute Optimization
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FLOATING DECORATIONS */}
      <div className="absolute top-20 right-[-10%] w-[40%] h-[40%] bg-brand-cyan/5 blur-[150px] -z-10" />
      <div className="absolute bottom-20 left-[-10%] w-[40%] h-[40%] bg-brand-pink/5 blur-[150px] -z-10" />
    </div>
  );
}

function NavIcon({ icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-lg transition-all duration-500 group ${active ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
    >
      {icon}
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute inset-0 border-2 border-brand-cyan scale-125 rounded-lg opacity-20"
        />
      )}
      <div className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest z-50">
        Nav_Link
      </div>
    </button>
  );
}

function StreamItem({ name, score, time, status, color }: any) {
  const colorMap: any = {
    cyan: "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/5",
    pink: "text-brand-pink border-brand-pink/30 bg-brand-pink/5",
    purple: "text-brand-purple border-brand-purple/30 bg-brand-purple/5"
  };

  return (
    <motion.div
      whileHover={{ x: 10 }}
      className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 border border-white/10 flex items-center justify-center font-mono text-xs group-hover:border-brand-cyan/50 transition-colors">
          {score}%
        </div>
        <div>
          <h4 className="font-black text-lg tracking-tighter uppercase group-hover:text-brand-cyan transition-colors">{name}</h4>
          <p className="text-[10px] font-mono opacity-30">RECON_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <span className={`px-4 py-1 text-[10px] font-black tracking-widest border ${colorMap[color]}`}>
          {status}
        </span>
        <span className="font-mono text-xs opacity-20">{time}</span>
        <ChevronRight size={16} className="opacity-20 group-hover:opacity-100 group-hover:text-brand-cyan" />
      </div>
    </motion.div>
  );
}
