import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Galerie from "./pages/Galerie";
import Contact from "./pages/Contact";
import Trading from "./pages/Trading"; // 1. On importe la nouvelle page
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import WorldMap from "./pages/WorldMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route path="/trading" element={<Trading />} />{" "}
            <Route path="/news" element={<News />} />
            <Route path="/worldmap" element={<WorldMap />} />
            {/* 2. On déclare la route ici */}
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
