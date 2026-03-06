import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const photos = [
  {
    src: "/public/Image1.jfif",
    alt: "Code",
    span: "md:col-span-2 md:row-span-2",
  },
  { src: "/public/Image6.jfif", alt: "Workspace", span: "" },
  { src: "/public/Image3.jfif", alt: "Color", span: "" },
  { src: "/public/Image4.jfif", alt: "Setup", span: "md:row-span-2" },
  { src: "/public/Image2.jfif", alt: "Espace", span: "md:col-span-2" },
  { src: "/public/Image5.jfif", alt: "Meeting", span: "" },
  { src: "/public/Image7.jfif", alt: "Team", span: "" },
  { src: "/public/Image8.jfif", alt: "Dev", span: "" },
  { src: "/public/Image.jfif", alt: "Final", span: "" },
];

const Galerie = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Photos</h1>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        {/* Grille optimisée en CSS pur pour éviter le lag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => setSelected(photo)}
              className={`
                relative cursor-pointer overflow-hidden rounded-xl border border-border
                hover:border-primary/50 transition-all duration-300 group
                ${photo.span}
              `}
            >
              {/* L'image : scale simple en CSS (ultra fluide) */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover will-change-transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay léger sans flou (le flou fait ramer) */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selected && (
            <img
              src={selected.src}
              alt={selected.alt}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Galerie;
