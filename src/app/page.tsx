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
  LogOut,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-dark-bg text-white selection:bg-brand-cyan/30 mesh-gradient noise-bg">
      {/* Sidebar de Élite */}
      <aside className="w-20 lg:w-64 border-r border-white/5 glass-panel flex flex-col h-screen sticky top-0 z-50 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-cyan to-brand-pink rounded-xl flex items-center justify-center p-2 shadow-lg shadow-brand-cyan/20">
            <Zap className="fill-white" />
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-tighter">CLAVE<span className="text-brand-cyan">.AI</span></span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={22} />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <NavItem icon={<Users size={22} />} label="Leads" active={activeTab === "leads"} onClick={() => setActiveTab("leads")} />
          <NavItem icon={<MessageCircle size={22} />} label="Conversaciones" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
          <NavItem icon={<Calendar size={22} />} label="Calendario" active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} />
          <div className="pt-6 pb-2 px-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 hidden lg:block">Sistema</div>
          <NavItem icon={<Settings size={22} />} label="Ajustes" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 p-2 lg:px-4">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-[10px] font-bold">AK</div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold">Agente Arkel</p>
              <p className="text-[10px] text-gray-500">Nivel Diamante</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <LogOut size={20} />
            <span className="text-sm font-medium hidden lg:block">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 lg:p-10">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-cyan transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar leads por nombre o ID..."
              className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm w-80 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-pink rounded-full border-2 border-dark-bg"></span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-cyan to-brand-cyan/80 text-black font-bold text-sm shadow-lg shadow-brand-cyan/20 flex items-center gap-2"
            >
              <Plus size={18} />
              Nuevo Lead
            </motion.button>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              Command Center
              <Sparkles className="text-brand-pink animate-pulse" size={24} />
            </h2>
            <p className="text-gray-400">Panel de control de inteligencia de ventas en tiempo real.</p>
          </div>

          {/* Stats Grid con Animación Staggered */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <InteractiveStat
              icon={<Users />}
              label="Leads Capturados"
              value="8,492"
              change="+24% este mes"
              color="cyan"
            />
            <InteractiveStat
              icon={<Target />}
              label="Citas Confirmadas"
              value="156"
              change="+12 hoy"
              color="pink"
            />
            <InteractiveStat
              icon={<TrendingUp />}
              label="Revenue Proyectado"
              value="$42.5k"
              change="+8.4% vs semana ant."
              color="green"
            />
            <InteractiveStat
              icon={<Activity />}
              label="Salud del Sistema"
              value="99.9%"
              change="Latencia 42ms"
              color="cyan"
            />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Lead Queue */}
            <div className="xl:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Cola de Prioridad Alta</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-bold uppercase tracking-wider">Meta API</span>
                  <span className="px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-[10px] font-bold uppercase tracking-wider">Ventas Calientes</span>
                </div>
              </div>

              <div className="space-y-4">
                <PremiumLeadCard
                  name="Santiago del Río"
                  source="Instagram Ads"
                  score={98}
                  status="Nuevo"
                  time="Hace 45s"
                />
                <PremiumLeadCard
                  name="Victoria Valenzuela"
                  source="Google Search"
                  score={84}
                  status="Analizando"
                  time="Hace 12m"
                />
                <PremiumLeadCard
                  name="Ricardo Montaner"
                  source="WhatsApp Direct"
                  score={92}
                  status="Prioridad"
                  time="Hace 1h"
                />
              </div>
            </div>

            {/* AI Insights & Evolution Status */}
            <div className="xl:col-span-4 space-y-8">
              <div className="glass-panel p-8 rounded-3xl border-brand-cyan/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-cyan/5 blur-[100px] pointer-events-none" />
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="text-brand-cyan" size={20} />
                  IA Analytics
                </h3>
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-cyan/30 transition-all cursor-default">
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                      "Santiago del Río muestra un patrón de interés en el sector inmobiliario de lujo. Recomendamos enviar el catálogo de **Diamante**."
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-pink/5 border border-brand-pink/10">
                    <div className="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center">
                      <TrendingUp className="text-brand-pink" size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-pink uppercase">Probabilidad de Cierre</p>
                      <p className="text-xl font-bold">87%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <h4 className="font-bold mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-brand-cyan" />
                  Instancias WhatsApp
                </h4>
                <div className="space-y-4">
                  <InstanceRow name="Ventas_Principal" status="Online" activeCount={142} color="green" />
                  <InstanceRow name="Soporte_BOT" status="Online" activeCount={892} color="cyan" />
                  <InstanceRow name="Marketing_Blast" status="Standby" activeCount={0} color="gray" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-brand-cyan text-black font-bold shadow-lg shadow-brand-cyan/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <span className={active ? 'text-black' : 'group-hover:text-brand-cyan transition-colors'}>
        {icon}
      </span>
      <span className="text-sm hidden lg:block">{label}</span>
      {active && <motion.div layoutId="nav-glow" className="ml-auto w-1.5 h-1.5 rounded-full bg-black block lg:hidden" />}
    </button>
  );
}

function InteractiveStat({ icon, label, value, change, color }: any) {
  const colorMap: any = {
    cyan: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20",
    pink: "text-brand-pink bg-brand-pink/10 border-brand-pink/20",
    green: "text-green-400 bg-green-400/10 border-green-400/20"
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="glass-panel p-6 rounded-3xl border-white/5 cyber-card group cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
          <span className={`text-[10px] font-bold ${color === 'green' ? 'text-green-400' : 'text-brand-cyan'}`}>{change}</span>
        </div>
      </div>
    </motion.div>
  );
}

function PremiumLeadCard({ name, source, score, status, time }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-cyan/30 hover:shadow-xl hover:shadow-brand-cyan/5 transition-all group"
    >
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-xl font-bold border border-white/10 overflow-hidden">
            {name[0]}
            <div className="absolute inset-0 bg-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0F0F0F] shadow-lg" />
        </div>
        <div>
          <h4 className="font-bold text-lg leading-tight group-hover:text-brand-cyan transition-colors">{name}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MessageSquare size={12} /> {source}
            </span>
            <span className="text-gray-700 font-bold">•</span>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Intent Score</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className={`h-full bg-gradient-to-r ${score > 90 ? 'from-brand-cyan to-brand-pink' : 'from-brand-cyan to-brand-cyan/50'}`}
              />
            </div>
            <span className="text-sm font-bold text-brand-cyan">{score}%</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-right">
            <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${status === 'Prioridad' ? 'bg-brand-pink/10 border-brand-pink/30 text-brand-pink' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              {status}
            </span>
          </div>
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-brand-cyan group-hover:text-black transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function InstanceRow({ name, status, activeCount, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : color === 'cyan' ? 'bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-gray-600'}`} />
        <span className="text-sm font-medium group-hover:text-white transition-colors text-gray-300">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        {activeCount > 0 && <span className="text-[10px] font-bold text-gray-500">{activeCount} msgs</span>}
        <span className="text-[10px] uppercase font-bold text-gray-600 tracking-tighter">{status}</span>
      </div>
    </div>
  );
}
