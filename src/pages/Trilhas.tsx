import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Heart, 
  Shield, 
  Send, 
  BookOpen, 
  Play,
  CheckCircle,
  Lock
} from "lucide-react";

const Trilhas = () => {
  const navigate = useNavigate();

  const trilhas = [
    {
      id: 1,
      title: "Identidade em Cristo",
      description: "Descubra quem você é aos olhos de Deus",
      icon: User,
      progress: 75,
      completed: 6,
      total: 8,
      unlocked: true,
      color: "bg-primary"
    },
    {
      id: 2, 
      title: "Sexualidade",
      description: "Uma perspectiva bíblica sobre relacionamentos e pureza",
      icon: Heart,
      progress: 25,
      completed: 2,
      total: 8,
      unlocked: true,
      color: "bg-red-500"
    },
    {
      id: 3,
      title: "Lidando com Ansiedade",
      description: "Encontre paz em meio às preocupações",
      icon: Shield,
      progress: 0,
      completed: 0,
      total: 6,
      unlocked: true,
      color: "bg-blue-500"
    },
    {
      id: 4,
      title: "Missão",
      description: "Descubra seu propósito no Reino de Deus",
      icon: Send,
      progress: 0,
      completed: 0,
      total: 10,
      unlocked: false,
      color: "bg-orange-500"
    },
    {
      id: 5,
      title: "Bíblia do Zero",
      description: "Fundamentos para entender a Palavra de Deus",
      icon: BookOpen,
      progress: 0,
      completed: 0,
      total: 12,
      unlocked: false,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Trilhas Devocionais</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Introdução */}
        <Card className="shadow-soft border-0 gradient-card">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Escolha sua jornada de crescimento
            </h2>
            <p className="text-foreground">
              Cada trilha foi criada para te ajudar a crescer em uma área específica da fé
            </p>
          </CardContent>
        </Card>

        {/* Lista de Trilhas */}
        <div className="grid gap-6 md:grid-cols-2">
          {trilhas.map((trilha) => {
            const IconComponent = trilha.icon;
            
            return (
              <Card 
                key={trilha.id} 
                className={`shadow-soft border-0 transition-smooth hover:shadow-glow ${
                  trilha.unlocked ? 'cursor-pointer' : 'opacity-60'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full ${trilha.color} flex items-center justify-center`}>
                      {trilha.unlocked ? (
                        <IconComponent className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        {trilha.title}
                        {trilha.progress === 100 && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trilha.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progresso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {trilha.completed}/{trilha.total} concluídos
                      </span>
                      <span className="text-primary font-medium">
                        {trilha.progress}%
                      </span>
                    </div>
                    <Progress value={trilha.progress} className="h-2" />
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {trilha.progress > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Em andamento
                        </Badge>
                      )}
                      {trilha.progress === 100 && (
                        <Badge className="text-xs bg-success">
                          Concluída
                        </Badge>
                      )}
                      {!trilha.unlocked && (
                        <Badge variant="outline" className="text-xs">
                          Bloqueada
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <Button 
                    className="w-full" 
                    disabled={!trilha.unlocked}
                    variant={trilha.progress > 0 ? "default" : "outline"}
                  >
                    {trilha.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continuar trilha
                      </>
                    ) : trilha.unlocked ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar trilha
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Complete a trilha anterior
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dica */}
        <Card className="shadow-soft border-0 bg-accent">
          <CardContent className="p-6">
            <h3 className="font-semibold text-primary mb-2">💡 Dica</h3>
            <p className="text-foreground text-sm">
              As trilhas são desbloqueadas conforme você progride. Complete uma trilha 
              para desbloquear a próxima e continuar crescendo na sua jornada de fé!
            </p>
          </CardContent>
        </Card>

        <div className="text-center pb-20">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Trilhas;