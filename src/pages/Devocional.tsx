import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, BookOpen, Share2 } from "lucide-react";

const Devocional = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    // Aqui salvaria o progresso no backend
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Devocional do Dia</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        
        {/* Título e Versículo */}
        <Card className="shadow-soft border-0">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl text-primary">
                Deus tem um plano para você
              </CardTitle>
              <p className="text-primary font-medium">15 de Dezembro, 2024</p>
            </div>
          </CardHeader>
        </Card>

        {/* Versículo Principal */}
        <Card className="shadow-soft border-0 gradient-card">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-lg font-medium text-foreground leading-relaxed">
              "Porque sou eu que conheço os planos que tenho para vocês", 
              diz o Senhor, "planos de fazê-los prosperar e não de 
              causar dano, planos de dar esperança e um futuro."
            </p>
            <p className="text-primary font-semibold">
              Jeremias 29:11 (NVI)
            </p>
          </CardContent>
        </Card>

        {/* Leitura Bíblica */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Leitura Bíblica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              <strong>Jeremias 29:10-14</strong>
            </p>
            <p className="text-foreground leading-relaxed">
              Assim diz o Senhor: "Quando se completarem os setenta anos da Babilônia, 
              eu cuidarei de vocês e cumprirei a minha promessa de trazê-los de volta 
              para este lugar. Porque sou eu que conheço os planos que tenho para vocês", 
              diz o Senhor, "planos de fazê-los prosperar e não de causar dano, planos 
              de dar esperança e um futuro. Então vocês clamarão a mim, virão orar a mim, 
              e eu os ouvirei. Vocês me procurarão e me acharão quando me procurarem de 
              todo o coração. Eu me deixarei ser encontrado por vocês", declara o Senhor.
            </p>
          </CardContent>
        </Card>

        {/* Reflexão */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Reflexão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              Às vezes, quando estamos passando por dificuldades, pode parecer que Deus 
              se esqueceu de nós. O povo de Israel estava em cativeiro na Babilônia, 
              longe de casa, e provavelmente se sentia abandonado.
            </p>
            <p className="text-foreground leading-relaxed">
              Mas Deus deixa claro: Ele tem planos para nós. Não são planos para nos 
              prejudicar, mas para nos fazer prosperar. Ele quer nos dar esperança e 
              um futuro.
            </p>
            <p className="text-foreground leading-relaxed">
              Hoje, lembre-se: independente da situação que você está vivendo, Deus 
              tem um plano maravilhoso para sua vida. Confie nEle!
            </p>
          </CardContent>
        </Card>

        {/* Pergunta para Reflexão */}
        <Card className="shadow-soft border-0 bg-accent">
          <CardContent className="p-6">
            <h3 className="font-semibold text-primary mb-3">Para Refletir:</h3>
            <p className="text-foreground leading-relaxed">
              Em que área da sua vida você precisa confiar mais nos planos de Deus? 
              Como você pode buscar a Deus de todo o coração hoje?
            </p>
          </CardContent>
        </Card>

        {/* Botão de Conclusão */}
        <div className="pt-4">
          {isCompleted ? (
            <Card className="bg-success/10 border-success">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-success font-medium">Devocional concluído! 🎉</p>
                <p className="text-sm text-success/80 mt-1">Continue crescendo na fé!</p>
              </CardContent>
            </Card>
          ) : (
            <Button 
              className="w-full h-12 text-base"
              onClick={handleMarkComplete}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Marcar como feito
            </Button>
          )}
        </div>

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

export default Devocional;