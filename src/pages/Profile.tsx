import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Heart,
  Users,
  Phone,
  MessageCircle,
  Star
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Dados simulados do discipulador
  const discipulador = {
    name: "Pastor Carlos Silva",
    church: "Igreja Batista Central",
    location: "São Paulo, SP", 
    photo: "/placeholder.svg",
    experience: "5 anos",
    disciples: 12,
    rating: 4.9
  };

  const encontros = [
    {
      date: "15 Dec 2024",
      topic: "Identidade em Cristo",
      status: "Agendado"
    },
    {
      date: "08 Dec 2024", 
      topic: "Lidando com ansiedade",
      status: "Concluído"
    },
    {
      date: "01 Dec 2024",
      topic: "Fundamentos da fé",
      status: "Concluído"
    }
  ];

  const conquistas = [
    { name: "Primeira Semana", icon: "🌱", completed: true },
    { name: "Leitor Dedicado", icon: "📖", completed: true },
    { name: "Guerreiro da Oração", icon: "🙏", completed: true },
    { name: "Discípulo Fiel", icon: "⭐", completed: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Meu Perfil</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Perfil do Usuário */}
        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-white text-xl">J</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground">João Santos</h2>
                <p className="text-muted-foreground">Membro desde Novembro 2024</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">São Paulo, SP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progresso Geral */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Seu Progresso</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Devocionais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Encontros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Conquistas</div>
            </div>
          </CardContent>
        </Card>

        {/* Perfil do Discipulador */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Meu Discipulador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={discipulador.photo} />
                <AvatarFallback className="bg-secondary text-white">CS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{discipulador.name}</h3>
                <p className="text-sm text-muted-foreground">{discipulador.church}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {discipulador.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {discipulador.disciples} discípulos
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {discipulador.rating}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Encontros */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Histórico de Encontros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {encontros.map((encontro, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{encontro.topic}</p>
                    <p className="text-sm text-muted-foreground">{encontro.date}</p>
                  </div>
                </div>
                <Badge 
                  variant={encontro.status === "Concluído" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {encontro.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {conquistas.map((conquista, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border-2 text-center transition-smooth ${
                  conquista.completed 
                    ? 'border-success bg-success/10' 
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="text-2xl mb-1">{conquista.icon}</div>
                <p className={`text-sm font-medium ${
                  conquista.completed ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {conquista.name}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card className="shadow-soft border-0 gradient-card">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-primary mb-4">Continue crescendo! 🌱</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">15 dias consecutivos</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm text-foreground">5 orações compartilhadas</span>
              </div>
            </div>
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

export default Profile;