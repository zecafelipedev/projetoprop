import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppLogo } from "@/components/AppLogo";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, User } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título Principal */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <AppLogo size="lg" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-white/90">
              Aprofunde sua fé,
            </h2>
            <h2 className="text-xl font-medium text-white/90">
              cresça com propósito.
            </h2>
          </div>
        </div>

        {/* Card com Botões */}
        <Card className="p-6 space-y-4 shadow-glow border-0">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-medium"
            onClick={() => navigate('/login')}
          >
            <Users className="w-5 h-5 mr-2" />
            Entrar
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary hover:text-white h-12 text-base font-medium"
            onClick={() => navigate('/register')}
          >
            <User className="w-5 h-5 mr-2" />
            Cadastrar-se
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-primary text-sm"
            onClick={() => navigate('/dashboard')}
          >
            Entrar como visitante
          </Button>
        </Card>

        {/* Rodapé */}
        <div className="text-center">
          <p className="text-white/70 text-sm">
            Conecte-se com sua comunidade de fé
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;