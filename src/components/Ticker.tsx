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

        // Or sécurisé (statique pour éviter les erreurs d'API tierces instables)
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
    <div className="fixed bottom-0 left-0 w-full bg-primary py-2 overflow-hidden z-[100] border-t border-black/10">
      <div className="flex animate-marquee whitespace-nowrap">
        {data.length > 0 ? (
          [...data, ...data].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-10 font-mono font-black text-black uppercase"
            >
              <span className="opacity-40">{item.symbol}</span>
              <span>{item.price}</span>
              {/* Le check parseFloat(item.change) empêche le NaN */}
              <span className={item.isUp ? "text-white" : "text-red-900"}>
                {item.isUp ? "▲" : "▼"}{" "}
                {item.change
                  ? Math.abs(parseFloat(item.change)).toFixed(2)
                  : "0.00"}
                %
              </span>
            </div>
          ))
        ) : (
          <div className="px-10 font-mono text-black">
            CHARGEMENT DES DONNÉES FINANCIÈRES...
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticker;
