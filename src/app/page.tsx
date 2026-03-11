"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Target, TrendingUp, MessageSquare, Zap, Plus,
  Search, Clock, Activity, AlertCircle, Phone,
  Command, Sparkles, Send, X, CheckCircle2,
  FileText, BrainCircuit, BarChart2, ShieldCheck,
  PlayCircle, MapPin, Gauge, PackageSearch, Lock
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const STAGES = ["Nuevo", "Contactado", "Cotizando", "Negociación", "Cierre"];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");

  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modals
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simMode, setSimMode] = useState<"form" | "chat">("form");
  const [simName, setSimName] = useState("");
  const [simPhone, setSimPhone] = useState("");
  const [simInput, setSimInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [chatAiThinking, setChatAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Reply State
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  const [agents] = useState([
    { id: 1, name: "Arkel Sales", color: "text-[#E30613]", bg: "bg-[#E30613]/10", border: "border-[#E30613]/20", capacity: 85, active: 12, lastSeen: "Hace 2 min", avatar: "AS", sales: "$125,000", conversion: "32%" },
    { id: 2, name: "Claudia Leads", color: "text-[#FFCC00]", bg: "bg-[#FFCC00]/10", border: "border-[#FFCC00]/20", capacity: 70, active: 8, lastSeen: "Online", avatar: "CL", sales: "$98,500", conversion: "28%" },
    { id: 3, name: "IA de Ventas", color: "text-zinc-300", bg: "bg-zinc-300/10", border: "border-zinc-300/20", capacity: 100, active: 45, lastSeen: "Siempre 24/7", avatar: "AI", sales: "$450,000", conversion: "68%" }
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
    const { error } = await supabase.from('leads').update({ stage: newStage, action_status: 'Etapa Actualizada' }).eq('id', id);
    if (error) console.log(error);
  };

  // SimChat Handlers
  const startSimChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simPhone) return;
    setSimMode("chat");
    setChatMsgs([]);
  };

  const deliverSimMsg = async () => {
    if (!simInput) return;
    const newMsgs = [...chatMsgs, { role: 'user', text: simInput } as const];
    setChatMsgs(newMsgs);
    setSimInput("");
    setChatAiThinking(true);

    try {
      const gReq = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.text })), leadName: simName }),
      });
      const gRes = await gReq.json();
      setChatAiThinking(false);
      setChatMsgs([...newMsgs, { role: 'ai', text: gRes.text || 'Error generando respuesta.' }]);
    } catch (e) {
      setChatAiThinking(false);
      setChatMsgs([...newMsgs, { role: 'ai', text: 'Error de red.' }]);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMsgs, chatAiThinking]);

  const finishSimulatedLead = async () => {
    if (chatMsgs.length === 0) {
      setShowSimulateModal(false);
      return;
    }

    const assignedAgent = agents[leads.length % agents.length].name;
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    // Get last user message as body preview
    const bodyPreview = chatMsgs.filter(m => m.role === 'user').pop()?.text || "Chat simulado sin mensajes del usuario.";

    const { error } = await supabase.from('leads').upsert([{
      from_address: `sim_${Date.now()}@altepsa.com`,
      from_name: simName,
      phone: simPhone,
      source: 'WhatsApp_AI',
      score: score,
      stage: 'Nuevo',
      action_status: 'IA_Conversando',
      assigned_agent: assignedAgent,
      body_preview: bodyPreview
    }], { onConflict: 'phone' });

    if (!error) {
      setShowSimulateModal(false);
      setSimMode("form");
      setSimName(""); setSimPhone(""); setChatMsgs([]);
      fetchLeads();
    } else {
      alert("Error de inserción: " + error.message);
    }
  };

  const LoginScreen = () => (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-[#E30613]/30">
      <div className="bg-black/80 backdrop-blur-xl border border-zinc-900 shadow-2xl p-10 rounded-[2rem] w-full max-w-md flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E30613]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFCC00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          {/* SVG Animated Border for Logo */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#E30613" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FFCC00" strokeWidth="1" strokeDasharray="20 10" opacity="0.4" className="animate-[spin_6s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
          </svg>
          <div className="absolute inset-3 bg-zinc-950 rounded-full flex items-center justify-center overflow-hidden border border-zinc-800">
            <img src="/5.png" alt="ALTEPSA" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
        </div>

        <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2 text-center">
          ALTEPSA <span className="text-[#E30613]">COMEX</span>
        </h1>
        <p className="text-xs text-zinc-500 font-mono mb-8 text-center bg-zinc-950 px-3 py-1 rounded-full border border-zinc-900">
          <Lock size={12} className="inline mr-1 text-[#FFCC00]" />
          Acceso corporativo restringido
        </p>

        <div className="w-full relative">
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pin === "1234") setIsAuthenticated(true);
                else alert("PIN Invalido (Hint: 1234)");
              }
            }}
            placeholder="••••"
            className="w-full bg-zinc-950 border border-zinc-800 text-center tracking-[1em] text-white text-3xl py-4 rounded-xl outline-none focus:border-[#E30613] transition-colors focus:shadow-[0_0_20px_rgba(227,6,19,0.2)]"
            autoFocus
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
            <ShieldCheck size={24} className="text-[#E30613]" />
          </div>
        </div>
        <button
          onClick={() => { if (pin === "1234") setIsAuthenticated(true); else alert("PIN Invalido (Hint: 1234)"); }}
          className="w-full mt-6 bg-gradient-to-r from-[#E30613] to-[#B0000A] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(227,6,19,0.4)] transition-all hover:scale-[1.02]"
        >
          Autenticar
        </button>
      </div>
    </div>
  );

  const generateAISuggestion = () => {
    setAiGenerating(true);
    setAiSuggestion("");
    setMsgSuccess(false);
    setTimeout(() => {
      setAiSuggestion(`¡Hola ${selectedLead?.from_name?.split(' ')[0] || 'Cliente'}! 🍗 Confirmado. Sí contamos con disponibilidad inmediata de cortes y canal con facturación electrónica. Podemos procesar tu pedido hoy mismo para entrega rápida. ¿Te genero una cotización formal?`);
      setAiGenerating(false);
    }, 1500);
  };

  const deliverWhatsAppMessage = async () => {
    if (!aiSuggestion || !selectedLead?.phone) return;
    setSendingMsg(true);
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedLead.phone, text: aiSuggestion })
      });
      const data = await response.json();
      if (data.success) {
        setMsgSuccess(true);
        setAiSuggestion("");
      } else {
        alert('Error al enviar el mensaje: ' + JSON.stringify(data.error));
      }
    } catch (err) {
      alert('Fallo de conexión al enviar WhatsApp.');
    } finally {
      setSendingMsg(false);
    }
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
    if (diffMins > 15) return { level: 'critical', text: 'ATENCIÓN RETRASADA', color: 'text-[#E30613] bg-[#E30613]/10 border-[#E30613]/20' };
    if (diffMins > 5) return { level: 'warning', text: 'TIEMPO EXCEDIDO', color: 'text-[#FFCC00] bg-[#FFCC00]/10 border-[#FFCC00]/20' };
    return null;
  };

  if (!mounted) return null;
  if (!isAuthenticated) return <LoginScreen />;

  return (
    <div className="min-h-screen text-zinc-300 font-sans selection:bg-[#E30613]/30 selection:text-white bg-[#09090b] overflow-hidden flex flex-col">
      <div className="subtle-grid" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#E30613]/5 via-transparent to-[#FFCC00]/5 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#FFCC00" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />
              </svg>
              <div className="absolute inset-1 rounded-full overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
                <img src="/5.png" alt="ALTEPSA" className="w-full h-full object-cover p-1" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">
                ALTEPSA <span className="text-[#E30613] font-black tracking-tighter">COMEX</span>
              </h1>
              <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-widest text-zinc-500">
                <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                Matriz Operativa - CRM
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50">
            {['Inbox', 'Pipeline', 'Analytics', 'Agents'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === item.toLowerCase() ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400">
            <Clock size={12} className="text-[#FFCC00]" />
            {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} CST
          </div>
          <button onClick={() => setShowSimulateModal(true)} className="group relative px-4 py-1.5 bg-gradient-to-r from-[#E30613] to-[#B0000A] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 hover:scale-105">
            <MessageSquare size={14} className="group-hover:rotate-12 transition-transform" />
            Simulador Chat
          </button>
        </div>
      </header>

      {/* Main Workspace based on Tabs */}
      <main className="flex-1 flex overflow-hidden relative z-10 w-full">
        {activeTab === 'inbox' && <InboxView />}
        {activeTab === 'pipeline' && <PipelineView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'agents' && <AgentsView />}
      </main>

      {/* MODAL SIMULAR CONVERSACIÓN CHAT UI */}
      <AnimatePresence>
        {showSimulateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/50">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="text-[#25D366]" size={16} /> Chat Simulator
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{simMode === 'form' ? 'Paso 1: Configurar Perfil' : `Chateando como: ${simName}`}</p>
                </div>
                <button onClick={() => setShowSimulateModal(false)} className="text-zinc-500 hover:text-white p-1 rounded-full"><X size={18} /></button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden flex flex-col relative w-full">
                {simMode === 'form' ? (
                  <form onSubmit={startSimChat} className="p-6 space-y-5 h-full overflow-y-auto">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Nombre Prospecto</label>
                      <input required value={simName} onChange={e => setSimName(e.target.value)} type="text" placeholder="Ej. Distribuidora El Paisa" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#25D366]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Número de Prueba</label>
                      <input required value={simPhone} onChange={e => setSimPhone(e.target.value)} type="number" placeholder="Ej. 3315185120" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#25D366]" />
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full py-3 rounded-lg bg-[#25D366] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1DA851] flex justify-center items-center gap-2 shadow-lg shadow-green-900/20">
                        Siguiente: Iniciar Chat <Send size={14} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1 flex flex-col bg-[#0b141a]">
                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      <div className="flex justify-center mb-4">
                        <span className="text-[10px] bg-zinc-800/50 text-zinc-400 px-3 py-1 rounded-lg">Hoy</span>
                      </div>

                      {chatMsgs.map((msg, i) => (
                        <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {chatAiThinking && (
                        <div className="flex w-full justify-start">
                          <div className="max-w-[80%] rounded-xl p-3 bg-[#202c33] text-zinc-400 rounded-tl-none flex items-center gap-2 text-xs">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            IA escribiendo...
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="bg-[#202c33] p-3 flex items-center gap-2 shrink-0">
                      <input
                        value={simInput}
                        onChange={e => setSimInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') deliverSimMsg() }}
                        placeholder="Escribe un mensaje de prueba..."
                        className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2.5 text-sm outline-none text-[#e9edef] placeholder:text-zinc-500"
                        disabled={chatAiThinking}
                      />
                      <button
                        onClick={deliverSimMsg}
                        disabled={chatAiThinking || !simInput}
                        className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] flex items-center justify-center text-white disabled:opacity-50 transition-colors"
                      >
                        <Send size={16} className="-ml-1" />
                      </button>
                    </div>

                    {/* Chat Footer Actions */}
                    <div className="bg-[#111] p-3 border-t border-zinc-900 flex justify-end gap-2 shrink-0">
                      <button onClick={finishSimulatedLead} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded flex items-center gap-2">
                        Guardar Lead y Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // VIEWS COMPONENTS -> Enclosed functions for cleaner structure

  function InboxView() {
    return (
      <>
        {/* Enrutamiento Status Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-zinc-950/30 backdrop-blur-3xl hidden lg:flex flex-col shrink-0 overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#E30613]/10 to-transparent pointer-events-none" />
          <div className="p-5 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E30613] mb-4 flex items-center gap-2">
              <Gauge size={12} /> Desempeño Global
            </h3>

            <div className="space-y-4">
              {agents.map(agent => (
                <div key={agent.id} className="p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform"><Target size={32} /></div>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md ${agent.bg} ${agent.border} border flex items-center justify-center text-[9px] font-bold ${agent.color}`}>
                        {agent.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{agent.name}</p>
                        <p className="text-[9px] text-zinc-500">{agent.lastSeen}</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1 max-w-[80%]">
                    <div className={`h-full ${agent.color.replace('text', 'bg')}`} style={{ width: `${agent.capacity}%`, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest text-center">Nodos Operativos</h4>
              {/* Dynamic SVG Animation for 'Impacto Visual' */}
              <div className="h-24 w-full relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[80%] h-full opacity-50">
                  <path d="M50 10 L10 50 L50 90 L90 50 Z" stroke="#E30613" strokeWidth="1" fill="none" className="animate-[dash_4s_linear_infinite]" strokeDasharray="10" />
                  <circle cx="50" cy="50" r="15" fill="#FFCC00" className="animate-pulse opacity-20" />
                  <circle cx="50" cy="50" r="5" fill="#FFCC00" />
                  <circle cx="10" cy="50" r="3" fill="#E30613" />
                  <circle cx="90" cy="50" r="3" fill="#E30613" />
                  <circle cx="50" cy="10" r="3" fill="#E30613" />
                  <circle cx="50" cy="90" r="3" fill="#E30613" />
                </svg>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes dash { to { stroke-dashoffset: -40; } }` }} />
              </div>
            </div>
          </div>
        </aside>

        {/* Central List */}
        <section className="flex-1 flex flex-col bg-zinc-900/10 overflow-hidden relative">
          <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-zinc-400">
              <Search size={16} />
              <input type="text" placeholder="Búsqueda Inteligente..." className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-64 md:w-96 font-medium" />
            </div>
            <span className="text-[10px] uppercase font-mono text-zinc-600">{leads.length} prospectos hoy</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-3 relative z-10">
            {leads.map(lead => {
              const warning = getSLAWarning(lead.created_at || new Date().toISOString());
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`group relative p-4 rounded-xl transition-all cursor-pointer flex gap-4 items-center bg-zinc-900/40 border border-white/5 hover:bg-zinc-800 hover:border-white/10 ${isSelected ? 'border-[#E30613]/50 bg-gradient-to-r from-[#E30613]/10 to-zinc-900' : ''}`}
                >
                  <div className="shrink-0 relative w-12 h-12 flex items-center justify-center bg-zinc-950 rounded-full border border-zinc-800">
                    <span className={`text-[11px] font-mono font-bold ${lead.score > 80 ? 'text-[#FFCC00]' : 'text-zinc-400'}`}>{lead.score}</span>
                    {lead.score > 80 && <div className="absolute inset-0 rounded-full ring-1 ring-[#FFCC00]/50 animate-ping opacity-20" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-bold text-white truncate uppercase tracking-tight">{lead.from_name || 'Prospecto Cautivo'}</h4>
                      {warning && lead.stage === 'Nuevo' && (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${warning.color}`}>
                          {warning.text}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate font-mono">
                      <MessageSquare size={10} className="inline mr-1 text-zinc-500" />
                      {lead.body_preview || 'Sin historial'}
                    </p>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${lead.stage === 'Cierre' ? 'bg-[#FFCC00]/10 text-[#FFCC00] border border-[#FFCC00]/20' : 'bg-zinc-950 border border-zinc-700 text-zinc-300'}`}>
                        {lead.stage || 'Nuevo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                      <Phone size={10} /> {lead.phone}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Right CRM Panel */}
        <AnimatePresence>
          {selectedLead && (
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full md:w-[480px] bg-zinc-950 border-l border-zinc-800 shrink-0 flex flex-col absolute right-0 top-0 bottom-0 z-50 shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 bg-black flex flex-col justify-end relative h-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src="/5.png" alt="Fondo" className="w-full h-full object-cover opacity-10 grayscale hover:grayscale-0 hover:opacity-20 transition-all duration-700" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                </div>
                <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-zinc-800 rounded-full text-white z-20 backdrop-blur-md transition-colors"><X size={16} /></button>

                <div className="relative z-10 flex items-end gap-4 mt-auto">
                  <div className="w-16 h-16 rounded-xl bg-[#E30613] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-red-900/40 uppercase">
                    {(selectedLead.from_name || 'S')[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white leading-none uppercase tracking-tighter mb-1">{selectedLead.from_name}</h2>
                    <span className="text-xs text-zinc-400 font-mono">{selectedLead.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-zinc-950">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-inner">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-2">Valor Estimado</p>
                    <span className="text-xl font-black text-[#FFCC00] font-mono">{selectedLead.score > 80 ? '$45k' : '$12k'} MXN</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-center">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-2">Estado</p>
                    <select
                      value={selectedLead.stage || 'Nuevo'}
                      onChange={(e) => updateLeadStage(selectedLead.id, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-sm font-bold text-white px-2 py-1 rounded select-none outline-none focus:border-[#E30613]"
                    >
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-[#111] rounded-2xl border border-white/5 p-5">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                    <BrainCircuit size={14} className="text-[#FFCC00]" /> Inteligencia Comercial
                  </h4>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-zinc-300 italic font-medium leading-relaxed">
                      "{selectedLead.body_preview}"
                    </p>
                  </div>

                  {!aiSuggestion && !aiGenerating && !msgSuccess && (
                    <button onClick={generateAISuggestion} className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                      Generar Respuesta Persuasiva
                    </button>
                  )}

                  {aiGenerating && (
                    <div className="w-full py-4 text-zinc-400 text-xs font-mono flex flex-col items-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#E30613] border-t-transparent rounded-full animate-spin" />
                      Sintetizando catálogo ALTEPSA...
                    </div>
                  )}

                  {msgSuccess && (
                    <div className="w-full py-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg flex items-center justify-center gap-2 text-xs font-bold">
                      <CheckCircle2 size={16} /> Mensaje WhatsApp Enviado.
                    </div>
                  )}

                  {aiSuggestion && !msgSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <textarea
                        readOnly
                        value={aiSuggestion}
                        className="w-full h-24 bg-zinc-950 border border-[#E30613]/30 rounded-lg p-3 text-xs text-zinc-200 outline-none resize-none"
                      />
                      <button
                        onClick={deliverWhatsAppMessage}
                        disabled={sendingMsg}
                        className="w-full mt-3 py-3 bg-[#25D366] hover:bg-[#1DA851] disabled:opacity-50 disabled:cursor-wait text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                        {sendingMsg ? 'Conectando...' : <><Send size={14} /> Enviar a Cliente</>}
                      </button>
                    </motion.div>
                  )}
                </div>

                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Log de Acciones</h4>
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex gap-3">
                      <span className="text-zinc-600 shrink-0">{new Date(selectedLead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div>
                        <p className="text-zinc-300 font-bold">Receptor Inteligente</p>
                        <p className="text-zinc-500">Contacto detectado.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    );
  }

  function PipelineView() {
    return (
      <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden flex gap-6 mt-4 pb-12">
        {STAGES.map(stage => (
          <div
            key={stage}
            className="w-80 min-w-80 shrink-0 flex flex-col h-full bg-zinc-900/30 border border-white/5 rounded-2xl relative transition-all"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#FFCC00'; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              const leadId = e.dataTransfer.getData('leadId');
              if (leadId) updateLeadStage(Number(leadId), stage);
            }}
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-sm bg-black/50 rounded-t-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">{stage}</h3>
              <span className="bg-[#E30613]/20 text-[#E30613] px-2 py-0.5 rounded text-[10px] font-bold">{leads.filter(l => l.stage === stage).length}</span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
              {leads.filter(l => (l.stage || 'Nuevo') === stage).map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('leadId', lead.id.toString());
                    e.currentTarget.style.opacity = '0.5';
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-zinc-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white truncate max-w-[80%] group-hover:text-[#FFCC00] transition-colors">{lead.from_name}</h4>
                    {lead.score > 80 && <Sparkles size={12} className="text-[#FFCC00] shrink-0" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mb-3 truncate border-l-2 border-[#E30613] pl-2">
                    {lead.body_preview || 'Sin descripción'}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900/80">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-zinc-800 text-[9px] flex items-center justify-center font-bold text-white uppercase border border-zinc-700">
                        {(lead.assigned_agent || 'I')[0]}
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400">{(lead.assigned_agent || 'IA').split(' ')[0]}</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 border ${lead.score > 80 ? 'text-emerald-400 border-emerald-900/50' : 'text-zinc-500 border-zinc-800'}`}>
                      {lead.score} SC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function AnalyticsView() {
    const dataChart = [
      { name: 'Lun', prospectos: 25, conversiones: 12 },
      { name: 'Mar', prospectos: 35, conversiones: 18 },
      { name: 'Mie', prospectos: 20, conversiones: 15 },
      { name: 'Jue', prospectos: 45, conversiones: 30 },
      { name: 'Vie', prospectos: 55, conversiones: 35 },
      { name: 'Sab', prospectos: 30, conversiones: 20 },
      { name: 'Dom', prospectos: 15, conversiones: 8 },
    ];

    return (
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-950 h-full">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-3">
          <BarChart2 className="text-[#E30613]" /> Inteligencia Comercial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform text-[#FFCC00]"><TrendingUp size={64} /></div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Pollo Desplazado MTD</p>
            <p className="text-4xl font-black text-white">45.2 <span className="text-lg text-zinc-500">Ton</span></p>
          </div>
          <div className="bg-black border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform text-[#E30613]"><Target size={64} /></div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Tasa Cierre Global</p>
            <p className="text-4xl font-black text-white">58% <span className="text-lg text-emerald-500">↑ 14%</span></p>
          </div>
          <div className="bg-black border border-zinc-800 p-6 rounded-2xl relative flex flex-col justify-end min-h-[140px] overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
              <img src="/5.png" alt="Planta" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <div className="relative z-10 bg-black/60 backdrop-blur-md p-3 -m-6 rounded-b-2xl border-t border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2"><MapPin size={12} className="text-[#E30613]" /> Planta Central Activa</p>
            </div>
          </div>
        </div>

        {/* Dynamic Recharts Chart */}
        <div className="h-80 border border-zinc-800 rounded-2xl bg-black p-6 relative">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
            <Activity className="text-[#E30613] animate-pulse" size={16} /> Tendencia de Generación vs Conversión
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={dataChart}>
              <defs>
                <linearGradient id="colorProspectos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E30613" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E30613" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversiones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFCC00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis stroke="#52525b" axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="prospectos" name="Ventas/Prospectos" stroke="#E30613" strokeWidth={3} fillOpacity={1} fill="url(#colorProspectos)" />
              <Area type="monotone" dataKey="conversiones" name="Cierres Exitosos" stroke="#FFCC00" strokeWidth={3} fillOpacity={1} fill="url(#colorConversiones)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  function AgentsView() {
    return (
      <div className="flex-1 p-8 bg-zinc-950 h-full overflow-y-auto">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-3 mb-8">
          <Users className="text-[#FFCC00]" /> Rendimiento Fuerza de Ventas
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {agents.map(a => (
            <div key={a.id} className="bg-black border border-zinc-800 rounded-2xl relative overflow-hidden group flex flex-col shadow-lg">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full border-[20px] border-zinc-900 opacity-50 group-hover:scale-150 transition-all duration-700 pointer-events-none" />

              <div className="p-6 border-b border-zinc-800/80 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${a.bg} flex items-center justify-center text-xl font-black ${a.color} border ${a.border}`}>{a.avatar}</div>
                  <div>
                    <h3 className="text-xl font-black text-white">{a.name}</h3>
                    <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5"><Activity size={10} className="text-[#25D366]" /> {a.lastSeen}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4 relative z-10 flex-1">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-center">
                  <p className="text-[9px] uppercase tracking-widest text-[#FFCC00] mb-1 font-bold">Ventas Mensuales</p>
                  <p className="text-xl font-black text-white font-mono">{a.sales}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-center">
                  <p className="text-[9px] uppercase tracking-widest text-[#E30613] mb-1 font-bold">Tasa Conversión</p>
                  <p className="text-xl font-black text-white font-mono">{a.conversion}</p>
                </div>

                <div className="col-span-2 pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Saturación / Carga Asignada</span>
                    <span className="text-[10px] text-white font-mono font-bold">{a.capacity}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-1.5 ${a.capacity > 85 ? 'bg-[#E30613]' : 'bg-[#FFCC00]'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${a.capacity}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-800 flex justify-between items-center relative z-10">
                <span className="text-xs text-zinc-500 font-medium">Leads Activos Vigentes: <strong className="text-white font-mono">{a.active}</strong></span>
                <button className="text-[10px] font-bold text-white uppercase tracking-widest border border-zinc-700 hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors">Operar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
