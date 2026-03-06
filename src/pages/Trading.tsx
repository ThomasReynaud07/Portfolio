import { useEffect, useRef, useState } from "react";

const Trading = () => {
  const container = useRef<HTMLDivElement>(null);

  // --- ÉTAT DU COMPTE ---
  const [balance, setBalance] = useState(10000);
  const [position, setPosition] = useState<{
    type: "BUY" | "SELL";
    entry: number;
    sl: number;
    tp: number;
    time: string;
  } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [pnl, setPnl] = useState(0);

  // --- PARAMÈTRES DE RISK ---
  const [slInput, setSlInput] = useState(25);
  const [tpInput, setTpInput] = useState(50);

  // 1. CHARGEMENT DU GRAPHIQUE (TRADINGVIEW)
  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // Nettoyage pour éviter les doublons
    currentContainer.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "OANDA:XAUUSD",
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "fr",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      container_id: "tradingview_canvas",
      support_host: "https://www.tradingview.com",
    });

    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) currentContainer.innerHTML = "";
    };
  }, []);

  // 2. LOGIQUE DU MARCHÉ (SL / TP / PNL)
  useEffect(() => {
    if (!position) return;

    const interval = setInterval(() => {
      // Simulation d'une variation de prix
      const move = (Math.random() - 0.5) * 4;
      const nextPnl = pnl + (position.type === "BUY" ? move : -move);

      if (nextPnl <= -position.sl) {
        autoClose(nextPnl, "STOP LOSS");
        clearInterval(interval);
      } else if (nextPnl >= position.tp) {
        autoClose(nextPnl, "TAKE PROFIT");
        clearInterval(interval);
      } else {
        setPnl(nextPnl);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [position, pnl]);

  const openTrade = (type: "BUY" | "SELL") => {
    if (position) return;
    setPosition({
      type,
      entry: 2155.5,
      sl: slInput,
      tp: tpInput,
      time: new Date().toLocaleTimeString(),
    });
    setPnl(0);
  };

  const autoClose = (finalPnl: number, reason: string) => {
    setBalance((prev) => prev + finalPnl);
    setHistory((prev) => [
      {
        type: position?.type,
        pnl: finalPnl,
        reason,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setPosition(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] pt-16 font-mono text-white overflow-hidden">
      {/* HEADER : DASHBOARD STATS */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-[#111] border-b border-white/5 gap-4">
        <div className="flex gap-8">
          <div className="border-l-2 border-primary px-3">
            <p className="text-[9px] text-gray-500 uppercase">Balance</p>
            <p className="text-sm font-bold">${balance.toFixed(2)}</p>
          </div>
          <div className="border-l-2 border-gray-700 px-3">
            <p className="text-[9px] text-gray-500 uppercase">PnL Live</p>
            <p
              className={`text-sm font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {pnl >= 0 ? "+" : ""}
              {pnl.toFixed(2)}$
            </p>
          </div>
        </div>

        {!position && (
          <div className="flex gap-4 bg-black/50 p-2 rounded border border-white/5">
            <div className="flex flex-col">
              <label className="text-[8px] text-red-500 font-bold uppercase">
                Stop Loss $
              </label>
              <input
                type="number"
                value={slInput}
                onChange={(e) => setSlInput(Number(e.target.value))}
                className="bg-transparent text-xs w-16 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[8px] text-green-500 font-bold uppercase">
                Take Profit $
              </label>
              <input
                type="number"
                value={tpInput}
                onChange={(e) => setTpInput(Number(e.target.value))}
                className="bg-transparent text-xs w-16 outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!position ? (
            <>
              <button
                onClick={() => openTrade("BUY")}
                className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded text-[10px] font-black transition-all"
              >
                BUY / LONG
              </button>
              <button
                onClick={() => openTrade("SELL")}
                className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded text-[10px] font-black transition-all"
              >
                SELL / SHORT
              </button>
            </>
          ) : (
            <button
              onClick={() => autoClose(pnl, "MANUAL")}
              className="bg-white text-black px-8 py-2 rounded text-[10px] font-black animate-pulse"
            >
              CLOSE TRADE
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LE GRAPHIQUE */}
        <div
          className="flex-1 bg-black relative"
          ref={container}
          id="tradingview_canvas"
        />

        {/* SIDEBAR : MONITORING */}
        <div className="w-80 border-l border-white/5 bg-[#0f0f0f] flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-4 uppercase">
              Risk Monitor
            </h3>
            {position ? (
              <div className="space-y-4">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Type:</span>
                  <span
                    className={
                      position.type === "BUY"
                        ? "text-green-500"
                        : "text-red-500 font-bold"
                    }
                  >
                    {position.type} GOLD
                  </span>
                </div>
                <div className="relative h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full transition-all duration-300 ${pnl >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    style={{
                      left: "50%",
                      width: `${Math.min(Math.abs((pnl / (pnl >= 0 ? position.tp : position.sl)) * 50), 50)}%`,
                      transform: pnl >= 0 ? "" : "translateX(-100%)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                  <span>SL: -{position.sl}$</span>
                  <span>TP: +{position.tp}$</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-white/5 rounded">
                <p className="text-[10px] text-gray-600 italic uppercase">
                  Prêt pour exécution
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-[10px] font-bold text-gray-500 mb-4 uppercase">
              Trade Journal
            </h3>
            <div className="space-y-3">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="text-[10px] bg-white/5 p-3 rounded border-l-2 border-white/10"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">{h.reason}</span>
                    <span
                      className={h.pnl >= 0 ? "text-green-500" : "text-red-500"}
                    >
                      {h.pnl >= 0 ? "+" : ""}
                      {h.pnl.toFixed(2)}$
                    </span>
                  </div>
                  <div className="text-[8px] text-gray-600">{h.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
