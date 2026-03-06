import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// 1. On importe les images une par une (Vite gère le chemin)
import img1 from "../image/Image1.jfif";
import img2 from "../image/Image2.jfif";
import img3 from "../image/Image3.jfif";
import img4 from "../image/Image4.jfif";
import img5 from "../image/Image5.jfif";
import img6 from "../image/Image6.jfif";
import img7 from "../image/Image7.jfif";
import img8 from "../image/Image8.jfif";
import imgMain from "../image/Image.jfif";

const photos = [
  { src: img1, alt: "Code", span: "md:col-span-2 md:row-span-2" },
  { src: img6, alt: "Workspace", span: "" },
  { src: img3, alt: "Color", span: "" },
  { src: img4, alt: "Setup", span: "md:row-span-2" },
  { src: img2, alt: "Espace", span: "md:col-span-2" },
  { src: img5, alt: "Meeting", span: "" },
  { src: img7, alt: "Team", span: "" },
  { src: img8, alt: "Dev", span: "" },
  { src: imgMain, alt: "Final", span: "" },
];

const Galerie = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Galerie</h1>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => setSelected(photo)}
              className={`relative cursor-pointer overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300 group ${photo.span}`}
            >
              <img
                src={photo.src} // Ici, src contient maintenant l'objet importé
                alt={photo.alt}
                className="w-full h-full object-cover will-change-transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
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
