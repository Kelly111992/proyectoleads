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
    { time: "00:00", user: "SYS", action: "Iniciando Sistema", lead: "CLAVE_AI" }
  ]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('elite_leads_view')
        .select('*');

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
    const qualified = data.filter(l => l.type === 'Qualified' || l.type === 'SQL').length;
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
        .update({ whatsapp_sent: true, action_status: 'Contactado' })
        .eq('id', id);

      const newLog = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: "VENTAS",
        action: "WhatsApp_Catalogo_Enviado",
        lead: name.split(' ')[0]
      };
      setLogs(prev => [newLog, ...prev.slice(0, 3)]);
      alert(`Catálogo solicitado para ${name} - Enviado con éxito`);
      fetchLeads();
    } catch (error) {
      console.error(error);
      alert("Error logístico: Verifica la conexión con Evolution API.");
    } finally {
      setIsSending(null);
    }
  };

  const handleCaptureLead = async () => {
    const demoNames = ["Juan Perez", "Maria Garcia", "Distribuidora San Juan", "Pollos El Granjero", "Restaurante La Parilla"];
    const products = ["Pollo en Canal", "Pechuga Deshuesada", "Alas Adobadas", "Piel de Pollo"];
    const name = demoNames[Math.floor(Math.random() * demoNames.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    const { error } = await supabase.from('leads').insert([{
      from_name: name,
      phone: '5213318213624',
      source: 'Dashboard_Manual',
      score: Math.floor(Math.random() * 40) + 60,
      stage: 'MQL',
      action_status: 'Nuevo',
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-[#E30613] selection:text-white relative overflow-hidden">
      {/* Brand Accents */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E30613] via-[#FFCC00] to-[#E30613] z-50" />

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E30613]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFCC00]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation / Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 group">
              <img
                src="https://media.licdn.com/dms/image/v2/C4E0BAQE8o-zH5W8gWQ/company-logo_200_200/company-logo_200_200/0/1630646197361?e=2147483647&v=beta&t=XfVp9R0FkY8fUQ-o0_W_wP7zH2L8X1v9K4x3K0Y_z8k"
                alt="ALTEPSA"
                className="h-10 w-auto group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#E30613]">ALTEPSA <span className="text-[#FFCC00]">ELITE</span></h1>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Sincronización GDL Activa
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 px-8 border-x border-gray-100 h-full">
            <button className="text-[#E30613] font-bold text-xs uppercase tracking-widest border-b-2 border-[#E30613] pb-1">Dashboard</button>
            <button className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors">Logística</button>
            <button className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors">Producción</button>
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCaptureLead}
              className="bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 transition-all flex items-center gap-3"
            >
              <Users size={14} />
              Capturar Lead
            </motion.button>
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <User size={20} className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-14 space-y-12">
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-red-50 text-[#E30613] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">Panel de Control de Leads</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-[#1A1A1A]">
                Tecnología en <span className="text-[#E30613]">Aves</span> y Pastas
              </h2>
            </div>
            <div className="flex flex-col items-end text-right">
              <div className="text-4xl font-black text-[#E30613]">{(leads.length * 12.5).toFixed(0)}%</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Crecimiento Mensual_GDL</div>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              label="Prospectos Totales"
              value={stats.total}
              icon={<Users className="text-[#E30613]" />}
              sub="Detección Multicanal"
            />
            <MetricCard
              label="Interacción Activa"
              value={`${leads.filter(l => l.action_status?.includes('IA')).length}`}
              icon={<Zap className="text-[#FFCC00]" />}
              sub="Automatización Llama 3.3"
              isHighlight
            />
            <MetricCard
              label="Eficiencia Cierre"
              value={stats.conversion}
              icon={<Target className="text-green-600" />}
              sub="GDL HQ Performance"
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Leads List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Package size={24} className="text-[#E30613]" />
                  Pipeline de Ventas
                </h3>
                <div className="flex gap-2">
                  {["All", "MQL", "SQL"].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === f ? 'bg-[#E30613] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <Loader2 className="animate-spin text-[#E30613] mb-4" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Procesando Cargamento de Datos...</p>
                  </div>
                ) : (
                  leads.map(lead => (
                    <LeadCardItem key={lead.id} lead={lead} onSend={() => handleWhatsAppQuickSend(lead.phone, lead.from_name, lead.id)} />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar / Logs */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-gray-400 border-b border-gray-50 pb-4">Actividad Logística IA</h4>
                <div className="space-y-6">
                  {leads.slice(0, 6).map((log, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${log.action_status?.includes('IA') ? 'bg-red-50 text-[#E30613]' : 'bg-gray-50 text-gray-400'
                        }`}>
                        <MessageCircle size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{log.from_name}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter line-clamp-1">{log.action_status || 'Registrado'}</p>
                      </div>
                      <span className="text-[9px] font-mono text-gray-300">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E30613] rounded-bl-full opacity-20 transition-all duration-700 group-hover:scale-150" />
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 text-[#FFCC00]">Soporte Técnico Elite</h4>
                <p className="text-sm font-bold leading-relaxed mb-6">¿Necesitas ajustes en la respuesta del bot para productos específicos?</p>
                <button className="w-full py-3 bg-[#E30613] rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all">Hablar con Soporte</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, sub, isHighlight }: any) {
  return (
    <div className={`p-8 rounded-3xl transition-all border group relative overflow-hidden h-32 flex flex-col justify-center ${isHighlight ? 'bg-white border-[#E30613]/20 shadow-xl shadow-red-500/5' : 'bg-white border-gray-100'
      }`}>
      <div className="flex justify-between items-center mb-2">
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-red-50 transition-colors">
          {icon}
        </div>
        <div className="text-3xl font-black tracking-tighter">{value}</div>
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
        <div className="text-[8px] font-bold text-[#E30613] mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{sub}</div>
      </div>
    </div>
  );
}

function LeadCardItem({ lead, onSend }: any) {
  const isBotActive = lead.action_status?.includes('IA');
  return (
    <motion.div
      whileHover={{ x: 10 }}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-6 group"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-500 ${isBotActive ? 'bg-[#E30613] text-white -rotate-3 scale-110' : 'bg-gray-100 text-gray-400'
        }`}>
        {lead.from_name[0]}
      </div>

      <div className="flex-1 text-center md:text-left min-w-0">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
          <h4 className="text-lg font-black tracking-tight group-hover:text-[#E30613] transition-colors uppercase">{lead.from_name}</h4>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-black uppercase tracking-widest">{lead.stage}</span>
          {isBotActive && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-[#E30613] rounded text-[9px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#E30613] rounded-full animate-pulse" />
              IA Atendiendo
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2">
          <Smartphone size={12} /> {lead.phone}
        </p>
        <p className="text-gray-500 mt-2 italic text-sm line-clamp-1 border-l-2 border-[#FFCC00] pl-3 opacity-60 group-hover:opacity-100 transition-opacity">
          "{lead.body_preview || 'Sin mensaje previo registrado en el cargamento'}"
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSend}
          className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-90"
        >
          <Send size={18} />
        </button>
        <div className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-600 cursor-pointer">
          <ChevronRight size={20} />
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
