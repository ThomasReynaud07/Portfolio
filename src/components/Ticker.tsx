import { useEffect, useState } from "react";

const Ticker = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`,
        );
        const result = await res.json();

        const formattedData = result.map((coin: any) => ({
          symbol: coin.symbol.replace("USDT", ""),
          price: parseFloat(coin.lastPrice).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          change: parseFloat(coin.priceChangePercent).toFixed(2),
          isUp: parseFloat(coin.priceChangePercent) >= 0,
        }));

        const goldPrice = {
          symbol: "GOLD",
          price: (2154.5 + Math.random()).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          change: "0.14",
          isUp: true,
        };

        setData([goldPrice, ...formattedData]);
      } catch (error) {
        console.error("Erreur API Binance:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const tickerStyle = `
    @keyframes marquee-infinite {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-ticker {
      display: flex;
      width: max-content;
      animation: marquee-infinite 40s linear infinite;
    }
    .ticker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 50px;
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 16px; 
      font-weight: 900;
      color: #000;
      text-transform: uppercase;
      line-height: 1; /* Aligne le texte parfaitement au centre */
    }
    .ticker-symbol {
      opacity: 0.5;
      font-size: 13px;
    }
    .price-up { color: #fff; }
    .price-down { color: #850000; }
  `;

  return (
    <>
      <style>{tickerStyle}</style>
      {/* py-2 au lieu de py-4 pour une barre plus fine */}
      <div className="fixed bottom-0 left-0 w-full bg-primary py-2 overflow-hidden z-[100] border-t border-black/10 shadow-lg">
        <div className="animate-ticker">
          {[...data, ...data, ...data].map((item, idx) => (
            <div key={idx} className="ticker-item">
              <span className="ticker-symbol">{item.symbol}</span>
              <span className="tracking-tighter">{item.price}</span>
              <span className={item.isUp ? "price-up" : "price-down"}>
                {item.isUp ? "▲" : "▼"} {Math.abs(item.change)}%
              </span>
              <span className="mx-2 opacity-10 text-black">/</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Ticker;
