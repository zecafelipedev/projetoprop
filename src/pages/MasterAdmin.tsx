import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, UserCheck, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  spiritual_stage: string;
  discipler_id: string | null;
  discipler_name?: string;
  created_at: string;
}

const MasterAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [disciplers, setDisciplers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDiscipler, setSelectedDiscipler] = useState<string>("");
  const [selectedDisciple, setSelectedDisciple] = useState<string>("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Buscar todos os perfis com informações do discipulador
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, name, email, phone, role, spiritual_stage, discipler_id, created_at,
          discipler:profiles!discipler_id(name)
        `);

      if (error) throw error;

      const profilesWithDiscipler = data.map(profile => ({
        ...profile,
        discipler_name: profile.discipler?.name || null
      }));

      setProfiles(profilesWithDiscipler);
      setDisciplers(profilesWithDiscipler.filter(p => p.role === 'discipler'));
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar perfis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignDiscipler = async () => {
    if (!selectedDisciple || !selectedDiscipler) {
      toast({
        title: "Erro",
        description: "Selecione um discípulo e um discipulador.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ discipler_id: selectedDiscipler })
        .eq('id', selectedDisciple);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Discipulador atribuído com sucesso.",
      });

      setSelectedDisciple("");
      setSelectedDiscipler("");
      fetchProfiles();
    } catch (error) {
      console.error('Erro ao atribuir discipulador:', error);
      toast({
        title: "Erro",
        description: "Falha ao atribuir discipulador.",
        variant: "destructive",
      });
    }
  };

  const changeUserRole = async (profileId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Função alterada com sucesso.",
      });

      fetchProfiles();
    } catch (error) {
      console.error('Erro ao alterar função:', error);
      toast({
        title: "Erro",
        description: "Falha ao alterar função do usuário.",
        variant: "destructive",
      });
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const disciples = filteredProfiles.filter(p => p.role === 'disciple');
  const stats = {
    totalUsers: profiles.length,
    disciples: profiles.filter(p => p.role === 'disciple').length,
    disciplers: profiles.filter(p => p.role === 'discipler').length,
    unassigned: profiles.filter(p => p.role === 'disciple' && !p.discipler_id).length
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
            <h1 className="text-2xl font-bold">Administração Master</h1>
            <p className="text-secondary-foreground/80 mt-1">
              Gerencie usuários e atribuições
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total de Usuários</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.disciples}</div>
              <div className="text-sm text-muted-foreground">Discípulos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.disciplers}</div>
              <div className="text-sm text-muted-foreground">Discipuladores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.unassigned}</div>
              <div className="text-sm text-muted-foreground">Não Atribuídos</div>
            </CardContent>
          </Card>
        </div>

        {/* Atribuir Discipulador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Atribuir Discipulador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Discípulo</label>
                <Select value={selectedDisciple} onValueChange={setSelectedDisciple}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar discípulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciples.map((disciple) => (
                      <SelectItem key={disciple.id} value={disciple.id}>
                        {disciple.name} {!disciple.discipler_id && <Badge variant="outline" className="ml-2">Não atribuído</Badge>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Discipulador</label>
                <Select value={selectedDiscipler} onValueChange={setSelectedDiscipler}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar discipulador" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplers.map((discipler) => (
                      <SelectItem key={discipler.id} value={discipler.id}>
                        {discipler.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={assignDiscipler} className="w-full">
                  Atribuir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Todos os Usuários
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        {profile.phone && (
                          <p className="text-sm text-muted-foreground">{profile.phone}</p>
                        )}
                        {profile.discipler_name && (
                          <p className="text-sm text-blue-600">
                            Discipulador: {profile.discipler_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={profile.role === 'master' ? 'default' : profile.role === 'discipler' ? 'secondary' : 'outline'}
                    >
                      {profile.role === 'master' ? 'Master' : profile.role === 'discipler' ? 'Discipulador' : 'Discípulo'}
                    </Badge>
                    
                    {profile.role !== 'master' && (
                      <Select
                        value={profile.role}
                        onValueChange={(newRole) => changeUserRole(profile.id, newRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disciple">Discípulo</SelectItem>
                          <SelectItem value="discipler">Discipulador</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MasterAdmin;