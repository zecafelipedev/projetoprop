import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NotebookPen, Save, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Note {
  id: string;
  content: string;
  observations: string;
  prayer_requests: string;
  created_at: string;
  updated_at: string;
}

interface DiscipleNotesProps {
  discipleId: string;
  discipleName: string;
}

export const DiscipleNotes = ({ discipleId, discipleName }: DiscipleNotesProps) => {
  const { toast } = useToast();
  const [currentNote, setCurrentNote] = useState({
    content: "",
    observations: "",
    prayer_requests: ""
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [discipleId]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('discipleship_notes')
        .select('*')
        .eq('disciple_id', discipleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
      
      // Se houver uma nota mais recente, carrega ela para edição
      if (data && data.length > 0) {
        const latestNote = data[0];
        setCurrentNote({
          content: latestNote.content || "",
          observations: latestNote.observations || "",
          prayer_requests: latestNote.prayer_requests || ""
        });
      }
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar notas do discípulo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!currentNote.content.trim() && !currentNote.observations.trim() && !currentNote.prayer_requests.trim()) {
      toast({
        title: "Aviso",
        description: "Adicione algum conteúdo antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Obter o ID do perfil do discipulador atual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      const noteData = {
        disciple_id: discipleId,
        discipler_id: profile.id,
        content: currentNote.content,
        observations: currentNote.observations,
        prayer_requests: currentNote.prayer_requests
      };

      const { error } = await supabase
        .from('discipleship_notes')
        .insert([noteData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Nota salva com sucesso.",
      });

      // Limpa o formulário atual
      setCurrentNote({
        content: "",
        observations: "",
        prayer_requests: ""
      });

      // Recarrega as notas
      fetchNotes();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar nota.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nova Nota */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            Bloco de Notas - {discipleName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo da Reunião</label>
            <Textarea
              placeholder="Descreva o que foi conversado, temas abordados, progressos observados..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Observações Pessoais</label>
            <Textarea
              placeholder="Observações sobre comportamento, necessidades, pontos de atenção..."
              value={currentNote.observations}
              onChange={(e) => setCurrentNote(prev => ({ ...prev, observations: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pedidos de Oração</label>
            <Textarea
              placeholder="Pedidos de oração compartilhados, necessidades espirituais..."
              value={currentNote.prayer_requests}
              onChange={(e) => setCurrentNote(prev => ({ ...prev, prayer_requests: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={saveNote} 
            disabled={saving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Nota"}
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de Notas */}
      {notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico de Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {notes.map((note) => (
                <div key={note.id} className="border-l-4 border-primary pl-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {formatDistanceToNow(new Date(note.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </Badge>
                  </div>

                  {note.content && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Conteúdo da Reunião:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  )}

                  {note.observations && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Observações:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.observations}
                      </p>
                    </div>
                  )}

                  {note.prayer_requests && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Pedidos de Oração:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.prayer_requests}
                      </p>
                    </div>
                  )}

                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};