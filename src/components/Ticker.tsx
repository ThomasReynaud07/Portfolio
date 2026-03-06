import { useEffect, useState } from "react";

const Ticker = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`,
        );
        const result = await res.json();

        const formattedData = result.map((coin: any) => ({
          symbol: coin.symbol.replace("USDT", ""),
          price: parseFloat(coin.lastPrice).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          change: coin.priceChangePercent,
          isUp: parseFloat(coin.priceChangePercent) >= 0,
        }));

        const goldPrice = {
          symbol: "GOLD",
          price: "2,154.50",
          change: "0.14",
          isUp: true,
        };
        setData([goldPrice, ...formattedData]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ON AJOUTE L'ANIMATION ICI */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="fixed bottom-0 left-0 w-full bg-primary py-2.5 overflow-hidden z-[100] border-t border-black/10 shadow-2xl">
        <div className="animate-marquee-scroll whitespace-nowrap">
          {data.length > 0 ? (
            // On double les données pour un défilement infini fluide
            [...data, ...data, ...data].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 px-12 font-mono font-black text-black uppercase text-sm tracking-tighter"
              >
                <span className="opacity-40">{item.symbol}</span>
                <span className="font-bold">{item.price}</span>
                <span
                  className={
                    item.isUp ? "text-white bg-black/10 px-1" : "text-red-900"
                  }
                >
                  {item.isUp ? "▲" : "▼"}{" "}
                  {item.change
                    ? Math.abs(parseFloat(item.change)).toFixed(2)
                    : "0.00"}
                  %
                </span>
                <span className="ml-8 opacity-10">//</span>
              </div>
            ))
          ) : (
            <div className="px-10 font-mono text-black animate-pulse uppercase tracking-widest text-xs">
              Récupération des flux financiers cryptographiques...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Ticker;
