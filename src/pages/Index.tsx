import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import TypingEffect from "@/components/TypingEffect";
import Counter from "@/components/Counter";
import ProjectCard from "@/components/ProjectCard";

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [repoCount, setRepoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Ton pseudo GitHub
  const GITHUB_USERNAME = "ThomasReynaud07";

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        // 1. Récupération des infos profil (pour le compteur de projets total)
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const userData = await userResponse.json();
        if (userData.public_repos) {
          setRepoCount(userData.public_repos);
        }

        // 2. Récupération des dépôts (pour les cartes de projets)
        const reposResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`
        );
        const reposData = await reposResponse.json();

        const formattedProjects = reposData
          .filter((repo) => !repo.fork) // On exclut les forks
          .slice(0, 3) // On garde les 3 plus récents
          .map((repo) => ({
            title: repo.name.replace(/-/g, " ").replace(/_/g, " "),
            description: repo.description || "Développement d'une solution numérique moderne.",
            // On utilise les topics (tags) GitHub, sinon le langage principal
            tags: repo.topics?.length > 0 ? repo.topics : [repo.language].filter(Boolean),
            link: repo.html_url,
          }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Erreur API GitHub:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  // Statistiques dynamiques
  const stats = [
    { value: repoCount || 15, suffix: "+", label: "Projets GitHub" },
    { value: 2, suffix: "+", label: "Années d'exp." },
    { value: 10, suffix: "+", label: "Technologies" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden">
        {/* Ambient glow - Thème Rose/Violet */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl space-y-8">
            <FadeIn>
              <p className="font-display text-sm tracking-[0.3em] uppercase text-primary/70">
                Étudiant Développeur
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
                Bonjour, je suis
                <br />
                <span className="text-primary text-glow">
                  <TypingEffect words={["Développeur Web", "Passionné Cyber", "Créatif"]} />
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground font-body max-w-xl leading-relaxed">
                Passionné par le développement web et la cybersécurité.
                Je crée des expériences numériques modernes, performantes et élégantes.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex items-center gap-4 pt-4 flex-wrap">
                <Button asChild size="lg" className="font-display tracking-wide shadow-lg shadow-primary/20">
                  <Link to="/experience">
                    Voir mon parcours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-display tracking-wide border-primary/20 text-primary hover:bg-primary/10">
                  <a href="/Thomas.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger CV
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="font-display text-4xl md:text-5xl font-bold text-primary text-glow">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-display text-sm text-muted-foreground mt-2 tracking-wide uppercase">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section (Dynamic via GitHub) */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="flex items-center gap-2 mb-4">
                <Github className="w-5 h-5 text-primary/70" />
                <p className="font-display text-sm tracking-[0.3em] uppercase text-primary/70">
                  Open Source
                </p>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-12">
                Réalisations récentes
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {loading ? (
                // Skeleton Loader pendant le chargement
                [1, 2, 3].map((n) => (
                  <div key={n} className="h-64 rounded-xl bg-muted/50 animate-pulse border border-border" />
                ))
              ) : (
                projects.map((project, i) => (
                  <FadeIn key={project.title} delay={i * 0.1}>
                    <ProjectCard {...project} />
                  </FadeIn>
                ))
              )}
            </div>

            <FadeIn delay={0.3}>
              <div className="text-center mt-12">
                <Button asChild variant="outline" className="font-display border-primary/20 text-primary hover:bg-primary/10">
                  <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
                    Voir tous mes dépôts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;