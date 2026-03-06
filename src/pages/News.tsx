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
      try {
        // 1. Appel pour la Une Générale
        const generalRes = await fetch(
          `https://gnews.io/api/v4/search?q=monde&lang=fr&max=5&apikey=${API_KEY}`,
        );
        const generalData = await generalRes.json();

        // 2. Appel ciblé sur les conflits (Guerre, Iran, Moyen-Orient)
        const warRes = await fetch(
          `https://gnews.io/api/v4/search?q=guerre+OU+conflit+OU+iran+OU+israel&lang=fr&max=4&apikey=${API_KEY}`,
        );
        const warData = await warRes.json();

        setMainArticles(generalData.articles || []);
        setWarNews(warData.articles || []);
      } catch (error) {
        console.error(error);
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

  const mainArticle = mainArticles[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 text-white font-serif">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* HEADER JOURNALISTIQUE */}
        <div className="text-center border-b-4 border-double border-white/20 pb-6 mb-10">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
            L'ÉDITION
          </h1>
          <div className="flex justify-between items-center mt-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span>Volume IV — N° 2026</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
              ÉDITION SPÉCIALE GÉOPOLITIQUE
            </span>
            <span>
              {new Date().toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNE GAUCHE : LA UNE (6 COLONNES) */}
          <div className="lg:col-span-6 border-r border-white/10 pr-6">
            {mainArticle && (
              <a
                href={mainArticle.url}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative overflow-hidden mb-6 aspect-[16/10] bg-gray-900">
                  <img
                    src={mainArticle.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt=""
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter mb-2 inline-block italic">
                      EXCLUSIF
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black leading-[0.85] tracking-tighter uppercase">
                      {mainArticle.title}
                    </h2>
                  </div>
                </div>
                <p className="text-lg text-gray-400 leading-tight mb-4 font-sans line-clamp-3">
                  {mainArticle.description}
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] font-mono text-gray-500 italic">
                    Source: {mainArticle.source.name}
                  </span>
                  <span className="text-[10px] font-bold text-primary group-hover:underline uppercase">
                    Lire l'enquête complète →
                  </span>
                </div>
              </a>
            )}
          </div>

          {/* COLONNE CENTRALE : ALERTES GUERRE (3 COLONNES) */}
          <div className="lg:col-span-3 border-r border-white/10 pr-6">
            <div className="flex items-center gap-2 mb-6 border-b border-red-600/50 pb-2">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase text-red-500 tracking-widest italic">
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
                  className="group block border-b border-white/5 pb-4 last:border-0"
                >
                  <h4 className="text-base font-bold leading-tight group-hover:text-red-400 transition-colors">
                    {art.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2 text-[9px] font-mono text-gray-600">
                    <Clock className="w-3 h-3" />{" "}
                    {new Date(art.publishedAt).getHours()}h
                    {(new Date(art.publishedAt).getMinutes() < 10 ? "0" : "") +
                      new Date(art.publishedAt).getMinutes()}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE : FIL INFO MONDE (3 COLONNES) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6 border-b border-white/30 pb-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-white tracking-widest italic">
                Fil Monde
              </h3>
            </div>
            <div className="space-y-6">
              {mainArticles.slice(1, 5).map((art, i) => (
                <a
                  key={i}
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block pb-4 border-b border-white/5 last:border-0"
                >
                  <p className="text-[9px] font-bold text-primary mb-1 uppercase tracking-tighter">
                    {art.source.name}
                  </p>
                  <h4 className="text-sm font-bold leading-snug group-hover:underline decoration-primary">
                    {art.title}
                  </h4>
                  <ChevronRight className="w-3 h-3 text-gray-700 mt-2 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>

            {/* ENCART ANALYSE FINANCIÈRE */}
            <div className="mt-8 bg-primary/5 p-4 border border-primary/20">
              <p className="text-[10px] font-black text-primary mb-2 tracking-widest italic uppercase underline">
                Impact Marchés
              </p>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed italic">
                "La volatilité du brut reste corrélée aux tensions diplomatiques
                en zone Golf. Les investisseurs se tournent vers les valeurs
                refuges."
              </p>
            </div>
          </div>
        </div>
      </div>
      <Ticker />
    </div>
  );
};

export default News;
