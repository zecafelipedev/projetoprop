import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import MasterDashboard from "./pages/MasterDashboard";
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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/master-dashboard" element={
              <ProtectedRoute requiredRole="master">
                <MasterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/devocional" element={
              <ProtectedRoute>
                <Devocional />
              </ProtectedRoute>
            } />
            <Route path="/oracao" element={
              <ProtectedRoute>
                <Oracao />
              </ProtectedRoute>
            } />
            <Route path="/checkin" element={
              <ProtectedRoute>
                <Checkin />
              </ProtectedRoute>
            } />
            <Route path="/agenda-discipulos" element={
              <ProtectedRoute>
                <AgendaDiscipulos />
              </ProtectedRoute>
            } />
            <Route path="/gestao-discipulos" element={
              <ProtectedRoute requiredRole="discipler">
                <GestaoDiscipulos />
              </ProtectedRoute>
            } />
            <Route path="/reuniao-grupo" element={
              <ProtectedRoute requiredRole="discipler">
                <ReuniaoGrupo />
              </ProtectedRoute>
            } />
            <Route path="/diario" element={
              <ProtectedRoute>
                <Diario />
              </ProtectedRoute>
            } />
            <Route path="/trilhas" element={
              <ProtectedRoute>
                <Trilhas />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
