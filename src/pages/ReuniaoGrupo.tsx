import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Plus, Edit, Calendar, Users, Clock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ReuniaoGrupo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<number | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    theme: "",
    date: "",
    time: "",
    description: "",
    duration: "90"
  });

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      theme: "A Importância da Oração",
      date: "2024-02-25",
      time: "19:00",
      description: "Estudo sobre a vida de oração e sua importância no crescimento espiritual",
      duration: "90",
      participants: 12
    },
    {
      id: 2,
      theme: "Servindo com Amor",
      date: "2024-03-03",
      time: "19:00",
      description: "Como servir uns aos outros seguindo o exemplo de Cristo",
      duration: "90",
      participants: 15
    },
    {
      id: 3,
      theme: "Evangelismo Pessoal",
      date: "2024-03-10",
      time: "19:00",
      description: "Estratégias práticas para compartilhar o evangelho no dia a dia",
      duration: "120",
      participants: 18
    },
    {
      id: 4,
      theme: "Discipulado de Novos Convertidos",
      date: "2024-03-17",
      time: "19:00",
      description: "Como acompanhar e cuidar de quem acabou de aceitar Jesus",
      duration: "90",
      participants: 10
    }
  ]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const isUpcoming = (dateStr: string) => {
    const meetingDate = new Date(dateStr);
    const today = new Date();
    return meetingDate >= today;
  };

  const upcomingMeetings = meetings.filter(meeting => isUpcoming(meeting.date));
  const pastMeetings = meetings.filter(meeting => !isUpcoming(meeting.date));

  const handleAddMeeting = () => {
    const newId = Math.max(...meetings.map(m => m.id)) + 1;
    setMeetings([...meetings, {
      ...newMeeting,
      id: newId,
      participants: 0
    }]);
    toast({
      title: "Reunião criada!",
      description: `O tema "${newMeeting.theme}" foi agendado com sucesso.`,
    });
    setNewMeeting({ theme: "", date: "", time: "", description: "", duration: "90" });
    setShowForm(false);
  };

  const handleEditMeeting = (meeting: any) => {
    setEditingMeeting(meeting.id);
    setNewMeeting({
      theme: meeting.theme,
      date: meeting.date,
      time: meeting.time,
      description: meeting.description,
      duration: meeting.duration
    });
    setShowForm(true);
  };

  const handleUpdateMeeting = () => {
    setMeetings(meetings.map(meeting => 
      meeting.id === editingMeeting 
        ? { ...meeting, ...newMeeting }
        : meeting
    ));
    toast({
      title: "Reunião atualizada!",
      description: `As alterações foram salvas com sucesso.`,
    });
    setNewMeeting({ theme: "", date: "", time: "", description: "", duration: "90" });
    setShowForm(false);
    setEditingMeeting(null);
  };

  const handleDeleteMeeting = (id: number, theme: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    toast({
      title: "Reunião removida",
      description: `"${theme}" foi removida da agenda.`,
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
            <Users className="w-6 h-6" />
            <h1 className="text-xl font-bold">Reuniões em Grupo</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Ação para adicionar */}
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Reunião
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingMeeting ? "Editar Reunião" : "Agendar Nova Reunião"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema da Reunião</Label>
                <Input
                  id="theme"
                  value={newMeeting.theme}
                  onChange={(e) => setNewMeeting({...newMeeting, theme: e.target.value})}
                  placeholder="Ex: A Importância da Oração"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
                    placeholder="90"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  placeholder="Descreva o conteúdo e objetivos da reunião..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingMeeting ? handleUpdateMeeting : handleAddMeeting} 
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingMeeting ? "Atualizar" : "Agendar"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingMeeting(null);
                    setNewMeeting({ theme: "", date: "", time: "", description: "", duration: "90" });
                  }}
                >
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
              <div className="text-2xl font-bold text-primary">{upcomingMeetings.length}</div>
              <div className="text-sm text-muted-foreground">Próximas</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">{pastMeetings.length}</div>
              <div className="text-sm text-muted-foreground">Realizadas</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {Math.round(meetings.reduce((acc, m) => acc + m.participants, 0) / meetings.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Média/Encontro</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{meetings.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Reuniões */}
        {upcomingMeetings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Próximas Reuniões ({upcomingMeetings.length})
            </h2>
            
            {upcomingMeetings.map((meeting) => (
              <Card key={meeting.id} className="shadow-card transition-smooth hover:shadow-soft border-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{meeting.theme}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMeeting(meeting)}
                          className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting.id, meeting.theme)}
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants} pessoas</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reuniões Passadas */}
        {pastMeetings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Reuniões Realizadas ({pastMeetings.length})
            </h2>
            
            {pastMeetings.map((meeting) => (
              <Card key={meeting.id} className="shadow-card transition-smooth opacity-75">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{meeting.theme}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                        Realizada
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants} pessoas</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {meetings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma reunião agendada ainda.
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Agendar Primeira Reunião
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default ReuniaoGrupo;