import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, Heart } from 'lucide-react';

interface DiscipleshipNotesProps {
  discipleId: string;
  discipleName: string;
  disciplerId: string;
}

interface Note {
  id: string;
  content: string;
  prayer_requests: string;
  observations: string;
  created_at: string;
  updated_at: string;
}

export const DiscipleshipNotes: React.FC<DiscipleshipNotesProps> = ({
  discipleId,
  discipleName,
  disciplerId
}) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [prayerRequests, setPrayerRequests] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [discipleId, disciplerId]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('discipleship_notes')
        .select('*')
        .eq('disciple_id', discipleId)
        .eq('discipler_id', disciplerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setNotes(data);
        setContent(data.content || '');
        setPrayerRequests(data.prayer_requests || '');
        setObservations(data.observations || '');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as anotações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const noteData = {
        disciple_id: discipleId,
        discipler_id: disciplerId,
        content,
        prayer_requests: prayerRequests,
        observations
      };

      if (notes) {
        // Update existing notes
        const { error } = await supabase
          .from('discipleship_notes')
          .update(noteData)
          .eq('id', notes.id);

        if (error) throw error;
      } else {
        // Create new notes
        const { error } = await supabase
          .from('discipleship_notes')
          .insert([noteData]);

        if (error) throw error;
      }

      toast({
        title: "Anotações salvas",
        description: "Suas anotações foram salvas com sucesso!"
      });

      await fetchNotes(); // Refresh notes
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as anotações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando anotações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Anotações Privadas - {discipleName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Estas anotações são visíveis apenas para você como discipulador.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="content">Anotações Gerais</Label>
          <Textarea
            id="content"
            placeholder="Registre observações sobre o crescimento espiritual, dificuldades, progresso nos estudos..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayer-requests" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Pedidos de Oração
          </Label>
          <Textarea
            id="prayer-requests"
            placeholder="Registre pedidos de oração compartilhados pelo discípulo..."
            value={prayerRequests}
            onChange={(e) => setPrayerRequests(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations">Pontos de Acompanhamento</Label>
          <Textarea
            id="observations"
            placeholder="Pontos específicos para trabalhar nos próximos encontros, metas, compromissos..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={saveNotes} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Anotações
              </>
            )}
          </Button>
        </div>

        {notes && (
          <div className="text-xs text-muted-foreground">
            Última atualização: {new Date(notes.updated_at).toLocaleString('pt-BR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};