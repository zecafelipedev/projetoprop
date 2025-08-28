import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, Users, Calendar } from 'lucide-react';

interface AttendanceControlProps {
  groupMeetingId: string;
  disciplerId: string;
}

interface GroupMember {
  id: string;
  disciple_id: string;
  profiles: {
    id: string;
    name: string;
    email: string;
  };
}

interface AttendanceRecord {
  id: string;
  disciple_id: string;
  present: boolean;
  notes?: string;
}

export const AttendanceControl: React.FC<AttendanceControlProps> = ({
  groupMeetingId,
  disciplerId
}) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGroupMembers();
    fetchAttendance();
  }, [groupMeetingId]);

  const fetchGroupMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          disciple_id,
          profiles:disciple_id (
            id,
            name,
            email
          )
        `)
        .eq('group_meeting_id', groupMeetingId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching group members:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os membros do grupo.",
        variant: "destructive"
      });
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('group_meeting_id', groupMeetingId);

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (discipleId: string, present: boolean) => {
    try {
      const existingRecord = attendance.find(a => a.disciple_id === discipleId);
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('meeting_attendance')
          .update({ present })
          .eq('id', existingRecord.id);

        if (error) throw error;

        setAttendance(prev => prev.map(a => 
          a.disciple_id === discipleId ? { ...a, present } : a
        ));
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('meeting_attendance')
          .insert([{
            group_meeting_id: groupMeetingId,
            disciple_id: discipleId,
            present
          }])
          .select();

        if (error) throw error;
        
        if (data) {
          setAttendance(prev => [...prev, ...data]);
        }
      }

      toast({
        title: "Presença registrada",
        description: "Presença atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a presença.",
        variant: "destructive"
      });
    }
  };

  const getAttendanceStats = () => {
    const totalMembers = members.length;
    const presentMembers = attendance.filter(a => a.present).length;
    const attendanceRate = totalMembers > 0 ? (presentMembers / totalMembers) * 100 : 0;
    
    return {
      totalMembers,
      presentMembers,
      absentMembers: totalMembers - presentMembers,
      attendanceRate: attendanceRate.toFixed(1)
    };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando lista de presença...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Controle de Presença
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{stats.totalMembers} membros</span>
          </div>
          <Badge variant={parseInt(stats.attendanceRate) >= 80 ? "default" : "secondary"}>
            {stats.attendanceRate}% presença
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.presentMembers}</div>
            <div className="text-sm text-muted-foreground">Presentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absentMembers}</div>
            <div className="text-sm text-muted-foreground">Ausentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Taxa</div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum membro cadastrado neste grupo ainda.
            </div>
          ) : (
            members.map((member) => {
              const attendanceRecord = attendance.find(a => a.disciple_id === member.disciple_id);
              const isPresent = attendanceRecord?.present || false;

              return (
                <div 
                  key={member.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isPresent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isPresent}
                      onCheckedChange={(checked) => 
                        toggleAttendance(member.disciple_id, !!checked)
                      }
                      className="h-5 w-5"
                    />
                    <div>
                      <div className="font-medium">{member.profiles.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.profiles.email}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={isPresent ? "default" : "secondary"}
                    className={isPresent ? "bg-green-600" : ""}
                  >
                    {isPresent ? "Presente" : "Ausente"}
                  </Badge>
                </div>
              );
            })
          )}
        </div>

        {members.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Toque na caixa de seleção para marcar/desmarcar presença
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};