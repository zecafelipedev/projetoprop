import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Book, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Devocional = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    toast({
      title: "Devocional concluído!",
      description: "Parabéns por dedicar tempo à Palavra de Deus.",
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
            <Book className="w-6 h-6" />
            <h1 className="text-xl font-bold">Devocional do Dia</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Leitura Bíblica */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg text-primary">João 15:1-8</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm leading-relaxed text-foreground">
              <p className="mb-3">
                <strong>1</strong> "Eu sou a videira verdadeira, e meu Pai é o agricultor. 
                <strong> 2</strong> Todo ramo que, estando em mim, não dá fruto, ele corta; 
                e todo que dá fruto ele poda, para que dê mais fruto ainda.
              </p>
              <p className="mb-3">
                <strong>3</strong> Vocês já estão limpos, pela palavra que lhes tenho falado. 
                <strong> 4</strong> Permaneçam em mim, e eu permanecerei em vocês. Nenhum ramo 
                pode dar fruto por si mesmo, se não permanecer na videira. Vocês também não 
                podem dar fruto, se não permanecerem em mim.
              </p>
              <p>
                <strong>5</strong> "Eu sou a videira; vocês são os ramos. Se alguém permanecer 
                em mim e eu nele, esse dá muito fruto; pois sem mim vocês não podem fazer coisa alguma."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reflexão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reflexão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              Jesus se apresenta como a videira verdadeira, e nós somos os ramos. 
              Esta metáfora nos ensina sobre a importância de permanecermos conectados 
              a Cristo para produzirmos fruto espiritual.
            </p>
            <p className="text-foreground leading-relaxed mt-3">
              Assim como um ramo precisa estar ligado à videira para receber nutrição 
              e vida, nós precisamos manter nossa comunhão com Jesus através da oração, 
              leitura da Palavra e obediência a Seus ensinamentos.
            </p>
            <div className="mt-4 p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                "Pergunta para reflexão: Como posso permanecer mais conectado(a) 
                a Jesus hoje? Que frutos Ele quer produzir através da minha vida?"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão de conclusão */}
        <Button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`w-full h-12 text-base font-medium ${
            isCompleted 
              ? "bg-success text-success-foreground" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Devocional Concluído
            </>
          ) : (
            "Marcar como Feito"
          )}
        </Button>
      </div>

      <Navigation />
    </div>
  );
};

export default Devocional;