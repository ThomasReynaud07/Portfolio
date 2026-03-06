import { useEffect, useState } from "react";
import {
  Clock,
  ChevronRight,
  AlertTriangle,
  Globe,
  Newspaper,
} from "lucide-react";
import Ticker from "@/components/Ticker";

const News = () => {
  const [mainArticles, setMainArticles] = useState<any[]>([]);
  const [warNews, setWarNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "test";

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        const [worldRes, warRes] = await Promise.all([
          fetch(
            `https://content.guardianapis.com/search?section=world&show-fields=thumbnail,trailText&page-size=10&api-key=${API_KEY}`,
          ),
          fetch(
            `https://content.guardianapis.com/search?q=(war OR conflict OR iran OR middle east)&show-fields=thumbnail,trailText&page-size=5&api-key=${API_KEY}`,
          ),
        ]);

        const worldData = await worldRes.json();
        const warData = await warRes.json();

        if (worldData.response.results) {
          setMainArticles(
            worldData.response.results.map((art: any) => ({
              title: art.webTitle,
              url: art.webUrl,
              image:
                art.fields?.thumbnail ||
                "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000",
              description:
                art.fields?.trailText?.replace(/<[^>]*>/g, "") ||
                "Analyse approfondie de la situation internationale en cours.",
              source: "The Guardian",
            })),
          );
        }

        if (warData.response.results) {
          setWarNews(
            warData.response.results.map((art: any) => ({
              title: art.webTitle,
              url: art.webUrl,
            })),
          );
        }
      } catch (error) {
        console.error("Erreur Guardian API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-primary font-mono animate-pulse uppercase tracking-[0.2em] text-sm px-4 text-center">
        Initialisation du terminal...
      </div>
    );

  const mainArticle = mainArticles[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 md:pt-24 pb-24 text-white font-serif">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* HEADER JOURNALISTIQUE RESPONSIVE */}
        <div className="text-center border-b-4 border-double border-white/20 pb-6 mb-8 md:mb-10">
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
            L'ÉDITION
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 text-[9px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span className="order-2 md:order-1">Volume IV — N° 2026</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-2 order-1 md:order-2">
              <Newspaper className="w-3 h-3" /> FLUX INTERNATIONAL LIVE
            </span>
            <span className="order-3">
              {new Date().toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNE GAUCHE : LA UNE */}
          <div className="lg:col-span-6 lg:border-r border-white/10 lg:pr-6">
            {mainArticle ? (
              <a
                href={mainArticle.url}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative overflow-hidden mb-4 md:mb-6 aspect-video md:aspect-[16/10] bg-gray-900 border border-white/5">
                  <img
                    src={mainArticle.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt=""
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 md:p-6">
                    <span className="bg-white text-black text-[8px] md:text-[9px] font-black px-2 py-1 uppercase mb-2 inline-block italic shadow-lg">
                      À LA UNE
                    </span>
                    <h2 className="text-2xl md:text-5xl font-black leading-tight md:leading-[0.85] tracking-tighter uppercase drop-shadow-md">
                      {mainArticle.title}
                    </h2>
                  </div>
                </div>
                <p className="text-base md:text-lg text-gray-400 leading-snug mb-4 font-sans line-clamp-3 italic">
                  {mainArticle.description}
                </p>
                <span className="text-[10px] font-bold text-primary group-hover:underline uppercase tracking-widest">
                  Accéder à la couverture complète →
                </span>
              </a>
            ) : (
              <div className="text-gray-700 italic border p-10 border-dashed border-white/5 text-center">
                Signal satellite interrompu...
              </div>
            )}
          </div>

          {/* COLONNE CENTRALE : ALERTES GUERRE */}
          {/* border-t sur mobile, border-r sur desktop */}
          <div className="lg:col-span-3 lg:border-r border-t lg:border-t-0 border-white/10 pt-8 lg:pt-0 lg:px-6">
            <div className="flex items-center gap-2 mb-6 border-b border-red-600/50 pb-2">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase text-red-500 tracking-widest italic">
                Urgence Conflits
              </h3>
            </div>
            <div className="space-y-6">
              {warNews.length > 0 ? (
                warNews.map((art, i) => (
                  <a
                    key={i}
                    href={art.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block border-b border-white/5 pb-4 last:border-0"
                  >
                    <h4 className="text-base font-bold leading-tight group-hover:text-red-400 transition-colors">
                      {art.title}
                    </h4>
                    <div className="mt-2 text-[9px] font-mono text-gray-600 uppercase">
                      Transmission #{1204 + i}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-[10px] text-gray-700 uppercase italic">
                  En attente de dépêches...
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE : FIL MONDE */}
          {/* border-t sur mobile uniquement */}
          <div className="lg:col-span-3 border-t lg:border-t-0 border-white/10 pt-8 lg:pt-0">
            <div className="flex items-center gap-2 mb-6 border-b border-white/30 pb-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-white tracking-widest italic">
                Fil Monde
              </h3>
            </div>
            <div className="space-y-6">
              {mainArticles.slice(1, 6).map((art, i) => (
                <a
                  key={i}
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block pb-4 border-b border-white/5 last:border-0"
                >
                  <p className="text-[9px] font-bold text-primary mb-1 uppercase tracking-tighter">
                    {art.source}
                  </p>
                  <h4 className="text-sm font-bold leading-snug group-hover:underline decoration-primary">
                    {art.title}
                  </h4>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Ticker />
    </div>
  );
};

export default News;
