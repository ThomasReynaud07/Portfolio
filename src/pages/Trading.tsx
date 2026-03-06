import { useEffect, useRef, useState } from "react";

const Trading = () => {
  const container = useRef<HTMLDivElement>(null);

  // --- ÉTAT DU COMPTE (Initialisé depuis le LocalStorage) ---
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("trading_balance");
    return saved ? JSON.parse(saved) : 10000;
  });

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("trading_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [position, setPosition] = useState<{
    type: "BUY" | "SELL";
    entry: number;
    sl: number;
    tp: number;
    time: string;
  } | null>(null);

  const [pnl, setPnl] = useState(0);

  // --- PARAMÈTRES DE RISK ---
  const [slInput, setSlInput] = useState(25);
  const [tpInput, setTpInput] = useState(50);

  // --- SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => {
    localStorage.setItem("trading_balance", JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("trading_history", JSON.stringify(history));
  }, [history]);

  // 1. CHARGEMENT DU GRAPHIQUE
  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

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

  // 2. LOGIQUE DU MARCHÉ
  useEffect(() => {
    if (!position) return;
    const interval = setInterval(() => {
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
    setBalance((prev: number) => prev + finalPnl);
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

  // Optionnel : bouton pour réinitialiser le compte
  const resetAccount = () => {
    if (
      confirm("Réinitialiser le capital à $10,000 et effacer l'historique ?")
    ) {
      setBalance(10000);
      setHistory([]);
      localStorage.clear();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] pt-16 font-mono text-white overflow-hidden md:overflow-hidden overflow-y-auto">
      {/* HEADER : DASHBOARD STATS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-4 md:px-6 py-4 bg-[#111] border-b border-white/5 gap-4">
        <div className="flex justify-between md:justify-start gap-4 md:gap-8">
          <div
            className="border-l-2 border-primary px-3 cursor-pointer group"
            onClick={resetAccount}
          >
            <p className="text-[9px] text-gray-500 uppercase group-hover:text-red-500 transition-colors">
              Balance (Reset)
            </p>
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

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {!position && (
            <div className="flex gap-4 bg-black/50 p-2 rounded border border-white/5 w-full sm:w-auto justify-center">
              <div className="flex flex-col">
                <label className="text-[8px] text-red-500 font-bold uppercase text-center md:text-left">
                  SL $
                </label>
                <input
                  type="number"
                  value={slInput}
                  onChange={(e) => setSlInput(Number(e.target.value))}
                  className="bg-transparent text-xs w-16 outline-none text-center"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[8px] text-green-500 font-bold uppercase text-center md:text-left">
                  TP $
                </label>
                <input
                  type="number"
                  value={tpInput}
                  onChange={(e) => setTpInput(Number(e.target.value))}
                  className="bg-transparent text-xs w-16 outline-none text-center"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            {!position ? (
              <>
                <button
                  onClick={() => openTrade("BUY")}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-500 px-4 md:px-6 py-3 md:py-2 rounded text-[10px] font-black transition-all"
                >
                  BUY
                </button>
                <button
                  onClick={() => openTrade("SELL")}
                  className="flex-1 sm:flex-none bg-red-600 hover:bg-red-500 px-4 md:px-6 py-3 md:py-2 rounded text-[10px] font-black transition-all"
                >
                  SELL
                </button>
              </>
            ) : (
              <button
                onClick={() => autoClose(pnl, "MANUAL")}
                className="w-full bg-white text-black px-8 py-3 md:py-2 rounded text-[10px] font-black animate-pulse"
              >
                CLOSE POSITION
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div
          className="flex-[2] bg-black relative min-h-[400px] lg:min-h-0"
          ref={container}
          id="tradingview_canvas"
        />

        <div className="flex-1 lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0f0f0f] flex flex-col min-h-[300px] lg:min-h-0">
          <div className="p-4 md:p-6 border-b border-white/5">
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
              <div className="py-4 text-center border border-dashed border-white/5 rounded">
                <p className="text-[10px] text-gray-600 italic uppercase font-bold">
                  Prêt pour exécution
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <h3 className="text-[10px] font-bold text-gray-500 mb-4 uppercase">
              Trade Journal
            </h3>
            <div className="space-y-3 pb-20 lg:pb-0">
              {history.length > 0 ? (
                history.map((h, i) => (
                  <div
                    key={i}
                    className="text-[10px] bg-white/5 p-3 rounded border-l-2 border-white/10"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 font-bold">
                        {h.reason}
                      </span>
                      <span
                        className={
                          h.pnl >= 0
                            ? "text-green-500"
                            : "text-red-500 font-bold"
                        }
                      >
                        {h.pnl >= 0 ? "+" : ""}
                        {h.pnl.toFixed(2)}$
                      </span>
                    </div>
                    <div className="text-[8px] text-gray-600 font-bold">
                      {h.time}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-800 italic text-center py-4">
                  Aucun historique de session
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
