import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { Target, Zap, Radio, X, Activity } from "lucide-react";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const TacticalMap = () => {
  const [attacks, setAttacks] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = [
        { key: "CYBER", color: "#00d4ff" },
        { key: "STRIKE", color: "#ff4d4d" },
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      const newAttack = {
        id: Date.now(),
        from: [Math.random() * 300 - 150, Math.random() * 100 - 40],
        to: [Math.random() * 300 - 150, Math.random() * 100 - 40],
        color: type.color,
        label: type.key,
        time: new Date().toLocaleTimeString(),
      };
      setAttacks((prev) => [newAttack, ...prev.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    /* h-[calc(100vh-NavHeight)] pour laisser la place à ta nav en haut */
    <div className="w-full h-[calc(100vh-64px)] bg-[#0f172a] text-slate-200 font-mono flex flex-col overflow-hidden border-t border-slate-700">
      {/* HEADER INTERNE (Sert de sous-nav tactique) */}
      <div className="h-12 border-b border-slate-700 bg-[#1e293b]/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Radio className="text-cyan-400 animate-pulse" size={16} />
          <span className="text-[10px] font-bold tracking-widest uppercase italic">
            Intel_Dashboard_v6.2
          </span>
        </div>
        <div className="text-[9px] text-slate-500 uppercase font-bold">
          Secure_Connection: Active
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* CARTE BLUEPRINT */}
        <div className="flex-1 bg-[#0f172a] relative flex items-center justify-center p-4">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140 }}
            className="w-full h-full"
          >
            <Geographies geography={GEOJSON_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => setSelectedCountry(geo.properties)}
                    style={{
                      default: {
                        fill: "#1e293b",
                        stroke: "#334155",
                        strokeWidth: 0.8,
                        outline: "none",
                      },
                      hover: {
                        fill: "#334155",
                        stroke: "#00d4ff",
                        strokeWidth: 1.5,
                        cursor: "pointer",
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {attacks.map((atk) => (
              <g key={atk.id}>
                <Line
                  from={atk.from}
                  to={atk.to}
                  stroke={atk.color}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  className="animate-[dash_2s_linear_infinite]"
                />
                <Marker coordinates={atk.to}>
                  <circle
                    r={5}
                    fill={atk.color}
                    className="animate-ping opacity-30"
                  />
                  <circle r={2.5} fill={atk.color} />
                </Marker>
              </g>
            ))}
          </ComposableMap>
        </div>

        {/* SIDEBAR DÉTAILS */}
        {selectedCountry && (
          <div className="w-64 border-l border-slate-700 bg-[#1e293b]/90 backdrop-blur-md p-5 animate-in slide-in-from-right duration-300 shadow-2xl z-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-black uppercase text-cyan-400">
                {selectedCountry.name}
              </h2>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bg-black/20 p-3 border border-slate-700 text-[10px] text-slate-400 space-y-2 uppercase italic">
              <p>• Threat_Vector: Low</p>
              <p>• Data_Integrity: 98%</p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ALERTS */}
      <div className="h-16 border-t border-slate-700 bg-[#1e293b] flex items-center px-6 gap-6 shrink-0 shadow-inner">
        <div className="flex items-center gap-2 border-r border-slate-700 pr-6 shrink-0">
          <Activity size={14} className="text-cyan-500" />
          <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
            Live_Logs
          </span>
        </div>
        <div className="flex flex-1 gap-4 overflow-hidden">
          {attacks.map((atk) => (
            <div
              key={atk.id}
              className="min-w-[140px] bg-slate-800/40 border border-slate-700 p-2 rounded flex flex-col justify-center animate-in fade-in slide-in-from-right"
            >
              <span
                className="text-[8px] font-bold"
                style={{ color: atk.color }}
              >
                {atk.label}
              </span>
              <span className="text-[7px] text-slate-500 italic uppercase">
                Coord: {atk.to[1].toFixed(0)}N
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dash { to { stroke-dashoffset: -40; } }
      `}</style>
    </div>
  );
};

export default TacticalMap;
