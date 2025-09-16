import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { DiscipleNotes } from "@/components/DiscipleNotes";
import { ArrowLeft, Plus, Search, Phone, MessageCircle, Calendar, User, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GestaoDiscipulos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newDisciple, setNewDisciple] = useState({
    name: "",
    phone: "",
    email: "",
    spiritualStage: "",
    notes: ""
  });

  const disciples = [
    {
      id: 1,
      name: "Maria Silva",
      phone: "(11) 99999-1234",
      email: "maria@email.com",
      spiritualStage: "Fundamentos da Fé",
      dateJoined: "15/01/2024",
      totalMeetings: 8,
      lastMeeting: "20/02/2024"
    },
    {
      id: 2,
      name: "Pedro Santos",
      phone: "(11) 98888-5678",
      email: "pedro@email.com",
      spiritualStage: "Discipulado Avançado",
      dateJoined: "10/12/2023",
      totalMeetings: 15,
      lastMeeting: "18/02/2024"
    },
    {
      id: 3,
      name: "Ana Costa",
      phone: "(11) 97777-9012",
      email: "ana@email.com",
      spiritualStage: "Novo Convertido",
      dateJoined: "01/02/2024",
      totalMeetings: 3,
      lastMeeting: "19/02/2024"
    }
  ];

  const spiritualStages = [
    "Novo Convertido",
    "Fundamentos da Fé",
    "Discipulado Avançado",
    "Preparação para Liderança",
    "Líder em Formação"
  ];

  const filteredDisciples = disciples.filter(disciple =>
    disciple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disciple.spiritualStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDisciple = () => {
    toast({
      title: "Discípulo cadastrado!",
      description: `${newDisciple.name} foi adicionado com sucesso.`,
    });
    setNewDisciple({ name: "", phone: "", email: "", spiritualStage: "", notes: "" });
    setShowForm(false);
  };

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
            <User className="w-6 h-6" />
            <h1 className="text-xl font-bold">Gestão de Discípulos</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Ações e pesquisa */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar discípulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Cadastrar Novo Discípulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={newDisciple.name}
                    onChange={(e) => setNewDisciple({...newDisciple, name: e.target.value})}
                    placeholder="Digite o nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newDisciple.phone}
                    onChange={(e) => setNewDisciple({...newDisciple, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDisciple.email}
                    onChange={(e) => setNewDisciple({...newDisciple, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Estágio Espiritual</Label>
                  <Select value={newDisciple.spiritualStage} onValueChange={(value) => setNewDisciple({...newDisciple, spiritualStage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      {spiritualStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={newDisciple.notes}
                  onChange={(e) => setNewDisciple({...newDisciple, notes: e.target.value})}
                  placeholder="Informações adicionais..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddDisciple} className="bg-primary hover:bg-primary/90">
                  Cadastrar
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{disciples.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">
                {disciples.filter(d => d.spiritualStage === "Novo Convertido").length}
              </div>
              <div className="text-sm text-muted-foreground">Novos</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {disciples.filter(d => d.spiritualStage.includes("Avançado") || d.spiritualStage.includes("Liderança")).length}
              </div>
              <div className="text-sm text-muted-foreground">Avançados</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(disciples.reduce((acc, d) => acc + d.totalMeetings, 0) / disciples.length)}
              </div>
              <div className="text-sm text-muted-foreground">Encontros/Média</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de discípulos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Discípulos Cadastrados ({filteredDisciples.length})
          </h2>
          
          {filteredDisciples.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum discípulo encontrado.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDisciples.map((disciple) => (
              <Card key={disciple.id} className="shadow-card transition-smooth hover:shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{disciple.name}</h3>
                        <p className="text-sm text-muted-foreground">{disciple.spiritualStage}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{disciple.totalMeetings} encontros</p>
                        <p>Desde {disciple.dateJoined}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{disciple.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Último encontro: {disciple.lastMeeting}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button 
                        onClick={() => handleCall(disciple.phone, disciple.name)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Ligar
                      </Button>
                      <Button 
                        onClick={() => handleWhatsApp(disciple.phone, disciple.name)}
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={() => navigate(`/agenda-discipulos`)}
                        variant="outline"
                        size="sm"
                        className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default GestaoDiscipulos;