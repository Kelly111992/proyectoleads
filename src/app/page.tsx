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
  Globe,
  Loader2,
  User,
  Package,
  Smartphone,
  Send
} from "lucide-react";
import { useState, useEffect } from "react";
import { evolutionApi } from "@/lib/evolution";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isSending, setIsSending] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    conversion: "0%",
    projected: "$0"
  });

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
    const qualified = data.filter(l => l.stage?.includes('Qualified') || l.stage === 'SQL').length;
    const conversion = total > 0 ? ((qualified / total) * 100).toFixed(1) + "%" : "0%";
    const projected = (qualified * 1500).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    setStats({
      total,
      conversion,
      projected
    });
  };

  const handleWhatsAppQuickSend = async (phone: string, name: string, id: number) => {
    setIsSending(name);
    try {
      const message = `¡Hola ${name}! 🍗 Soy del equipo de ventas de ALTEPSA. Recibimos tu interés en nuestros productos avícolas y pastas. ¿Te gustaría que te enviemos nuestro catálogo actualizado de pechugas y pollo en canal hoy mismo?`;
      await evolutionApi.sendMessage(phone, message);

      // Actualizar estado en Supabase
      await supabase
        .from('leads')
        .update({
          whatsapp_sent: true,
          action_status: 'Contactado',
          last_follow_up: new Date().toISOString()
        })
        .eq('id', id);

      const newLog = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: "TEAM",
        action: "FollowUp_Sent",
        lead: name.split(' ')[0]
      };
      setLogs(prev => [newLog, ...prev.slice(0, 3)]);
      fetchLeads();
    } catch (error) {
      console.error(error);
      alert("Error logístico: Verifica la conexión con Evolution API.");
    } finally {
      setIsSending(null);
    }
  };

  const handleAssignLead = async (leadId: number, vendedorName: string) => {
    try {
      setLoading(true);
      await supabase
        .from('leads')
        .update({
          assigned_agent: vendedorName,
          action_status: 'Asignado'
        })
        .eq('id', leadId);

      const newLog = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: "CRM",
        action: `Lead_Asignado_a_${vendedorName}`,
        lead: "SYS"
      };
      setLogs(prev => [newLog, ...prev.slice(0, 3)]);
      fetchLeads();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureLead = async () => {
    const demoNames = ["Juan Perez", "Maria Garcia", "Distribuidora San Juan", "Pollos El Granjero", "Restaurante La Parilla"];
    const products = ["Pollo en Canal", "Pechuga Deshuesada", "Alas Adobadas", "Piel de Pollo"];
    const name = demoNames[Math.floor(Math.random() * demoNames.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    // Auto-asignación simple para la demo (Round Robin)
    const assignedTo = vendedores[leads.length % vendedores.length].name;

    const { error } = await supabase.from('leads').insert([{
      from_name: name,
      phone: '5213318213624',
      source: 'Dashboard_Manual',
      score: Math.floor(Math.random() * 40) + 60,
      stage: 'MQL',
      action_status: 'Asignado',
      assigned_agent: assignedTo,
      body_preview: `Busco información sobre ${product}`
    }]);

    if (error) alert("Error capturando: " + error.message);
    else fetchLeads();
  };

  const agents = [
    { id: 'arkel', name: 'ARKEL', status: 'Online', color: 'bg-green-500' },
    { id: 'claudia', name: 'CLAVE_AI', status: 'Processing', color: 'bg-brand-cyan' },
    { id: 'bot_01', name: 'ELITE_BOT', status: 'Idle', color: 'bg-white/20' }
  ];

  useEffect(() => {
    setMounted(true);
    fetchLeads();

    // Realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchLeads();

          if (payload.eventType === 'INSERT') {
            const newLead = payload.new;
            const newLog = {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              user: "SYS_BOT",
              action: "Nuevo Lead Detectado",
              lead: newLead.from_name || "Anónimo"
            };
            setLogs(prev => [newLog, ...prev.slice(0, 3)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-[#1A1A1A] font-sans selection:bg-[#E30613] selection:text-white relative overflow-hidden bg-white">
      {/* Dynamic Background Layer */}
      <div
        className="fixed inset-0 z-0 opacity-15 grayscale-[0.5] scale-110 motion-safe:animate-[pulse_10s_infinite]"
        style={{
          backgroundImage: 'url("/bg-altepsa.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px) brightness(1.2)'
        }}
      />

      {/* Overlay Gradients */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-br from-white/90 via-white/40 to-[#FFCC00]/10" />

      {/* Brand Accents */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E30613] via-[#FFCC00] to-[#E30613] z-50" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation / Header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-gray-100/50 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="bg-white p-1 rounded-2xl shadow-xl shadow-red-500/10 border border-gray-100 group overflow-hidden">
              <img
                src="/logo-altepsa.png"
                alt="ALTEPSA"
                className="h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-[#E30613] flex items-center gap-2">
                ALTEPSA
                <span className="text-[10px] bg-[#FFCC00] text-black px-2 py-0.5 rounded-full font-black tracking-widest uppercase shadow-sm">ELITE</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                NODO ALTA TECNOLOGÍA_GDL
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 px-10 border-x border-gray-100/50 h-10">
            <button
              onClick={() => setActiveTab("leads")}
              className={`${activeTab === "leads" ? 'text-[#E30613] border-[#E30613]' : 'text-gray-400'} font-black text-[11px] uppercase tracking-[0.2em] border-b-2 pb-1 transition-all`}
            >
              Inteligencia
            </button>
            <button
              onClick={() => setActiveTab("crm")}
              className={`${activeTab === "crm" ? 'text-[#E30613] border-[#E30613]' : 'text-gray-400'} font-black text-[11px] uppercase tracking-[0.2em] border-b-2 pb-1 transition-all`}
            >
              CRM & Seguimiento
            </button>
            <button className="text-gray-400 hover:text-[#1A1A1A] font-black text-[11px] uppercase tracking-[0.2em] transition-all">Logística</button>
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Status</span>
              <span className="text-[10px] font-bold text-green-600 uppercase">Synchronized</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCaptureLead}
              className="bg-[#E30613] hover:bg-[#c40510] text-white px-7 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_10px_25px_-5px_rgba(227,6,19,0.3)] transition-all flex items-center gap-3 active:shadow-none"
            >
              <Plus size={16} />
              Capturar Lead
            </motion.button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12 lg:p-16 space-y-16">
          {/* Hero Section */}
          <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm">
                <Sparkles size={14} className="text-[#FFCC00]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E30613]">Sales Intelligence v5.0</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-[#1A1A1A]">
                Potenciando la <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-[#FFCC00]">Industria de Ave</span>
              </h2>
              <p className="text-gray-500 font-medium max-w-lg text-lg leading-relaxed">
                Gestión avanzada de prospectos y automatización logística para el sector alimentario jalisciense.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm">
                <div className="text-3xl font-black text-[#E30613]">{(leads.length * 8.4).toFixed(1)}%</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Score Global_GDL</div>
              </div>
              <div className="bg-[#E30613] p-6 rounded-3xl shadow-xl shadow-red-500/20">
                <div className="text-3xl font-black text-white">{leads.length}</div>
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">Leads Activos</div>
              </div>
            </div>
          </section>

          {/* Core Stats Bar */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MetricCard
              label="Prospectos Totales"
              value={stats.total}
              icon={<Users className="text-[#E30613]" />}
              sub="Cargamento detectado"
            />
            <MetricCard
              label="Engagement IA"
              value={`${leads.filter(l => l.action_status?.includes('IA')).length}`}
              icon={<MessageSquare className="text-[#FFCC00]" />}
              sub="Llama-3.3 en servicio"
              isHighlight
            />
            <MetricCard
              label="Conversión Proyectada"
              value={stats.conversion}
              icon={<TrendingUp className="text-green-600" />}
              sub="GDL Market Target"
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sales Pipeline */}
            <div className="lg:col-span-8 space-y-8">
              {activeTab === "leads" ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                    <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
                      <div className="p-2 bg-[#E30613] rounded-xl shadow-lg shadow-red-500/10">
                        <Package size={24} className="text-white" />
                      </div>
                      Pipeline de Ventas
                    </h3>
                    <div className="flex p-1.5 bg-gray-100/50 backdrop-blur-lg rounded-2xl border border-gray-200/50">
                      {["All", "MQL", "SQL"].map(f => (
                        <button
                          key={f}
                          onClick={() => setFilterStatus(f)}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === f ? 'bg-white text-[#E30613] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5">
                    {loading ? (
                      <div className="h-96 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-inner">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#E30613]/20 blur-xl rounded-full animate-pulse" />
                          <Loader2 className="animate-spin text-[#E30613] relative z-10" size={48} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E30613] mt-8 animate-pulse">Sincronizando Nodo Logístico...</p>
                      </div>
                    ) : (
                      leads
                        .filter(lead => lead && (filterStatus === "All" || lead.stage === filterStatus || lead.type === filterStatus))
                        .map(lead => (
                          <LeadCardItem
                            key={lead.id}
                            lead={lead}
                            vendedores={vendedores}
                            onAssign={handleAssignLead}
                            onSend={() => handleWhatsAppQuickSend(lead.phone || '', lead.from_name || 'Prospecto', lead.id)}
                          />
                        ))
                    )}
                  </div>
                </>
              ) : (
                <CRMView
                  leads={leads}
                  vendedores={vendedores}
                  onAssign={handleAssignLead}
                  onSend={handleWhatsAppQuickSend}
                />
              )}
            </div>

            {/* AI Control Center */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-10 border border-white/50 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFCC00]/10 rounded-full blur-3xl opacity-50" />
                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] mb-8 text-[#E30613] border-b border-gray-100 pb-4">Activity Log_</h4>
                <div className="space-y-8">
                  {leads && leads.length > 0 ? (
                    leads.slice(0, 5).map((log, i) => (
                      <div key={i} className="flex gap-5 items-start relative">
                        {i !== 4 && <div className="absolute left-[15px] top-8 w-0.5 h-10 bg-gray-100" />}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all shadow-lg ${log.action_status?.includes('IA') ? 'bg-[#E30613] text-white' : 'bg-white text-gray-300 border border-gray-100'
                          }`}>
                          <Zap size={12} fill={log.action_status?.includes('IA') ? "currentColor" : "none"} />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-sm font-black text-gray-900 leading-none mb-1 truncate">{log.from_name || 'Sistema'}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{log.action_status || 'Nueva Entrada'}</p>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 mt-1">
                          {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-10 opacity-30">
                      <Database size={32} className="mb-2" />
                      <p className="text-[10px] font-black uppercase">Sin datos en red</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-[40px] p-10 text-white shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E30613] rounded-bl-full opacity-10 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-[2]" />
                <div className="relative z-10">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.3em] mb-4 text-[#FFCC00]">Soporte ALTEPSA Elite</h4>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">
                    Sincronización directa con el centro de distribución de Guadalajara para pedidos masivos.
                  </p>
                  <button className="w-full py-4 bg-[#E30613] rounded-2xl text-xs font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl shadow-red-600/20 hover:brightness-110">
                    Contactar HQ
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function CRMView({ leads, vendedores, onAssign, onSend }: any) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 uppercase">
          <Users className="text-[#E30613]" /> Equipo de Ventas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vendedores.map((v: any) => (
          <div key={v.id} className="bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 group hover:-translate-y-2 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                {v.name.charAt(0)}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-gray-900">{v.leads}</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest uppercase">Asignaciones</div>
              </div>
            </div>
            <h5 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{v.name}</h5>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${v.performance}%` }} />
              </div>
              <span className="text-[10px] font-black text-green-600">{v.performance}%</span>
            </div>
            <button className="w-full py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E30613] transition-colors shadow-lg shadow-gray-900/10">
              Ver Reporte
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black tracking-tight px-4 uppercase">Control de Seguimiento_ HQ</h3>
        <div className="grid gap-4">
          {leads.slice(0, 10).map((lead: any) => (
            <div key={lead.id} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold group-hover:bg-[#E30613]/5 group-hover:text-[#E30613] transition-all">
                {lead.from_name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h6 className="font-black text-gray-800 uppercase tracking-tighter">{lead.from_name}</h6>
                <p className="text-[10px] text-gray-400 font-bold flex items-center gap-2">
                  Último contacto: {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'Pendiente'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Responsable</div>
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.assigned_agent || ""}
                      onChange={(e) => onAssign(lead.id, e.target.value)}
                      className="text-[10px] font-black uppercase bg-gray-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#E30613] appearance-none cursor-pointer"
                    >
                      <option value="">Sin Asignar</option>
                      {vendedores.map((v: any) => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => onSend(lead.phone, lead.from_name, lead.id)}
                  className="p-3 bg-gray-900 text-white rounded-xl hover:bg-[#E30613] transition-all active:scale-90"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, sub, isHighlight }: any) {
  return (
    <div className={`p-10 rounded-[40px] transition-all border group relative overflow-hidden ${isHighlight ? 'bg-white border-[#E30613]/30 shadow-2xl shadow-red-500/10' : 'bg-white/60 backdrop-blur-xl border-white/50 shadow-xl shadow-gray-200/50'
      }`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 rounded-2xl bg-gray-50 group-hover:bg-[#E30613]/10 transition-colors shadow-sm">
          {icon}
        </div>
        <div className="text-4xl font-black tracking-tighter text-gray-900">{value}</div>
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
        <div className="text-[9px] font-bold text-[#E30613] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 uppercase tracking-widest">{sub}</div>
      </div>
    </div>
  );
}

function LeadCardItem({ lead, onSend, vendedores, onAssign }: any) {
  if (!lead) return null;
  const isBotActive = lead.action_status?.includes('IA');
  const name = lead.from_name || "Sin nombre";
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 12, backgroundColor: "rgba(255,255,255,0.9)" }}
      className="bg-white/80 backdrop-blur-lg p-7 rounded-[32px] border border-white/50 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden"
    >
      {isBotActive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 -mr-16 -mt-16 rounded-full blur-2xl opacity-50" />
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-20">
        {lead.priority === 'Alta' && (
          <span className="bg-red-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-red-500/30 tracking-widest">Prioridad_Alta</span>
        )}
      </div>

      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl transition-all duration-700 relative z-10 ${isBotActive ? 'bg-gradient-to-br from-[#E30613] to-[#c40510] text-white -rotate-6 scale-110 shadow-red-500/30' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-[#E30613] border border-transparent group-hover:border-gray-100'
        }`}>
        {initial}
      </div>

      <div className="flex-1 text-center md:text-left min-w-0 relative z-10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
          <h4 className="text-xl font-black tracking-tight text-gray-900 group-hover:text-[#E30613] transition-colors uppercase">{name}</h4>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest">{lead.stage || 'MQL'}</span>
            {isBotActive && (
              <span className="flex items-center gap-2 px-3 py-1 bg-[#E30613] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/10">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                ALTEPSA BOT
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-3">
          <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2">
            <Smartphone size={14} className="text-[#E30613]" /> {lead.phone || 'Sin contacto'}
          </p>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            <User size={12} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">
              {lead.assigned_agent || (
                <select
                  className="bg-transparent border-none p-0 text-[10px] focus:ring-0 appearance-none cursor-pointer"
                  onChange={(e) => onAssign(lead.id, e.target.value)}
                >
                  <option>Asignar...</option>
                  {vendedores.map((v: any) => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              )}
            </span>
          </div>
          <p className="text-[11px] text-[#FFCC00] font-black uppercase tracking-widest">
            Score: {lead.score || 0}%
          </p>
        </div>
        <p className="text-gray-400 font-medium text-sm line-clamp-1 border-l-4 border-[#FFCC00]/50 pl-4 bg-gray-50/50 py-1.5 rounded-r-lg group-hover:bg-[#FFCC00]/5 transition-colors">
          "{lead.body_preview || 'Sin registro de comunicación previa cargado'}"
        </p>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={onSend}
          className="w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl shadow-xl shadow-green-500/30 transition-all active:scale-90 flex items-center justify-center group/btn"
        >
          <div className="flex flex-col items-center gap-0.5">
            <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            <span className="text-[7px] font-black uppercase">Seguimiento</span>
          </div>
        </button>
        <div className="w-12 h-16 flex items-center justify-center text-gray-300 hover:text-[#E30613] cursor-pointer transition-colors bg-gray-50 rounded-2xl border border-gray-100">
          <ChevronRight size={24} />
        </div>
      </div>
    </motion.div>
  );
}

function NavIcon({ icon, active, onClick, tooltip }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-xl transition-all duration-300 group ${active ? 'bg-[#E30613] text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:bg-gray-50'}`}
    >
      {icon}
      <div className="absolute left-full ml-4 px-3 py-1 bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
        {tooltip}
      </div>
    </button>
  );
}
