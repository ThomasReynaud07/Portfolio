import { useState, useRef } from "react"; // Ajout de useRef
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import FadeIn from "@/components/FadeIn";
import emailjs from "@emailjs/browser"; // Import d'EmailJS

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null); // Création de la ref pour le formulaire
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSending(true);

    // REMPLACE 'YOUR_TEMPLATE_ID' et 'YOUR_PUBLIC_KEY' par tes infos EmailJS
    emailjs
      .sendForm(
        "service_4lqswfp",
        "template_9lfroun", // Trouve ça dans "Email Templates" sur EmailJS
        formRef.current,
        "jYa3X4qV_wNi29HWb", // Trouve ça dans "Account" -> "API Keys"
      )
      .then(() => {
        toast.success("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Échec de l'envoi. Veuillez réessayer.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <section className="py-24 relative">
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="font-display text-sm tracking-[0.3em] uppercase text-primary/70 mb-4">
              Contact
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Travaillons ensemble
            </h1>
            <p className="text-muted-foreground font-body text-lg mb-16 max-w-xl leading-relaxed">
              N'hésitez pas à me contacter pour discuter d'un projet, une
              collaboration ou simplement échanger.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-5 gap-16">
            {/* Info */}
            <FadeIn delay={0.1} className="md:col-span-2">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-medium text-foreground">
                      Email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      thomas.reynaud@eduvaud.ch
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-medium text-foreground">
                      Téléphone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +41 78 756 22 56
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-medium text-foreground">
                      Localisation
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lausanne, Suisse
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.2} className="md:col-span-3">
              {/* Ajout de la ref et des attributs 'name' indispensables pour EmailJS */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-2 block">
                    Nom
                  </label>
                  <Input
                    name="from_name" // Utilisé dans ton template EmailJS
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Votre nom"
                    required
                    className="font-body bg-card border-border focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    name="reply_to" // Utilisé dans ton template EmailJS
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="votre@email.com"
                    required
                    className="font-body bg-card border-border focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    name="message" // Utilisé dans ton template EmailJS
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Votre message..."
                    rows={5}
                    required
                    className="font-body resize-none bg-card border-border focus:border-primary/40"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSending}
                  className="font-display tracking-wide w-full"
                >
                  <Send
                    className={`mr-2 h-4 w-4 ${isSending ? "animate-pulse" : ""}`}
                  />
                  {isSending ? "Transmission..." : "Envoyer"}
                </Button>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
