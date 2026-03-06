import { useEffect, useState } from "react";
import { Clock, ChevronRight, AlertTriangle, Globe } from "lucide-react";
import Ticker from "@/components/Ticker";

const News = () => {
  const [mainArticles, setMainArticles] = useState<any[]>([]);
  const [warNews, setWarNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = "931e4763136472277fbef334edc4f4d6";

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        // Pour éviter le blocage CORS, on utilise 'top-headlines' qui est plus stable
        const headers = { Accept: "application/json" };

        const [generalRes, warRes] = await Promise.all([
          fetch(
            `https://gnews.io/api/v4/top-headlines?category=world&lang=fr&country=fr&max=5&apikey=${API_KEY}`,
            { headers },
          ),
          fetch(
            `https://gnews.io/api/v4/search?q=guerre+conflit+iran&lang=fr&max=4&apikey=${API_KEY}`,
            { headers },
          ),
        ]);

        const generalData = await generalRes.json();
        const warData = await warRes.json();

        if (generalData.articles) setMainArticles(generalData.articles);
        if (warData.articles) setWarNews(warData.articles);
      } catch (error) {
        console.error("Erreur News API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNews();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-primary font-mono animate-pulse">
        SYNCHRONISATION DU FLUX...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-24 text-white font-serif">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center border-b-4 border-double border-white/20 pb-6 mb-10">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
            L'ÉDITION
          </h1>
          <div className="flex justify-between items-center mt-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span>Volume IV — N° 2026</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
              ÉDITION SPÉCIALE GÉOPOLITIQUE
            </span>
            <span>{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Colonne Principale */}
          <div className="lg:col-span-6 border-r border-white/10 pr-6">
            {mainArticles[0] && (
              <a
                href={mainArticles[0].url}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative overflow-hidden mb-6 aspect-[16/10] bg-gray-900">
                  <img
                    src={mainArticles[0].image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt=""
                  />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-3xl md:text-5xl font-black leading-[0.85] uppercase">
                      {mainArticles[0].title}
                    </h2>
                  </div>
                </div>
                <p className="text-lg text-gray-400 font-sans line-clamp-3">
                  {mainArticles[0].description}
                </p>
              </a>
            )}
          </div>

          {/* Alertes Guerre */}
          <div className="lg:col-span-3 border-r border-white/10 pr-6">
            <div className="flex items-center gap-2 mb-6 border-b border-red-600/50 pb-2 text-red-500">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest">
                Urgence Conflits
              </h3>
            </div>
            <div className="space-y-6">
              {warNews.map((art, i) => (
                <a
                  key={i}
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block border-b border-white/5 pb-4"
                >
                  <h4 className="text-base font-bold leading-tight group-hover:text-red-400">
                    {art.title}
                  </h4>
                </a>
              ))}
            </div>
          </div>

          {/* Fil Monde */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6 border-b border-white/30 pb-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-widest">
                Fil Monde
              </h3>
            </div>
            {mainArticles.slice(1).map((art, i) => (
              <a
                key={i}
                href={art.url}
                target="_blank"
                rel="noreferrer"
                className="group block pb-4 border-b border-white/5 mb-4"
              >
                <h4 className="text-sm font-bold group-hover:text-primary">
                  {art.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      </div>
      <Ticker />
    </div>
  );
};

export default News;
