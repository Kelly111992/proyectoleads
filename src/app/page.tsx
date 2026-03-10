"use client";

import { motion } from "framer-motion";
import {
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Zap,
  Activity,
  ChevronRight,
  Plus
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative z-10 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-pink glow-cyan"
          >
            LeadMaster Premium
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2"
          >
            Bienvenido, <span className="text-brand-cyan">Agente Arkel</span>. El sistema está operativo.
          </motion.p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass px-6 py-3 rounded-full flex items-center gap-2 border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 transition-all"
        >
          <Plus size={20} />
          Nuevo Lead Manual
        </motion.button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Users className="text-brand-cyan" />}
          title="Leads Totales"
          value="1,284"
          trend="+12%"
          delay={0.1}
        />
        <StatCard
          icon={<Target className="text-brand-pink" />}
          title="Agendados"
          value="86"
          trend="+5%"
          delay={0.2}
        />
        <StatCard
          icon={<TrendingUp className="text-green-400" />}
          title="Tasa Conv."
          value="14.2%"
          trend="+2.1%"
          delay={0.3}
        />
        <StatCard
          icon={<Activity className="text-brand-cyan" />}
          title="Activos Hoy"
          value="42"
          trend="Sync"
          delay={0.4}
        />
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads Table/List */}
        <div className="lg:col-span-2 glass rounded-2xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap size={20} className="text-brand-cyan" />
              Leads Recientes
            </h2>
            <button className="text-brand-cyan text-sm hover:underline">Ver todos</button>
          </div>
          <div className="p-0">
            <LeadItem
              name="Juan Pérez"
              source="Meta Business"
              status="Nuevo"
              time="Hace 2 min"
            />
            <LeadItem
              name="Maria Garcia"
              source="Google Sheets"
              status="Contactado"
              time="Hace 15 min"
            />
            <LeadItem
              name="Carlos Lopez"
              source="WhatsApp"
              status="Cita Pendiente"
              time="Hace 1 hora"
              isHighlight
            />
            <LeadItem
              name="Ana Martinez"
              source="Sitio Web"
              status="En Seguimiento"
              time="Hace 3 horas"
            />
          </div>
        </div>

        {/* AI & Quick Actions Sidebar */}
        <aside className="space-y-8">
          <div className="glass p-6 rounded-2xl border-brand-pink/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 blur-3xl -z-10 group-hover:bg-brand-pink/20 transition-all" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-brand-pink" />
              IA Intelligence
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              "Detectamos 3 leads con alta intención de compra en las últimas 2 horas. Sugerencia: Priorizar respuesta a <span className="text-brand-pink">Carlos Lopez</span>."
            </p>
            <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-medium">
              Generar Estrategia de Cierre
            </button>
          </div>

          <div className="glass p-6 rounded-2xl border-brand-cyan/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap size={18} className="text-brand-cyan" />
              Sistema Estado
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Evolution API</span>
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Operativo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">n8n Workers</span>
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Activo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Database Sync</span>
                <span className="text-brand-cyan">Actualizado</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function StatCard({ icon, title, value, trend, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-6 rounded-2xl border-white/5 hover:border-white/20 transition-all group"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/5 ${trend.includes('+') ? 'text-green-400' : 'text-brand-cyan'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}

function LeadItem({ name, source, status, time, isHighlight = false }: any) {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${isHighlight ? 'bg-brand-cyan/5 border-l-2 border-l-brand-cyan' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-pink/20 flex items-center justify-center font-bold text-xs">
          {name.split(' ').map((n: any) => n[0]).join('')}
        </div>
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-xs text-gray-500">{source}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="hidden md:block text-right">
          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-white/10 ${isHighlight ? 'text-brand-cyan border-brand-cyan/30' : 'text-gray-400'}`}>
            {status}
          </span>
          <p className="text-[10px] text-gray-600 mt-1">{time}</p>
        </div>
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
