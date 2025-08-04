import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AppLogo } from "@/components/AppLogo";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Heart, 
  Calendar, 
  Target, 
  Send, 
  CheckCircle,
  User,
  Menu,
  Home
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [prayerRequest, setPrayerRequest] = useState("");
  const userName = "João"; // Simulação de usuário logado

  const handlePrayerSubmit = () => {
    if (prayerRequest.trim()) {
      // Simular envio
      setPrayerRequest("");
      // Aqui seria enviado para o discipulador
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <AppLogo size="sm" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Boas-vindas */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Olá, {userName} ✨
          </h1>
          <p className="text-muted-foreground">
            Como está seu coração hoje?
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Devocional do Dia */}
          <Card className="shadow-soft border-0 transition-smooth hover:shadow-glow cursor-pointer" onClick={() => navigate('/devocional')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <BookOpen className="w-5 h-5" />
                Devocional do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="font-medium text-foreground">
                "Deus tem um plano para você"
              </h3>
              <p className="text-sm text-muted-foreground">
                "Porque sou eu que conheço os planos que tenho para vocês..."
              </p>
              <p className="text-xs text-primary font-medium">
                Jeremias 29:11
              </p>
              <Button size="sm" className="w-full mt-3">
                <BookOpen className="w-4 h-4 mr-2" />
                Ler agora
              </Button>
            </CardContent>
          </Card>

          {/* Pedido de Oração */}
          <Card className="shadow-soft border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Heart className="w-5 h-5" />
                Pedido de Oração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Compartilhe seu pedido de oração..."
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button 
                size="sm" 
                className="w-full" 
                onClick={handlePrayerSubmit}
                disabled={!prayerRequest.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar ao discipulador
              </Button>
            </CardContent>
          </Card>

          {/* Próximo Encontro */}
          <Card className="shadow-soft border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Calendar className="w-5 h-5" />
                Próximo Encontro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Conversa sobre Identidade</p>
                <p className="text-sm text-muted-foreground">Sábado, 15 de Dezembro</p>
                <p className="text-sm text-muted-foreground">19:30 - Online</p>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Entrar na chamada
              </Button>
            </CardContent>
          </Card>

          {/* Desafio da Semana */}
          <Card className="shadow-soft border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                Desafio da Semana
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Orar por 5 minutos diários</p>
                <p className="text-sm text-muted-foreground">
                  Reserve um momento especial com Deus todos os dias.
                </p>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">3/7 dias concluídos</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como feito hoje
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => navigate('/diario')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Diário Espiritual
          </Button>
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => navigate('/trilhas')}
          >
            <Target className="w-4 h-4 mr-2" />
            Trilhas
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" className="text-primary">
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;