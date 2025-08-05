import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Calendar, CheckCircle, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Checkin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkedInEvents, setCheckedInEvents] = useState<number[]>([]);

  const events = [
    {
      id: 1,
      title: "Discipulado - Fundamentos da Fé",
      date: "Hoje",
      time: "19:00",
      status: "disponível",
      description: "Estudo sobre os pilares da fé cristã"
    },
    {
      id: 2,
      title: "Estudo Bíblico - João 15",
      date: "Amanhã",
      time: "20:00",
      status: "indisponível",
      description: "A videira verdadeira"
    },
    {
      id: 3,
      title: "Oração em Grupo",
      date: "Sexta-feira",
      time: "18:30",
      status: "disponível",
      description: "Momento de oração comunitária"
    },
    {
      id: 4,
      title: "Retiro Espiritual",
      date: "Sábado",
      time: "08:00",
      status: "disponível",
      description: "Dia especial de busca e adoração"
    }
  ];

  const handleCheckin = (eventId: number, eventTitle: string) => {
    setCheckedInEvents(prev => [...prev, eventId]);
    toast({
      title: "Check-in realizado!",
      description: `Você confirmou presença em: ${eventTitle}`,
    });
  };

  const isCheckedIn = (eventId: number) => checkedInEvents.includes(eventId);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-secondary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <h1 className="text-xl font-bold">Check-in de Eventos</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            Confirme sua presença nos eventos disponíveis
          </p>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className={`shadow-card transition-smooth ${
                event.status === 'indisponível' ? 'opacity-60' : ''
              } ${isCheckedIn(event.id) ? 'border-success/50 bg-success/5' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'disponível' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {event.status === 'disponível' ? 'Disponível' : 'Indisponível'}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {event.status === 'disponível' && (
                    <Button
                      onClick={() => handleCheckin(event.id, event.title)}
                      disabled={isCheckedIn(event.id)}
                      className={`${
                        isCheckedIn(event.id)
                          ? 'bg-success text-success-foreground'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                    >
                      {isCheckedIn(event.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmado
                        </>
                      ) : (
                        'Check-in'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estatísticas */}
        <Card className="bg-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {checkedInEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Check-ins realizados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {events.filter(e => e.status === 'disponível').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Eventos disponíveis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Checkin;