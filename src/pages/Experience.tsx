import { Briefcase, GraduationCap, Code } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { motion } from "framer-motion";

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: React.ReactNode;
}

const experiences: TimelineItem[] = [
  {
    year: "2024 — Présent",
    title: "Étudiant en Informatique", // Ajout de l'accent
    company: "École Technique des Métiers de Lausanne", // Ajout des accents
    description: "Formation spécialisée en développement logiciel et conception d'applications numériques.", 
    icon: <Code className="h-5 w-5" />,
  },
  {
    year: "2023",
    title: "Stage en Cybersécurité",
    company: "Ville de Morges",
    description: "Réalisation d'audits de sécurité et tests d'intrusion (Pentesting). Utilisation d'outils spécialisés (Hashcat, SQLMap, John the Ripper, Hydra) pour identifier et corriger des vulnérabilités.",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    year: "2020 — 2024",
    title: "Scolarité Obligatoire (Cycle Initial & Moyen)",
    company: "Établissement Secondaire d'Aubonne",
    description: "Certificat de fin d'études secondaires avec option spécifique Mathématiques et Physique.",
    icon: <GraduationCap className="h-5 w-5" />,
  },
];

const skills = [
  "React", "TypeScript", "JavaScript", "AdonisJs", "Node.js",
  "Git", "Python", "SQL", "HTML/CSS", "Figma","C#",
];

const Experience = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="font-display text-sm tracking-[0.3em] uppercase text-primary/70 mb-4">
              Parcours
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-16">
              Expérience & Formation
            </h1>
          </FadeIn>

          {/* Timeline */}
          <div className="space-y-12 mb-24">
            {experiences.map((item, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <div className="group relative pl-12 border-l-2 border-border pb-2 hover:border-l-primary/40 transition-colors">
                  <div className="absolute left-0 top-0 -translate-x-[13px] bg-background border-2 border-border rounded-full p-2 text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                  <p className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    {item.year}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="font-display text-sm text-primary mb-3">{item.company}</p>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Skills */}
          <FadeIn>
            <p className="font-display text-sm tracking-[0.3em] uppercase text-primary/70 mb-6">
              Compétences
            </p>
          </FadeIn>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="font-display text-sm px-4 py-2 rounded-md bg-card text-secondary-foreground border border-border hover:border-primary/40 hover:text-primary transition-colors cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
