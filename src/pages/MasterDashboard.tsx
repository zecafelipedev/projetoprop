import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, UserCheck, Settings, Eye } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email: string;
  role: 'master' | 'discipler' | 'disciple';
  spiritual_stage?: string;
  discipler_id?: string;
  created_at: string;
  discipler?: { name: string };
}

const MasterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [disciples, setDisciples] = useState<Profile[]>([]);
  const [disciplers, setDisciplers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all disciples
      const { data: disciplesData, error: disciplesError } = await supabase
        .from('profiles')
        .select(`
          *,
          discipler:discipler_id(name)
        `)
        .eq('role', 'disciple');

      if (disciplesError) throw disciplesError;

      // Fetch all disciplers
      const { data: disciplersData, error: disciplersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'discipler');

      if (disciplersError) throw disciplersError;

      setDisciples((disciplesData || []) as Profile[]);
      setDisciplers((disciplersData || []) as Profile[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const assignDiscipler = async (discipleId: string, disciplerId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ discipler_id: disciplerId })
        .eq('id', discipleId);

      if (error) throw error;

      toast({
        title: "Atribuição realizada",
        description: "Discipulador atribuído com sucesso!"
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error assigning discipler:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o discipulador.",
        variant: "destructive"
      });
    }
  };

  const promoteToDisciples = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'discipler' })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Promoção realizada",
        description: "Usuário promovido a discipulador!"
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível promover o usuário.",
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalDisciples: disciples.length,
    assignedDisciples: disciples.filter(d => d.discipler_id).length,
    unassignedDisciples: disciples.filter(d => !d.discipler_id).length,
    totalDisciplers: disciplers.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-secondary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Painel Master</h1>
            <p className="text-sm opacity-90">Gerenciamento de Discipuladores</p>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalDisciples}</div>
              <div className="text-sm text-muted-foreground">Total Discípulos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.assignedDisciples}</div>
              <div className="text-sm text-muted-foreground">Atribuídos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.unassignedDisciples}</div>
              <div className="text-sm text-muted-foreground">Não Atribuídos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalDisciplers}</div>
              <div className="text-sm text-muted-foreground">Discipuladores</div>
            </CardContent>
          </Card>
        </div>

        {/* Disciplers Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Discipuladores Ativos ({disciplers.length})
            </CardTitle>
            <CardDescription>
              Gerenciar discipuladores e seus grupos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disciplers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum discipulador cadastrado ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {disciplers.map((discipler) => {
                  const disciplerDisciples = disciples.filter(d => d.discipler_id === discipler.id);
                  return (
                    <div key={discipler.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{discipler.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {discipler.email} • {disciplerDisciples.length} discípulos
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/discipler-details/${discipler.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disciples Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestão de Discípulos ({disciples.length})
            </CardTitle>
            <CardDescription>
              Atribuir discipuladores e gerenciar discípulos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disciples.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum discípulo cadastrado ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {disciples.map((disciple) => (
                  <div key={disciple.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{disciple.name}</div>
                        <div className="text-sm text-muted-foreground">{disciple.email}</div>
                        {disciple.spiritual_stage && (
                          <Badge variant="secondary" className="mt-1">
                            {disciple.spiritual_stage}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => promoteToDisciples(disciple.id)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Promover
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Discipulador:</span>
                      {disciple.discipler ? (
                        <Badge variant="default">{disciple.discipler.name}</Badge>
                      ) : (
                        <Badge variant="outline">Não atribuído</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Atribuir a:</span>
                      <Select onValueChange={(disciplerId) => assignDiscipler(disciple.id, disciplerId)}>
                        <SelectTrigger className="w-64">
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default MasterDashboard;