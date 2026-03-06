import { Github, Linkedin, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} — Tous droits réservés
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/ThomasReynaud07" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Linkedin className="h-4 w-4" />
          </a>
          <button onClick={scrollToTop} className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors ml-2">
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
