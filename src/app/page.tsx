"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Target, TrendingUp, MessageSquare, Zap, ChevronRight, Plus,
  Search, LayoutDashboard, Clock, Activity, AlertCircle, Phone, Mail,
  Calendar, Inbox, Command, Sparkles, Send, MoreVertical, X, CheckCircle2,
  FileText, ArrowRight, BrainCircuit, BarChart2, ShieldCheck, HelpCircle,
  Play, Bot, PlayCircle, Filter
} from "lucide-react";
import { useState, useEffect } from "react";
import { evolutionApi } from "@/lib/evolution";
import { supabase } from "@/lib/supabase";

const STAGES = ["Nuevo", "Contactado", "Cotizando", "Negociación", "Cierre"];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // AI Reply State
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const [agents] = useState([
    { id: 1, name: "Arkel Sales", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", capacity: 85, active: 12, lastSeen: "Hace 2 min", avatar: "AS" },
    { id: 2, name: "Claudia Leads", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", capacity: 70, active: 8, lastSeen: "Online", avatar: "CL" },
    { id: 3, name: "Elite AI", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", capacity: 100, active: 45, lastSeen: "Siempre 24/7", avatar: "AI" }
  ]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .or('source.eq.WhatsApp_AI,source.eq.Dashboard_Manual')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStage = async (id: number, newStage: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));
    const { error } = await supabase.from('leads').update({ stage: newStage, action_status: 'Actualizado' }).eq('id', id);
    if (error) console.log(error);
  };

  const handleCaptureLead = async () => {
    const names = ["Distribuidora San Juan", "Rotisería El Rey KFC", "Comedores Industriales SA", "Carnes Express GDL"];
    const name = names[Math.floor(Math.random() * names.length)];
    const assignedAgent = agents[leads.length % agents.length].name;
    const score = Math.floor(Math.random() * 30) + 70; // 70-100

    const { error } = await supabase.from('leads').insert([{
      from_address: `demo_${Date.now()}@altepsa.com`,
      from_name: name,
      phone: '5213318213624',
      source: 'WhatsApp_AI',
      score: score,
      stage: 'Nuevo',
      action_status: 'IA_Respondiendo',
      assigned_agent: assignedAgent,
      body_preview: 'Requiero media tonelada de pollo en canal calibre 4 para mañana urgente, ¿tienen disponibilidad e Invoices fiscales?'
    }]);

    if (error) alert("Error capturando: " + error.message);
    else fetchLeads();
  };

  const generateAISuggestion = () => {
    setAiGenerating(true);
    setAiSuggestion("");
    setTimeout(() => {
      setAiSuggestion(`¡Hola ${selectedLead?.from_name?.split(' ')[0] || 'Cliente'}! 🍗 Confirmado. Sí contamos con disponibilidad inmediata de Pollo en Canal y facturación CFDI 4.0. Nuestro envío sale de la central de Guadalajara mañana a primera hora si cerramos pedido hoy. ¿Les genero de una vez su cotización por la media tonelada? Quedo a sus órdenes.`);
      setAiGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    setMounted(true);
    fetchLeads();
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads();
      }).subscribe();

    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, []);

  const getSLAWarning = (createdAt: string) => {
    const diffMins = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / 60000);
    if (diffMins > 15) return { level: 'critical', text: 'SLA VENCIDO (>15m)', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    if (diffMins > 5) return { level: 'warning', text: 'ATENCIÓN (>5m)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return null;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 bg-[#09090b] overflow-hidden flex flex-col">
      {/* Dynamic Backgrounds */}
      <div className="subtle-grid" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Command size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide">
                ALTEPSA <span className="text-emerald-500 font-mono tracking-tighter">/ ELITE</span>
              </h1>
              <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-widest text-zinc-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Live Network Gdl
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50">
            {['Inbox', 'Pipeline', 'Analytics', 'Agents'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === item.toLowerCase() ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400">
            <Clock size={12} className="text-emerald-500" />
            {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} CST
          </div>
          <button onClick={handleCaptureLead} className="group relative px-4 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2">
            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            Ingresar Lead
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative z-10 w-full">

        {/* Left Sidebar: Smart Logic & Routing */}
        <aside className="w-64 border-r border-white/5 bg-zinc-950/30 backdrop-blur-3xl hidden lg:flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
              <Zap size={12} className="text-blue-500" /> Enrutamiento IA
            </h3>

            <div className="space-y-4">
              {agents.map(agent => (
                <div key={agent.id} className="p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md ${agent.bg} ${agent.border} border flex items-center justify-center text-[9px] font-bold ${agent.color}`}>
                        {agent.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{agent.name}</p>
                        <p className="text-[9px] text-zinc-500">{agent.lastSeen}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400">{agent.active} Leads</span>
                  </div>
                  {/* Capacity Bar */}
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${agent.color.replace('text', 'bg')}`} style={{ width: `${agent.capacity}%`, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><BrainCircuit size={48} /></div>
              <h4 className="text-[10px] font-black uppercase text-emerald-500 mb-1 tracking-widest">Estado Del Sistema</h4>
              <p className="text-xs text-zinc-400 font-medium">Auto-asignación Round Robin: <span className="text-emerald-400">ÓPTIMO</span></p>
              <div className="mt-3 flex gap-2 w-full h-8 items-end">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/50 to-emerald-400 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas: Unified Inbox / List */}
        <section className="flex-1 flex flex-col bg-zinc-900/10 overflow-hidden relative">
          {/* Filters/Toolbar */}
          <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-zinc-400">
              <Search size={16} />
              <input type="text" placeholder="Buscar prospectos, teléfonos o mensajes..." className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-64 md:w-96 font-medium" />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold hover:bg-zinc-800 transition-colors">
                <Filter size={14} /> Filtros
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <div className="w-12 h-12 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Cargando base de datos neural...</p>
              </div>
            ) : leads.map(lead => {
              const warning = getSLAWarning(lead.created_at || new Date().toISOString());
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`group relative p-4 rounded-xl transition-all cursor-pointer flex gap-4 items-center glass-panel hover:bg-zinc-800/80 ${isSelected ? 'animated-border bg-zinc-800/80' : ''}`}
                >
                  {/* Lead Score Radial */}
                  <div className="shrink-0 relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" className="stroke-zinc-800" strokeWidth="4" fill="none" />
                      <motion.circle
                        cx="24" cy="24" r="20"
                        strokeWidth="4" fill="none"
                        strokeDasharray={125.6}
                        initial={{ strokeDashoffset: 125.6 }}
                        animate={{ strokeDashoffset: 125.6 - (125.6 * (lead.score || 0)) / 100 }}
                        className={lead.score > 80 ? 'stroke-emerald-500' : lead.score > 50 ? 'stroke-blue-500' : 'stroke-red-500'}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-mono font-bold text-white">{lead.score}</span>
                  </div>

                  {/* Core Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-semibold text-white truncate">{lead.from_name || 'Prospecto Web'}</h4>
                      {warning && lead.stage === 'Nuevo' && (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${warning.color} animate-pulse`}>
                          {warning.text}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate italic pr-4">
                      "{lead.body_preview || 'Revisando requerimientos...'}"
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-zinc-900 border border-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-full font-medium">
                        {lead.stage || 'MQL'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                        <MessageSquare size={12} className={lead.source === 'WhatsApp_AI' ? 'text-[#25D366]' : ''} />
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[10px] text-zinc-500 font-mono">{lead.assigned_agent || 'Auto'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Right Slide-over: 360 CRM Profile */}
        <AnimatePresence>
          {selectedLead && (
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full md:w-[480px] bg-zinc-950 border-l border-white/10 shrink-0 flex flex-col absolute right-0 top-0 bottom-0 z-50 shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-start justify-between relative overflow-hidden bg-zinc-900/20">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-xl font-bold shadow-lg text-white">
                      {(selectedLead.from_name || 'S')[0]}
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1 truncate pr-4">{selectedLead.from_name}</h2>
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#25D366]" /> {selectedLead.phone}</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-blue-500" /> Validado</span>
                  </div>
                </div>
              </div>

              {/* CRM Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                {/* Score & Stage Control */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Predictive Score</p>
                    <div className="flex items-end gap-3">
                      <span className={`text-3xl font-black ${selectedLead.score > 80 ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {selectedLead.score}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono mb-1.5">/ 100</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                      <div className={`h-full ${selectedLead.score > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${selectedLead.score}%` }} />
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-2xl flex flex-col justify-between">
                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Etapa del negocio</p>
                    <select
                      value={selectedLead.stage || 'Nuevo'}
                      onChange={(e) => updateLeadStage(selectedLead.id, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 text-sm font-semibold text-white px-3 py-2 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none"
                    >
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* AI Nudging & Suggestions */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-900/5 rounded-2xl border border-indigo-500/20 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20"><Bot size={80} /></div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-4">
                    <Sparkles size={14} /> Asistente Elite
                  </h4>

                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 mb-4 backdrop-blur-sm relative z-10">
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      "{selectedLead.body_preview || 'Lead capturado, esperando primer punto de contacto.'}"
                    </p>
                  </div>

                  {!aiSuggestion && !aiGenerating && (
                    <button
                      onClick={generateAISuggestion}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 relative z-10"
                    >
                      <BrainCircuit size={14} /> Generar Respuesta Rápida
                    </button>
                  )}

                  {aiGenerating && (
                    <div className="w-full py-2.5 bg-indigo-900/50 text-indigo-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-indigo-500/30">
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      Analizando contexto y generando...
                    </div>
                  )}

                  {aiSuggestion && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                      <textarea
                        value={aiSuggestion}
                        onChange={(e) => setAiSuggestion(e.target.value)}
                        className="w-full h-28 bg-zinc-950/80 border border-indigo-500/40 rounded-xl p-3 text-xs text-indigo-100 placeholder:text-zinc-600 outline-none focus:border-indigo-400 resize-none custom-scrollbar shadow-inner"
                      />
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => setAiSuggestion('')} className="px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">Descartar</button>
                        <button className="flex-1 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                          <Send size={14} /> Enviar a WhatsApp
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Unified Timeline */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-800 pb-3">Timeline Unificada</h4>

                  <div className="relative border-l border-zinc-800 ml-3 md:ml-4 space-y-8 pb-4">

                    <div className="relative pl-6">
                      <span className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 text-emerald-500 shadow-lg shadow-emerald-500/10">
                        <PlayCircle size={14} />
                      </span>
                      <h5 className="text-sm font-semibold text-white mb-1 leading-none">Inicio de Sesión</h5>
                      <span className="text-[10px] text-zinc-500 font-mono">{new Date(selectedLead.created_at).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</span>

                      {selectedLead.source === 'WhatsApp_AI' && (
                        <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400">
                          <span className="text-emerald-400 font-medium">WhatsApp Bridge:</span> Mensaje recibido procesado vía Evolution API
                        </div>
                      )}
                    </div>

                    <div className="relative pl-6">
                      <span className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 text-blue-500">
                        <ShieldCheck size={14} />
                      </span>
                      <h5 className="text-sm font-semibold text-white mb-1 leading-none">Smart Assignment</h5>
                      <span className="text-[10px] text-zinc-500 font-mono">+1 min detectado</span>
                      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                        Evaluación del volumen de ventas. Asignado predictivamente a <strong className="text-white">{selectedLead.assigned_agent || 'Agente'}</strong> basado en carga de trabajo.
                      </p>
                    </div>

                    <div className="relative pl-6">
                      <span className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 text-amber-500">
                        <Activity size={14} />
                      </span>
                      <h5 className="text-sm font-semibold text-white mb-1 leading-none">{selectedLead.action_status || 'En espera'}</h5>
                      <span className="text-[10px] text-amber-500 font-mono font-bold animate-pulse">ALERTA SLA SI NO HAY CONTACTO</span>
                    </div>

                  </div>
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
