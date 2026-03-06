import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const ProjectCard = ({ title, description, tags, link }: Props) => (
  <a
    href={link}
    className="group block bg-card border border-border rounded-lg p-6 card-glow hover:card-glow-hover transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
      {description}
    </p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="font-display text-xs px-2.5 py-1 rounded-sm bg-secondary text-secondary-foreground border border-border"
        >
          {tag}
        </span>
      ))}
    </div>
  </a>
);

export default ProjectCard;
