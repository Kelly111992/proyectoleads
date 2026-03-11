"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Target, TrendingUp, MessageSquare, Zap, Activity, ChevronRight, Plus,
  Search, LayoutDashboard, MessageCircle, Database, Bell, Sparkles, Command,
  ArrowUpRight, Filter, RefreshCw, Mail, Phone, Clock, CheckCircle2, AlertCircle,
  Globe, Loader2, User, Package, Smartphone, Send, KanbanSquare, List, X, BrainCircuit,
  PieChart, PhoneCall, FileText, Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { evolutionApi } from "@/lib/evolution";
import { supabase } from "@/lib/supabase";

const STAGES = ["MQL", "SQL", "NEGOCIACION", "CERRADO"];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, conversion: "0%", projected: "$0" });

  const [logs, setLogs] = useState([
    { time: "00:00", user: "SYS", action: "Nodo CRM Iniciado", lead: "ALTEPSA_HQ" }
  ]);

  const [vendedores] = useState([
    { id: 1, name: "Arkel Sales", color: "bg-blue-500", leads: 12, performance: 94 },
    { id: 2, name: "Claudia Leads", color: "bg-purple-500", leads: 8, performance: 88 },
    { id: 3, name: "Elite AI", color: "bg-[#E30613]", leads: 45, performance: 99 }
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
      calculateStats(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: any[]) => {
    const total = data.length;
    const qualified = data.filter(l => l.stage && (l.stage.includes('SQL') || l.stage.includes('NEGOCIACION'))).length;
    const conversion = total > 0 ? ((qualified / total) * 100).toFixed(1) + "%" : "0%";
    const projected = (qualified * 15000).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    setStats({ total, conversion, projected });
  };

  const updateLeadStage = async (id: number, newStage: string) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));
    await supabase.from('leads').update({ stage: newStage }).eq('id', id);
  };

  const handleCaptureLead = async () => {
    const demoNames = ["Rotisería El Rey", "Pollos La Granja", "Distribuidora San Juan", "Carnicería Los Compadres"];
    const products = ["Pollo en Canal Calibre 5", "Pechuga Deshuesada", "Caja Pierna Muslo", "Alas Adobadas"];
    const name = demoNames[Math.floor(Math.random() * demoNames.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const assignedTo = vendedores[leads.length % vendedores.length].name;

    const { error } = await supabase.from('leads').insert([{
      from_address: `demo_${Date.now()}@altepsa.com`,
      from_name: name,
      phone: '5213318213624',
      source: 'Dashboard_Manual',
      score: Math.floor(Math.random() * 40) + 60,
      stage: 'MQL',
      action_status: 'Asignado',
      assigned_agent: assignedTo,
      body_preview: `Cotización urgente para ${product}. Volumen estimado: 500kg semanales.`
    }]);

    if (error) alert("Error capturando: " + error.message);
    else fetchLeads();
  };

  useEffect(() => {
    setMounted(true);
    fetchLeads();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        fetchLeads();
        if (payload.eventType === 'INSERT') {
          setLogs(prev => [{
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: "SYS_BOT",
            action: "Nuevo Prospecto Detectado",
            lead: payload.new.from_name || "Anónimo"
          }, ...prev.slice(0, 3)]);
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-gray-200 font-sans selection:bg-[#FFCC00] selection:text-black bg-[#0A0A0A] overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #E30613 0%, transparent 50%), radial-gradient(circle at 80% 80%, #FFCC00 0%, transparent 40%)', filter: 'blur(100px)' }} />
      <div className="fixed inset-0 z-1 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-white/5 p-2 rounded-xl border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E30613]/50 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
            <img src="/logo-altepsa.png" alt="ALTEPSA" className="h-8 w-auto object-contain relative z-10 filter brightness-200 contrast-125" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
              ALTEPSA<span className="text-[#E30613]">_CRM</span>
              <span className="text-[9px] bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/30 px-2 py-0.5 rounded-sm font-mono tracking-widest uppercase ml-2">PRO_EDITION</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-gray-400 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              SISTEMA LOGÍSTICO CONECTADO
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center bg-[#141414] rounded-full p-1 border border-white/5">
          <button onClick={() => setActiveTab("leads")} className={`px-6 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === "leads" ? 'bg-[#E30613] text-white shadow-[0_0_20px_rgba(227,6,19,0.3)]' : 'text-gray-400 hover:text-white'}`}>Pipeline Ejecutivo</button>
          <button onClick={() => setActiveTab("analytics")} className={`px-6 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === "analytics" ? 'bg-[#E30613] text-white shadow-[0_0_20px_rgba(227,6,19,0.3)]' : 'text-gray-400 hover:text-white'}`}>Insights IA</button>
        </nav>

        <button onClick={handleCaptureLead} className="group relative px-6 py-2.5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95">
          <div className="absolute inset-0 bg-[#FFCC00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-2"><Plus size={14} /> Simular Entrada</span>
        </button>
      </header>

      <main className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10">

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard dark label="Total Leads Activos" value={stats.total} icon={<Database className="text-[#FFCC00]" />} trend="+12% v/s ayer" />
          <MetricCard dark label="Engagement de AI" value={`${leads.filter(l => l.action_status?.includes('IA') || l.source === 'WhatsApp_AI').length}`} icon={<BrainCircuit className="text-[#E30613]" />} trend="Auto-respondiendo" highlight />
          <MetricCard dark label="Win-Rate Proyectado" value={stats.conversion} icon={<Target className="text-green-400" />} trend="Alta intencion de compra" />
          <MetricCard dark label="Pipeline Value (MXN)" value={stats.projected} icon={<TrendingUp className="text-blue-400" />} trend="Basado en volumen avg" />
        </div>

        {/* View Toggle & Content */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-2">Deal Pipeline</h2>
                <p className="text-gray-400 text-sm font-mono tracking-tight">Gestiona el flujo comercial de la distribuidora</p>
              </div>
              <div className="bg-[#141414] border border-white/10 p-1 rounded-lg flex gap-1">
                <button onClick={() => setViewMode("kanban")} className={`p-2 rounded-md transition-all ${viewMode === "kanban" ? 'bg-[#2A2A2A] text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}><KanbanSquare size={18} /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode === "list" ? 'bg-[#2A2A2A] text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}><List size={18} /></button>
              </div>
            </div>

            {/* KANBAN BOARD */}
            {viewMode === "kanban" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {STAGES.map(stage => {
                  const stageLeads = leads.filter(l => (l.stage || 'MQL') === stage);
                  return (
                    <div key={stage} className="bg-[#111] border border-white/5 rounded-2xl p-4 min-h-[500px] flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stage === 'MQL' ? 'bg-blue-500' : stage === 'SQL' ? 'bg-[#FFCC00]' : stage === 'NEGOCIACION' ? 'bg-[#E30613]' : 'bg-green-500'}`} />
                          {stage}
                        </h3>
                        <span className="bg-[#222] text-gray-400 text-[10px] px-2 py-0.5 rounded font-mono">{stageLeads.length}</span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                        {stageLeads.map(lead => (
                          <KanbanCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // LIST VIEW
              <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1A1A1A] border-b border-white/10 text-[10px] uppercase font-mono tracking-widest text-gray-500">
                      <th className="p-4 rounded-tl-2xl">Prospecto</th>
                      <th className="p-4">Origen</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Asesor</th>
                      <th className="p-4 rounded-tr-2xl">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="border-b border-white/5 hover:bg-[#1A1A1A] transition-colors cursor-pointer group">
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{lead.from_name || 'Sin Nombre'}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-1">{lead.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-white/10 flex items-center w-max gap-2">
                            {lead.source === 'WhatsApp_AI' ? <MessageCircle size={10} className="text-[#25D366]" /> : <Users size={10} />}
                            {lead.source}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full ${lead.score > 80 ? 'bg-green-500' : lead.score > 50 ? 'bg-[#FFCC00]' : 'bg-[#E30613]'}`} style={{ width: `${lead.score}%` }} />
                            </div>
                            <span className="text-[11px] font-mono">{lead.score}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[11px] font-black uppercase tracking-widest text-[#E30613]">{lead.stage || 'MQL'}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center text-[10px] font-bold border border-white/10">
                              {(lead.assigned_agent || '?')[0].toUpperCase()}
                            </div>
                            <span className="text-xs text-gray-300">{lead.assigned_agent || 'Sin Asignar'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button className="text-gray-500 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* LEAD DETAILS SLIDE-OVER MODAL */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0F0F0F] border-l border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-[#141414] flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E30613]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#E30613] to-[#800000] rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-red-900/50 uppercase">
                      {(selectedLead.from_name || 'S')[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{selectedLead.from_name}</h2>
                      <p className="text-sm font-mono text-gray-400 flex items-center gap-2">
                        <Smartphone size={14} className="text-[#25D366]" /> {selectedLead.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLead.stage || 'MQL'}
                      onChange={(e) => {
                        updateLeadStage(selectedLead.id, e.target.value);
                        setSelectedLead({ ...selectedLead, stage: e.target.value });
                      }}
                      className="bg-[#222] text-white border border-white/10 rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-widest focus:ring-1 focus:ring-[#E30613] outline-none cursor-pointer"
                    >
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="bg-[#FFCC00]/10 text-[#FFCC00] px-3 py-1.5 rounded-md text-xs font-mono font-bold border border-[#FFCC00]/20">
                      Score: {selectedLead.score}%
                    </span>
                  </div>
                </div>

                <button onClick={() => setSelectedLead(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white relative z-10">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">

                {/* AI Insights Card */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] rounded-2xl border border-white/10 p-5 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit size={100} /></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E30613] mb-4 flex items-center gap-2 relative z-10">
                    <Sparkles size={12} /> Analysis Engine_
                  </h4>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <h5 className="text-xs text-gray-400 font-mono mb-1">Motivo de Contacto / Intención</h5>
                      <p className="text-sm text-gray-200 border-l-2 border-[#FFCC00] pl-3 py-1 font-medium bg-white/5 rounded-r">
                        "{selectedLead.body_preview || 'No hay contexto suficiente'}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase block mb-1">Producto Interés</span>
                        <span className="text-sm font-bold text-white">Pollo en Canal / Pechuga</span>
                      </div>
                      <div className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase block mb-1">Estado IA</span>
                        <span className="text-sm font-bold text-green-400 flex items-center gap-1"><CheckCircle2 size={12} /> {selectedLead.action_status || 'Procesado'}</span>
                      </div>
                    </div>

                    <div className="bg-[#E30613]/10 border border-[#E30613]/20 rounded-xl p-4 mt-2">
                      <h5 className="text-[10px] font-black uppercase text-[#E30613] mb-2 flex items-center gap-2"><ArrowUpRight size={12} /> Next Best Action recomendada</h5>
                      <p className="text-sm text-red-100/90 font-medium">Recomendamos enviar el Catálogo Mayorista V3 y agendar llamada de 5 min para concretar volumen de entrega semanal.</p>
                    </div>
                  </div>
                </div>

                {/* Interaction Timeline Mock */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 border-b border-white/10 pb-2">Timeline de Seguimiento</h4>

                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] border-2 border-[#25D366] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-lg shadow-[#25D366]/20">
                        <MessageCircle size={16} className="text-[#25D366]" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1A1A1A] p-4 rounded-xl shadow border border-white/5">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-white text-sm">Mensaje Recibido</div>
                          <time className="font-mono text-[10px] text-gray-500">{new Date(selectedLead.created_at).toLocaleDateString()}</time>
                        </div>
                        <div className="text-gray-400 text-xs">El prospecto se contactó por WhatsApp. Inteligencia Artificial (Llama-3.3) tomó la conversación inicial.</div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] border-2 border-[#E30613] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <User size={16} className="text-[#E30613]" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1A1A1A] p-4 rounded-xl shadow border border-white/5">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-white text-sm">Asignación Automática</div>
                          <time className="font-mono text-[10px] text-gray-500">Auto</time>
                        </div>
                        <div className="text-gray-400 text-xs">Lead asignado en Round Robin a: <span className="text-white font-bold">{selectedLead.assigned_agent || 'Sin asignar'}</span></div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 bg-[#111] border-t border-white/10 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-[#E30613] hover:bg-[#c40510] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/40">
                  <FileText size={16} /> Enviar Cotización
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-900/40">
                  <PhoneCall size={16} /> Abrir Chat
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// Kanban Card Component
function KanbanCard({ lead, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-[#1A1A1A] border border-white/5 hover:border-white/20 p-4 rounded-xl cursor-pointer group transition-all hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-red-500/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150" />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <h4 className="font-black text-white text-sm uppercase tracking-tight line-clamp-1 pr-4">{lead.from_name}</h4>
        {lead.score > 80 && <div className="w-2 h-2 rounded-full bg-[#E30613] shadow-[0_0_8px_#E30613] shrink-0 mt-1" />}
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 mb-4 font-medium italic relative z-10">
        "{lead.body_preview || 'Sin mensaje previo'}"
      </p>

      <div className="flex items-center justify-between border-t border-white/5 pt-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#222] border border-white/10 flex items-center justify-center text-[8px] font-bold text-white">
            {(lead.assigned_agent || '?')[0].toUpperCase()}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{(lead.assigned_agent || 'Auto').split(' ')[0]}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-white font-mono border border-white/5">
          {new Date(lead.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, trend, highlight, dark }: any) {
  return (
    <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden group ${highlight ? 'bg-gradient-to-br from-[#1A0505] to-[#E30613]/20 border-[#E30613]/30 shadow-lg shadow-red-900/20' : 'bg-[#111] border-white/5'}`}>
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-lg ${highlight ? 'bg-[#E30613]/20' : 'bg-white/5'} backdrop-blur-sm border border-white/5`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black text-white tracking-tighter mb-1">{value}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">{label}</p>
        <p className="text-[10px] font-mono text-gray-500">{trend}</p>
      </div>
    </div>
  );
}
