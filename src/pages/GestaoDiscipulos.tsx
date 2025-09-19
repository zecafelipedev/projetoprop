import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { DiscipleNotes } from "@/components/DiscipleNotes";
import { ArrowLeft, Plus, Search, Phone, MessageCircle, Calendar, User, NotebookPen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Disciple {
  id: string;
  name: string;
  phone: string;
  email: string;
  spiritual_stage: string;
  created_at: string;
}

const GestaoDiscipulos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);
  const [disciples, setDisciples] = useState<Disciple[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDisciple, setNewDisciple] = useState({
    name: "",
    phone: "",
    email: "",
    spiritualStage: "",
  });

  useEffect(() => {
    fetchDisciples();
  }, []);

  const fetchDisciples = async () => {
    try {
      // Buscar discípulos vinculados ao discipulador atual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, phone, email, spiritual_stage, created_at')
        .eq('discipler_id', profile.id)
        .order('name');

      if (error) throw error;
      setDisciples(data || []);
    } catch (error) {
      console.error('Erro ao buscar discípulos:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar discípulos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisciple = async () => {
    if (!newDisciple.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Obter o ID do perfil do discipulador atual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase
        .from('profiles')
        .insert([{
          name: newDisciple.name,
          phone: newDisciple.phone || null,
          email: newDisciple.email || null,
          spiritual_stage: newDisciple.spiritualStage || null,
          role: 'disciple',
          discipler_id: profile.id,
          user_id: crypto.randomUUID() // Generate placeholder UUID for disciples without auth accounts
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${newDisciple.name} foi adicionado como discípulo.`,
      });

      setNewDisciple({
        name: "",
        phone: "",
        email: "",
        spiritualStage: "",
      });
      
      setShowForm(false);
      fetchDisciples();
    } catch (error) {
      console.error('Erro ao adicionar discípulo:', error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar discípulo.",
        variant: "destructive",
      });
    }
  };

  const handleCall = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`);
    } else {
      toast({
        title: "Aviso",
        description: "Telefone não cadastrado.",
      });
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=Olá ${name}!`);
    } else {
      toast({
        title: "Aviso", 
        description: "Telefone não cadastrado.",
      });
    }
  };

  const filteredDisciples = disciples.filter(disciple =>
    disciple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disciple.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disciple.spiritual_stage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: disciples.length,
    newStage: disciples.filter(d => d.spiritual_stage === 'novo').length,
    advanced: disciples.filter(d => ['crescimento', 'maduro'].includes(d.spiritual_stage || '')).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se um discípulo está selecionado, mostra o bloco de notas
  if (selectedDisciple) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-secondary text-secondary-foreground p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDisciple(null)}
              className="text-secondary-foreground hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Notas - {selectedDisciple.name}</h1>
              <p className="text-secondary-foreground/80 mt-1">
                Bloco de notas privado do discipulador
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <DiscipleNotes 
            discipleId={selectedDisciple.id} 
            discipleName={selectedDisciple.name} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-secondary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestão de Discípulos</h1>
            <p className="text-secondary-foreground/80 mt-1">
              Cadastre e acompanhe seus discípulos
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search and Add */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar discípulos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Novo Discípulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  placeholder="Nome completo"
                  value={newDisciple.name}
                  onChange={(e) => setNewDisciple(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={newDisciple.phone}
                    onChange={(e) => setNewDisciple(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="email@exemplo.com"
                    type="email"
                    value={newDisciple.email}
                    onChange={(e) => setNewDisciple(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estágio Espiritual</Label>
                <Select value={newDisciple.spiritualStage} onValueChange={(value) => setNewDisciple(prev => ({ ...prev, spiritualStage: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="crescimento">Em Crescimento</SelectItem>
                    <SelectItem value="maduro">Maduro</SelectItem>
                    <SelectItem value="lider">Líder em Formação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddDisciple} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.newStage}</div>
              <div className="text-sm text-muted-foreground">Novos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.advanced}</div>
              <div className="text-sm text-muted-foreground">Avançados</div>
            </CardContent>
          </Card>
        </div>

        {/* Disciples List */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Discípulos ({filteredDisciples.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDisciples.length > 0 ? (
              <div className="space-y-3">
                {filteredDisciples.map((disciple) => (
                  <div key={disciple.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{disciple.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {disciple.phone && <div>📞 {disciple.phone}</div>}
                        {disciple.email && <div>✉️ {disciple.email}</div>}
                        {disciple.spiritual_stage && <div>🌱 {disciple.spiritual_stage}</div>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDisciple(disciple)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-600 hover:text-white"
                      >
                        <NotebookPen className="w-4 h-4 mr-1" />
                        Notas
                      </Button>
                      
                      {disciple.phone && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCall(disciple.phone)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsApp(disciple.phone, disciple.name)}
                            className="text-green-600 border-green-200 hover:bg-green-600 hover:text-white"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum discípulo encontrado.</p>
                {searchTerm ? (
                  <p className="text-sm mt-2">Tente ajustar sua busca.</p>
                ) : (
                  <p className="text-sm mt-2">Clique em "Adicionar" para cadastrar seu primeiro discípulo.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default GestaoDiscipulos;