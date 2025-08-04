import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLogo } from "@/components/AppLogo";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Church } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    church: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    
    setIsLoading(true);
    // Simular cadastro
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && acceptTerms && 
                     formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Cadastrar</h1>
        </div>

        {/* Logo */}
        <div className="text-center">
          <AppLogo size="md" />
        </div>

        {/* Form Card */}
        <Card className="shadow-glow border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-primary">
              Comece sua jornada!
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Crie sua conta e conecte-se com Deus
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Church (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="church" className="text-sm font-medium">
                Igreja (opcional)
              </Label>
              <div className="relative">
                <Church className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="church"
                  type="text"
                  placeholder="Nome da sua igreja"
                  value={formData.church}
                  onChange={(e) => updateField("church", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <label 
                htmlFor="terms" 
                className="text-sm text-foreground cursor-pointer leading-4"
              >
                Aceito os{" "}
                <Button variant="link" className="text-primary p-0 h-auto text-sm">
                  termos de uso
                </Button>{" "}
                e{" "}
                <Button variant="link" className="text-primary p-0 h-auto text-sm">
                  política de privacidade
                </Button>
              </label>
            </div>

            {/* Register Button */}
            <Button 
              className="w-full h-12 text-base font-medium mt-6" 
              onClick={handleRegister}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto font-medium"
                  onClick={() => navigate('/login')}
                >
                  Entre aqui
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/70 text-sm">
            Junte-se à nossa comunidade de fé ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;