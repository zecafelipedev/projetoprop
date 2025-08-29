import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Devocional from "./pages/Devocional";
import Oracao from "./pages/Oracao";
import Checkin from "./pages/Checkin";
import AgendaDiscipulos from "./pages/AgendaDiscipulos";
import GestaoDiscipulos from "./pages/GestaoDiscipulos";
import ReuniaoGrupo from "./pages/ReuniaoGrupo";
import Diario from "./pages/Diario";
import Trilhas from "./pages/Trilhas";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devocional" element={<Devocional />} />
          <Route path="/oracao" element={<Oracao />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="/agenda-discipulos" element={<AgendaDiscipulos />} />
          <Route path="/gestao-discipulos" element={<GestaoDiscipulos />} />
          <Route path="/reuniao-grupo" element={<ReuniaoGrupo />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
