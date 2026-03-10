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
  Database,
  Bell,
  Sparkles,
  Command,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("intelligence");
  const [filterStatus, setFilterStatus] = useState("All");

  const agents = [
    { id: 'arkel', name: 'ARKEL', status: 'Online', color: 'bg-green-500' },
    { id: 'claudia', name: 'CLAVE_AI', status: 'Processing', color: 'bg-brand-cyan' },
    { id: 'bot_01', name: 'ELITE_BOT', status: 'Idle', color: 'bg-white/20' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-brand-cyan/30 overflow-hidden relative">
      <div className="absolute inset-0 cyber-grid z-0 opacity-40 hover:opacity-100 transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(112,0,255,0.1),transparent_50%)] z-0" />
      <div className="scanline" />

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
          <NavIcon icon={<LayoutDashboard size={20} />} active={activeTab === "intelligence"} onClick={() => setActiveTab("intelligence")} tooltip="Intelligence" />
          <NavIcon icon={<Users size={20} />} active={activeTab === "leads"} onClick={() => setActiveTab("leads")} tooltip="Lead Manager" />
          <NavIcon icon={<MessageCircle size={20} />} active={activeTab === "chat"} onClick={() => setActiveTab("chat")} tooltip="Omni-Inbox" />
          <NavIcon icon={<Target size={20} />} active={activeTab === "automation"} onClick={() => setActiveTab("automation")} tooltip="Workflows" />
          <NavIcon icon={<Database size={20} />} active={activeTab === "infra"} onClick={() => setActiveTab("infra")} tooltip="Infra Health" />
        </nav>

        <div className="mt-auto space-y-6 pb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[8px] font-bold">AK</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto z-10 relative custom-scrollbar">
        <header className="sticky top-0 p-8 flex justify-between items-center backdrop-blur-md bg-black/20 z-40 border-b border-white/5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4">
              <div className="px-2 py-1 bg-brand-cyan/10 border border-brand-cyan/20 text-[10px] font-black text-brand-cyan uppercase tracking-widest">Node_07</div>
              <h1 className="text-sm font-black tracking-[0.3em] uppercase opacity-50">CLAVE_OS // INTEL_CORE</h1>
            </div>
          </motion.div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex items-center gap-6 font-mono text-[10px] text-white/30 tracking-tighter">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse" />
                SYNC_LIVE
              </div>
              <div>BUFF_LOAD: 0.04s</div>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <button className="p-2 text-white/40 hover:text-brand-cyan transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-pink rounded-full border border-black" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 242, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-cyan text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Plus size={14} />
                Capturar Lead
              </motion.button>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 space-y-20">
          <section>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <h2 className="text-[120px] font-black tracking-[-0.08em] leading-[0.8] mb-4 text-glow-cyan" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                LEADS<br /><span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>MASTER</span>
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">
                <Zap size={14} className="text-brand-cyan" />
                Agencia de Inteligencia Comercial_v.5.0
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-1 bg-white/5 border border-white/10">
              <MetricBlock label="Total Capturados" value="12,842" sub="+14% MoM" icon={<Users className="text-brand-cyan" />} />
              <MetricBlock label="Tasa de Cierre" value="84.2%" sub="Alpha Target" icon={<Target className="text-brand-pink" />} />
              <MetricBlock label="Ingreso Proyectado" value="$1.2M" sub="Verified" icon={<TrendingUp className="text-brand-purple" />} />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">Flujo de Reconocimiento</h3>
                  <p className="text-xs text-white/40 font-mono tracking-tighter">Gestionando 142 leads en el pipeline activo.</p>
                </div>

                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xs">
                  {["All", "MQL", "SQL", "Qualified"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-white text-black leading-none' : 'text-white/40 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <LeadRow name="Santiago Del Río" email="s.delrio@nexus.corp" phone="+52 33 4415 1396" source="Instagram_Elite" score={98} type="SQL" status="Nuevo" />
                <LeadRow name="Victoria Valenzuela" email="v.val@lux.mx" phone="+52 33 1256 9876" source="GoogleSearch_Pro" score={84} type="MQL" status="Analizando" />
                <LeadRow name="Inversiones Omega" email="hq@omega.global" phone="+52 55 9876 5432" source="WhatsApp_Direct" score={92} type="Qualified" status="Prioridad" />
                <LeadRow name="Marcos Galperin" email="m.galp@mkt.net" phone="+52 33 6677 8899" source="LinkedIn_Outreach" score={71} type="MQL" status="Recuperado" />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
              <div className="p-8 border border-white/10 bg-white/[0.02]">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-white/40">Connected_Channels</h4>
                <div className="grid grid-cols-2 gap-2">
                  <ChannelBadge icon={<MessageCircle size={10} />} name="WhatsApp" status="Active" color="text-green-500" />
                  <ChannelBadge icon={<Globe size={10} />} name="Messenger" status="Sync" color="text-brand-cyan" />
                  <ChannelBadge icon={<Mail size={10} />} name="Email_HQ" status="Active" color="text-green-500" />
                  <ChannelBadge icon={<Phone size={10} />} name="VoIP_Net" status="Offline" color="text-white/20" />
                </div>
              </div>

              <div className="p-8 border border-white/10 bg-white/[0.01]">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-white/40">Active_Team</h4>
                <div className="space-y-4">
                  {agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${agent.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{agent.name}</span>
                      </div>
                      <span className="text-[8px] font-mono opacity-30 group-hover:opacity-100 transition-opacity uppercase">{agent.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border border-white/5 bg-black">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-white/40">Sincronización_Live</h4>
                <div className="space-y-6">
                  <LogItem time="12:45" user="SYS_BOT" action="Lead Enriquecido" lead="Santiago D." />
                  <LogItem time="12:42" user="ARKEL" action="Mensaje WhatsApp" lead="Victoria V." />
                  <LogItem time="12:30" user="SYS_BOT" action="WebHook Captura" lead="Omega HQ" />
                  <LogItem time="11:58" user="SYSTEM" action="Database Backup" lead="GLOBAL" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
        <div className="px-4 py-2 bg-brand-cyan/20 border border-brand-cyan/30 backdrop-blur-md rounded-xs">
          <span className="text-[9px] font-black text-brand-cyan tracking-widest uppercase">Encryption: AES-256 Active</span>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon, active, onClick, tooltip }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-xs border transition-all duration-300 group ${active ? 'bg-white text-black border-white' : 'text-white/40 border-transparent hover:border-white/20'}`}
    >
      {icon}
      <div className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
        {tooltip}
      </div>
    </button>
  );
}

function MetricBlock({ label, value, sub, icon }: any) {
  return (
    <div className="p-8 bg-black hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">{label}</p>
      <h4 className="text-4xl font-black tracking-tighter mb-1">{value}</h4>
      <p className="text-[10px] font-bold text-brand-cyan opacity-60 tracking-widest">{sub}</p>
    </div>
  );
}

function LeadRow({ name, email, phone, source, score, type, status }: any) {
  const isHighInten = score >= 90;
  return (
    <motion.div
      whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,0.03)" }}
      className={`grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center border border-white/5 bg-white/[0.01] transition-all group ${isHighInten ? 'border-l-4 border-l-brand-cyan' : ''}`}
    >
      <div className="md:col-span-4 flex items-center gap-6">
        <div className={`w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center font-black text-lg transition-colors group-hover:border-brand-cyan ${isHighInten ? 'text-brand-cyan' : ''}`}>
          {name[0]}
        </div>
        <div>
          <h4 className="font-black text-lg uppercase tracking-tight leading-none mb-2 group-hover:text-brand-cyan transition-colors">{name}</h4>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/30 font-bold tracking-tighter">
            <span className="flex items-center gap-1"><Mail size={10} /> {email}</span>
            <span className="flex items-center gap-1"><Phone size={10} /> {phone}</span>
          </div>
        </div>
      </div>
      <div className="md:col-span-3">
        <p className="text-[9px] font-black text-white/30 uppercase mb-1">Fuente</p>
        <span className="text-xs font-bold text-white/60">{source}</span>
      </div>
      <div className="md:col-span-3 flex items-center gap-8 px-4 border-l border-r border-white/5">
        <div className="text-center">
          <p className="text-[9px] font-black text-white/30 uppercase mb-1">Score</p>
          <span className={`text-xl font-black ${isHighInten ? 'text-brand-cyan' : 'text-white/60'}`}>{score}</span>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-black text-white/30 uppercase mb-1">Tipo</p>
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white/60">{type}</span>
        </div>
      </div>
      <div className="md:col-span-2 flex items-center justify-end gap-6">
        <div className="text-right">
          <p className="text-[9px] font-black text-white/30 uppercase mb-1">{status}</p>
          <span className="text-[9px] text-brand-pink font-bold">ACCION</span>
        </div>
        <button className="p-3 bg-white/5 hover:bg-white text-white hover:text-black transition-all">
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function ChannelBadge({ icon, name, status, color }: any) {
  return (
    <div className="p-3 border border-white/5 bg-white/[0.02] flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white/20">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{name}</span>
      </div>
      <span className={`text-[9px] font-black uppercase ${color}`}>{status}</span>
    </div>
  );
}

function LogItem({ time, user, action, lead }: any) {
  return (
    <div className="flex items-center justify-between text-[10px] font-mono group py-1">
      <div className="flex items-center gap-4">
        <span className="text-white/20">{time}</span>
        <span className="text-brand-cyan font-black">[{user}]</span>
        <span className="text-white/60 group-hover:text-white transition-colors">{action}:</span>
      </div>
      <span className="font-bold text-brand-pink">{lead}</span>
    </div>
  );
}
