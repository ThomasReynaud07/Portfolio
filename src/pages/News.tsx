import { useEffect, useState } from "react";
import { Clock, ChevronRight, AlertTriangle, Globe } from "lucide-react";
import Ticker from "@/components/Ticker";

const News = () => {
  const [mainArticles, setMainArticles] = useState<any[]>([]);
  const [warNews, setWarNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. TA CLÉ ET LE PROXY
  const API_KEY = "931e4763136472277fbef334edc4f4d6";
  const PROXY = "https://corsproxy.io/?";

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        // 2. ENCODAGE DES URLS POUR LE PROXY
        const generalUrl = encodeURIComponent(
          `https://gnews.io/api/v4/top-headlines?category=world&lang=fr&country=fr&max=6&apikey=${API_KEY}`,
        );
        const warUrl = encodeURIComponent(
          `https://gnews.io/api/v4/search?q=guerre+conflit+iran+israel&lang=fr&max=4&apikey=${API_KEY}`,
        );

        // 3. APPELS VIA LE PROXY
        const [generalRes, warRes] = await Promise.all([
          fetch(`${PROXY}${generalUrl}`),
          fetch(`${PROXY}${warUrl}`),
        ]);

        const generalData = await generalRes.json();
        const warData = await warRes.json();

        // 4. MISE À JOUR SÉCURISÉE
        if (generalData.articles) setMainArticles(generalData.articles);
        if (warData.articles) setWarNews(warData.articles);
      } catch (error) {
        console.error("Échec du chargement des actualités:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-primary font-mono animate-pulse uppercase tracking-[0.2em]">
        Initialisation du terminal...
      </div>
    );

  const mainArticle = mainArticles[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-24 text-white font-serif">
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
            <span>{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNE GAUCHE : LA UNE */}
          <div className="lg:col-span-6 border-r border-white/10 pr-6">
            {mainArticle ? (
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
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-black text-[9px] font-black px-2 py-1 uppercase mb-2 inline-block italic">
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
                <span className="text-[10px] font-bold text-primary group-hover:underline uppercase tracking-widest">
                  Consulter le dossier complet →
                </span>
              </a>
            ) : (
              <div className="text-gray-700 italic border p-10 border-dashed border-white/5">
                Signal radio perdu...
              </div>
            )}
          </div>

          {/* COLONNE CENTRALE : ALERTES GUERRE */}
          <div className="lg:col-span-3 border-r border-white/10 pr-6">
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
                      Dépêche {i + 1}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-[10px] text-gray-700 uppercase italic">
                  Aucune alerte entrante
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE : FIL MONDE */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6 border-b border-white/30 pb-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-white tracking-widest italic">
                Fil Monde
              </h3>
            </div>
            <div className="space-y-6">
              {mainArticles.slice(1).map((art, i) => (
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
