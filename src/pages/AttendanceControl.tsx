import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, Calendar, Plus, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GroupMeeting {
  id: string;
  name: string;
  description: string;
  theme: string;
  meeting_date: string;
  duration: number;
  created_at: string;
}

interface GroupMember {
  id: string;
  disciple_id: string;
  group_meeting_id: string;
  joined_at: string;
  disciple_name: string;
}

interface Attendance {
  id: string;
  group_meeting_id: string;
  disciple_id: string;
  present: boolean;
  notes: string;
  disciple_name: string;
}

const AttendanceControl = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [groups, setGroups] = useState<GroupMeeting[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMembers();
      fetchAttendance();
    }
  }, [selectedGroup, attendanceDate]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('group_meetings')
        .select('*')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
      
      if (data && data.length > 0) {
        setSelectedGroup(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar grupos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async () => {
    if (!selectedGroup) return;

    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, disciple_id, group_meeting_id, joined_at,
          disciple:profiles!disciple_id(name)
        `)
        .eq('group_meeting_id', selectedGroup);

      if (error) throw error;

      const membersWithNames = data?.map(member => ({
        ...member,
        disciple_name: member.disciple?.name || 'Nome não encontrado'
      })) || [];

      setMembers(membersWithNames);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar membros do grupo.",
        variant: "destructive",
      });
    }
  };

  const fetchAttendance = async () => {
    if (!selectedGroup || !attendanceDate) return;

    try {
      // Buscar presenças já registradas para esta data
      const { data, error } = await supabase
        .from('meeting_attendance')
        .select(`
          id, group_meeting_id, disciple_id, present, notes,
          disciple:profiles!disciple_id(name)
        `)
        .eq('group_meeting_id', selectedGroup)
        .gte('created_at', `${attendanceDate}T00:00:00.000Z`)
        .lt('created_at', `${attendanceDate}T23:59:59.999Z`);

      if (error) throw error;

      const attendanceWithNames = data?.map(att => ({
        ...att,
        disciple_name: att.disciple?.name || 'Nome não encontrado'
      })) || [];

      setAttendance(attendanceWithNames);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar presenças.",
        variant: "destructive",
      });
    }
  };

  const toggleAttendance = async (discipleId: string, isPresent: boolean) => {
    if (!selectedGroup) return;

    try {
      // Verificar se já existe um registro para esta data
      const existingAttendance = attendance.find(att => att.disciple_id === discipleId);

      if (existingAttendance) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('meeting_attendance')
          .update({ present: isPresent })
          .eq('id', existingAttendance.id);

        if (error) throw error;
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('meeting_attendance')
          .insert([{
            group_meeting_id: selectedGroup,
            disciple_id: discipleId,
            present: isPresent,
            notes: ""
          }]);

        if (error) throw error;
      }

      // Recarregar dados
      fetchAttendance();
      
      toast({
        title: "Sucesso!",
        description: `Presença ${isPresent ? 'marcada' : 'desmarcada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar presença.",
        variant: "destructive",
      });
    }
  };

  const getAttendanceStats = () => {
    const totalMembers = members.length;
    const presentCount = attendance.filter(att => att.present).length;
    const absentCount = totalMembers - presentCount;
    
    return { totalMembers, presentCount, absentCount };
  };

  const getMemberAttendance = (discipleId: string) => {
    return attendance.find(att => att.disciple_id === discipleId);
  };

  const stats = getAttendanceStats();

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
            <h1 className="text-2xl font-bold">Controle de Presença</h1>
            <p className="text-secondary-foreground/80 mt-1">
              Gerencie a frequência dos PGs
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Seleção de Grupo e Data */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Grupo/PG</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data da Reunião</label>
                <Input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalMembers}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
              <div className="text-sm text-muted-foreground">Presentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
              <div className="text-sm text-muted-foreground">Ausentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Membros */}
        {selectedGroup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lista de Presença
              </CardTitle>
            </CardHeader>
            <CardContent>
              {members.length > 0 ? (
                <div className="space-y-3">
                  {members.map((member) => {
                    const memberAttendance = getMemberAttendance(member.disciple_id);
                    const isPresent = memberAttendance?.present || false;
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={member.id}
                              checked={isPresent}
                              onCheckedChange={(checked) => 
                                toggleAttendance(member.disciple_id, checked as boolean)
                              }
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{member.disciple_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Membro desde {formatDistanceToNow(new Date(member.joined_at), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isPresent ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Presente
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" />
                              Ausente
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum membro encontrado neste grupo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AttendanceControl;