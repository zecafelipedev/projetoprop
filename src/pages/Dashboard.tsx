import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Star, Zap, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userName = "João"; // Simulado - virá do Supabase

  const handleCheckin = () => {
    toast({
      title: "Check-in realizado!",
      description: "Você marcou presença no encontro.",
    });
  };

  const handleMoreOptions = () => {
    toast({
      title: "Mais opções",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground p-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Olá, {userName}!</h1>
            <p className="text-secondary-foreground/80 mt-1">
              Que bom ter você aqui hoje
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">125</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Próximo Encontro */}
        <Card className="border-primary/20 bg-accent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Próximo Encontro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventCard
              title="Discipulado - Fundamentos da Fé"
              date="Hoje"
              time="19:00"
              type="primary"
              showCheckin={true}
              showMore={true}
              onCheckin={handleCheckin}
              onMore={handleMoreOptions}
            />
          </CardContent>
        </Card>

        {/* Eventos Futuros */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Próximos Eventos</h2>
          
          <EventCard
            title="Estudo Bíblico - João 15"
            date="Amanhã"
            time="20:00"
          />
          
          <EventCard
            title="Oração em Grupo"
            date="Sexta-feira"
            time="18:30"
          />
          
          <EventCard
            title="Retiro Espiritual"
            date="Sábado"
            time="08:00"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => navigate('/devocional')}
          >
            <Zap className="w-6 h-6" />
            <span className="text-sm">Devocional</span>
          </Button>
          <Button 
            className="h-20 flex flex-col gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/oracao')}
          >
            <Star className="w-6 h-6" />
            <span className="text-sm">Oração</span>
          </Button>
        </div>

        {/* Gestão e Organização */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Gestão</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline"
              className="h-16 flex items-center justify-start gap-3 px-4 border-orange-600/20 text-orange-600 hover:bg-orange-600 hover:text-white"
              onClick={() => navigate('/gestao-discipulos')}
            >
              <Users className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Gestão de Discípulos</div>
                <div className="text-sm opacity-80">Cadastrar e acompanhar discípulos</div>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-16 flex items-center justify-start gap-3 px-4 border-blue-600/20 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => navigate('/reuniao-grupo')}
            >
              <Calendar className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Reuniões em Grupo</div>
                <div className="text-sm opacity-80">Agendar e editar temas</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Dashboard;