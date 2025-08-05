import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { MessageCircle, Send, ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Oracao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prayerRequest, setPrayerRequest] = useState("");
  
  const previousPrayers = [
    {
      id: 1,
      text: "Por sabedoria nos estudos e discernimento espiritual",
      date: "Há 2 dias",
      status: "enviado"
    },
    {
      id: 2,
      text: "Pela saúde da minha família e proteção divina",
      date: "Há 5 dias",
      status: "enviado"
    },
    {
      id: 3,
      text: "Por oportunidades de testemunhar de Cristo",
      date: "Há 1 semana",
      status: "enviado"
    }
  ];

  const handleSendPrayer = () => {
    if (prayerRequest.trim()) {
      toast({
        title: "Pedido enviado!",
        description: "Seu pedido de oração foi enviado ao seu discipulador.",
      });
      setPrayerRequest("");
    }
  };

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
            <MessageCircle className="w-6 h-6" />
            <h1 className="text-xl font-bold">Pedidos de Oração</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Novo pedido */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Novo Pedido de Oração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Compartilhe aqui seu pedido de oração. Lembre-se que seu discipulador irá orar por você..."
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button
              onClick={handleSendPrayer}
              disabled={!prayerRequest.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar ao Discipulador
            </Button>
          </CardContent>
        </Card>

        {/* Pedidos anteriores */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Pedidos Anteriores</h2>
          
          {previousPrayers.map((prayer) => (
            <Card key={prayer.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-foreground leading-relaxed">{prayer.text}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{prayer.date}</span>
                    <span className="text-success font-medium capitalize">
                      {prayer.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensagem encorajadora */}
        <Card className="bg-accent">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, 
              e com ação de graças, apresentem seus pedidos a Deus." - Filipenses 4:6
            </p>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Oracao;