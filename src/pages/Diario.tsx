import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Save, Share2, BookOpen } from "lucide-react";

const Diario = () => {
  const navigate = useNavigate();
  const [diaryEntry, setDiaryEntry] = useState("");
  const [shareWithMentor, setShareWithMentor] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (diaryEntry.trim()) {
      setIsSaved(true);
      // Aqui salvaria no backend
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Diário Espiritual</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        
        {/* Título da Seção */}
        <Card className="shadow-soft border-0">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl text-primary">
                Seu Momento com Deus
              </CardTitle>
              <p className="text-muted-foreground">
                Registre como Deus tem falado com você
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Prompt Inspirador */}
        <Card className="shadow-soft border-0 bg-accent">
          <CardContent className="p-6">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              O que Deus falou com você hoje?
            </h3>
            <p className="text-foreground leading-relaxed text-sm">
              Pode ser através da leitura bíblica, oração, uma conversa, 
              um momento na natureza... Deus fala de várias formas!
            </p>
          </CardContent>
        </Card>

        {/* Campo de Escrita */}
        <Card className="shadow-soft border-0">
          <CardContent className="p-6 space-y-4">
            <Textarea
              placeholder="Digite aqui suas reflexões, orações, descobertas ou qualquer coisa que tocou seu coração hoje..."
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              className="min-h-[200px] resize-none text-base leading-relaxed"
            />
            
            {/* Opção de compartilhar */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="share"
                checked={shareWithMentor}
                onCheckedChange={(checked) => setShareWithMentor(checked === true)}
              />
              <label 
                htmlFor="share" 
                className="text-sm text-foreground cursor-pointer"
              >
                Compartilhar com meu discipulador
              </label>
            </div>

            {shareWithMentor && (
              <div className="bg-accent rounded-lg p-3">
                <p className="text-sm text-foreground">
                  💡 Seu discipulador poderá ver esta reflexão e te ajudar 
                  no seu crescimento espiritual.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Versículo de Inspiração */}
        <Card className="shadow-soft border-0 gradient-card">
          <CardContent className="p-6 text-center">
            <p className="text-base font-medium text-foreground leading-relaxed mb-2">
              "Examina-me, ó Deus, e conhece o meu coração; 
              prova-me e conhece os meus pensamentos."
            </p>
            <p className="text-primary font-semibold text-sm">
              Salmos 139:23
            </p>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <div className="pt-4">
          {isSaved ? (
            <Card className="bg-success/10 border-success">
              <CardContent className="p-4 text-center">
                <Save className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-success font-medium">Salvo no seu diário! 📝</p>
                <p className="text-sm text-success/80 mt-1">Continue registrando sua jornada com Deus</p>
              </CardContent>
            </Card>
          ) : (
            <Button 
              className="w-full h-12 text-base"
              onClick={handleSave}
              disabled={!diaryEntry.trim()}
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar no meu diário
            </Button>
          )}
        </div>

        {/* Entradas Anteriores */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Suas últimas reflexões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary-light pl-4 py-2">
              <p className="text-sm text-muted-foreground">14 de Dezembro</p>
              <p className="text-foreground">
                Hoje durante a oração senti uma paz muito grande. Deus me lembrou 
                que Ele está no controle de tudo...
              </p>
            </div>
            <div className="border-l-4 border-primary-light pl-4 py-2">
              <p className="text-sm text-muted-foreground">13 de Dezembro</p>
              <p className="text-foreground">
                Lendo sobre a fé de Abraão, percebi como preciso confiar mais 
                nas promessas de Deus mesmo quando não vejo o caminho...
              </p>
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

export default Diario;