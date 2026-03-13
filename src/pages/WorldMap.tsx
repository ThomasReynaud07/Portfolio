import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { Shield, Activity, Globe, Zap, AlertTriangle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GEOJSON_URL = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

// Simulation de base de données par pays (tu pourrais charger ça depuis un JSON externe)
const COUNTRY_DATA: Record<string, { security: number, threat: string, status: string }> = {
  "United States": { security: 92, threat: "High", status: "Monitoring" },
  "China": { security: 85, threat: "Critical", status: "Active_Firewall" },
  "France": { security: 88, threat: "Low", status: "Secure" },
  "Russia": { security: 74, threat: "Critical", status: "Unstable" },
  "Brazil": { security: 65, threat: "Moderate", status: "Maintenance" },
  "Germany": { security: 95, threat: "Minimal", status: "Optimal" },
  // Par défaut pour les autres : généré dynamiquement
};

const TacticalMap = () => {
  const [attacks, setAttacks] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // Générateur d'attaques "réalistes"
  useEffect(() => {
    const interval = setInterval(() => {
      // Liste de pays sources probables (ISO codes approximatifs ou noms)
      const sources = [[-100, 40], [105, 35], [100, 60], [2, 48]]; // USA, Chine, Russie, France
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      const newAtk = {
        id: Date.now(),
        from: source,
        to: [Math.random() * 300 - 150, Math.random() * 100 - 40],
        color: Math.random() > 0.5 ? "#f87171" : "#fbbf24",
        label: Math.random() > 0.7 ? "SQL_INJECTION" : "BRUTE_FORCE",
        time: new Date().toLocaleTimeString(),
      };
      setAttacks((prev) => [newAtk, ...prev.slice(0, 5)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#020617] text-slate-300 font-mono flex flex-col overflow-hidden relative">
      
      {/* BACKGROUND: Grille technique fine sans radar */}
      <div className="absolute inset-0 opacity-[0.15]" 
           style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      {/* HEADER MINIMALISTE PRO */}
      <div className="h-14 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4">
          <Shield className="text-emerald-500" size={18} />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-white uppercase">Threat_Intelligence_Center</span>
            <span className="text-[9px] text-slate-500 font-bold tracking-tight">ENCRYPTED_SESSION: {Math.random().toString(16).slice(2,10)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500 font-bold uppercase">System_Healthy</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <Search size={16} className="text-slate-500 cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* MAP CONTAINER */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)]">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 145 }} className="w-full h-full">
            <Geographies geography={GEOJSON_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties.name;
                  const data = COUNTRY_DATA[name] || { security: 50 + Math.random() * 30, threat: "Unknown", status: "Idle" };
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => setSelectedCountry({ ...geo.properties, ...data })}
                      style={{
                        default: { fill: "#1e293b", stroke: "#020617", strokeWidth: 0.5, outline: "none" },
                        hover: { fill: "#334155", stroke: "#64748b", strokeWidth: 1, cursor: "pointer", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {attacks.map((atk) => (
              <g key={atk.id}>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0.5, 0] }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  d={`M ${atk.from[0]} ${atk.from[1]} L ${atk.to[0]} ${atk.to[1]}`}
                  fill="none"
                  stroke={atk.color}
                  strokeWidth="0.8"
                />
                <Marker coordinates={atk.to}>
                  <motion.circle r={2} fill={atk.color} initial={{ scale: 0 }} animate={{ scale: [1, 2, 1] }} />
                </Marker>
              </g>
            ))}
          </ComposableMap>
        </div>

        {/* SIDEBAR DÉTAILS - DONNÉES VARIABLES */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div 
              initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
              className="w-80 border-l border-slate-800 bg-slate-950 p-6 flex flex-col z-40"
            >
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-lg font-bold text-white uppercase tracking-tighter">{selectedCountry.name}</h2>
                <button onClick={() => setSelectedCountry(null)}><X size={18} /></button>
              </div>

              <div className="space-y-6">
                <section>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Security_Index</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-emerald-500">{selectedCountry.security.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-600 mb-1">/ 100</span>
                  </div>
                </section>

                <div className="h-px bg-slate-800" />

                <section className="space-y-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 uppercase font-bold">Threat_Level</span>
                    <span className={`font-black ${selectedCountry.threat === 'Critical' ? 'text-red-500' : 'text-orange-400'}`}>
                      {selectedCountry.threat}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 uppercase font-bold">Node_Status</span>
                    <span className="text-emerald-400 font-mono italic">{selectedCountry.status}</span>
                  </div>
                </section>

                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                  <p className="text-[9px] text-slate-500 uppercase mb-2">Recent_Activity</p>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <Activity size={12} className="text-emerald-500" />
                    <span>0 Latency detected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER LOGS */}
      <footer className="h-16 border-t border-slate-800 bg-slate-950 flex items-center px-6 gap-8 text-[10px] font-bold">
        <div className="flex items-center gap-2 text-slate-500 border-r border-slate-800 pr-8 uppercase">
          <Globe size={14} />
          <span>Live_Traffic_Analyzer</span>
        </div>
        <div className="flex-1 flex gap-10 overflow-hidden">
          {attacks.map((atk) => (
            <div key={atk.id} className="flex gap-3 items-center whitespace-nowrap animate-in fade-in slide-in-from-right">
              <span style={{ color: atk.color }}>[{atk.label}]</span>
              <span className="text-slate-600 tracking-tighter italic">SRC_IP: 192.168.{Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default TacticalMap;