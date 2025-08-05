import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { DiscipleCard } from "@/components/DiscipleCard";
import { Users, Search, ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AgendaDiscipulos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const disciples = [
    {
      id: 1,
      name: "Maria Silva",
      nextMeeting: {
        date: "Hoje",
        time: "19:00"
      },
      stage: "Fundamentos da Fé",
      phone: "(11) 99999-1234"
    },
    {
      id: 2,
      name: "Pedro Santos",
      nextMeeting: {
        date: "Amanhã",
        time: "20:00"
      },
      stage: "Discipulado Avançado",
      phone: "(11) 98888-5678"
    },
    {
      id: 3,
      name: "Ana Costa",
      nextMeeting: {
        date: "Quinta-feira",
        time: "18:30"
      },
      stage: "Novo Convertido",
      phone: "(11) 97777-9012"
    },
    {
      id: 4,
      name: "João Oliveira",
      nextMeeting: {
        date: "Sexta-feira",
        time: "19:30"
      },
      stage: "Preparação para Liderança",
      phone: "(11) 96666-3456"
    }
  ];

  const filteredDisciples = disciples.filter(disciple =>
    disciple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disciple.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (phone: string, name: string) => {
    window.open(`tel:${phone}`);
    toast({
      title: "Ligação iniciada",
      description: `Ligando para ${name}`,
    });
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=Olá ${name}, como você está?`);
    toast({
      title: "WhatsApp aberto",
      description: `Conversando com ${name}`,
    });
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
            <Users className="w-6 h-6" />
            <h1 className="text-xl font-bold">Agenda dos Discípulos</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Barra de pesquisa e filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou etapa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{disciples.length}</div>
              <div className="text-sm text-muted-foreground">Total de Discípulos</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">
                {disciples.filter(d => d.nextMeeting.date === "Hoje").length}
              </div>
              <div className="text-sm text-muted-foreground">Encontros Hoje</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de discípulos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Próximos Encontros ({filteredDisciples.length})
          </h2>
          
          {filteredDisciples.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum discípulo encontrado com os filtros aplicados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDisciples.map((disciple) => (
              <DiscipleCard
                key={disciple.id}
                name={disciple.name}
                nextMeeting={disciple.nextMeeting}
                stage={disciple.stage}
                phone={disciple.phone}
                onCall={() => handleCall(disciple.phone, disciple.name)}
                onWhatsApp={() => handleWhatsApp(disciple.phone, disciple.name)}
              />
            ))
          )}
        </div>

        {/* Dica */}
        <Card className="bg-accent">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center italic">
              💡 Toque em "Ligar" para fazer uma ligação ou "WhatsApp" para enviar uma mensagem
            </p>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default AgendaDiscipulos;