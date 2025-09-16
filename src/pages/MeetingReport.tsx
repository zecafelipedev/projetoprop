import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Save, Calendar, Users, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MeetingReport {
  id: string;
  title: string;
  content: string;
  meeting_date: string;
  meeting_type: string;
  participants_count: number;
  photo_url: string | null;
  created_at: string;
}

const MeetingReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<MeetingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    meeting_date: new Date().toISOString().split('T')[0],
    meeting_type: "individual",
    participants_count: 1,
    photo: null as File | null
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_reports')
        .select('*')
        .order('meeting_date', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar relatórios de reunião.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('meeting-photos')
        .upload(fileName, file);

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('meeting-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      toast({
        title: "Erro",
        description: "Falha ao fazer upload da foto.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveReport = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Obter o ID do perfil do usuário atual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      let photoUrl = null;
      
      // Upload da foto se fornecida
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo);
        if (!photoUrl) return; // Se falhou o upload, não continua
      }

      const reportData = {
        discipler_id: profile.id,
        title: formData.title,
        content: formData.content,
        meeting_date: formData.meeting_date,
        meeting_type: formData.meeting_type,
        participants_count: formData.participants_count,
        photo_url: photoUrl
      };

      const { error } = await supabase
        .from('meeting_reports')
        .insert([reportData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Relatório de reunião salvo com sucesso.",
      });

      // Limpar formulário
      setFormData({
        title: "",
        content: "",
        meeting_date: new Date().toISOString().split('T')[0],
        meeting_type: "individual",
        participants_count: 1,
        photo: null
      });

      // Recarregar relatórios
      fetchReports();
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar relatório de reunião.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }
      
      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
    }
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
            <h1 className="text-2xl font-bold">Relatórios de Reunião</h1>
            <p className="text-secondary-foreground/80 mt-1">
              Registre suas reuniões com fotos
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Novo Relatório */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Nova Reunião
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título da Reunião</Label>
                <Input
                  placeholder="Ex: Discipulado - Fundamentos da Fé"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data da Reunião</Label>
                <Input
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, meeting_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Reunião</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.meeting_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, meeting_type: e.target.value }))}
                >
                  <option value="individual">Individual</option>
                  <option value="grupo">Grupo/PG</option>
                  <option value="celula">Célula</option>
                  <option value="treinamento">Treinamento</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Número de Participantes</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.participants_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, participants_count: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Conteúdo da Reunião</Label>
              <Textarea
                placeholder="Descreva o que foi abordado na reunião, pontos importantes, decisões tomadas..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Foto da Reunião (Opcional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {formData.photo && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    {formData.photo.name}
                  </Badge>
                )}
              </div>
            </div>

            <Button 
              onClick={saveReport} 
              disabled={saving || uploading}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : uploading ? "Enviando foto..." : "Salvar Relatório"}
            </Button>
          </CardContent>
        </Card>

        {/* Histórico de Relatórios */}
        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Histórico de Reuniões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{report.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {report.meeting_type}
                        </Badge>
                        <Badge variant="secondary">
                          <Users className="w-3 h-3 mr-1" />
                          {report.participants_count}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{new Date(report.meeting_date).toLocaleDateString('pt-BR')}</span>
                      <span>
                        {formatDistanceToNow(new Date(report.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">{report.content}</p>

                    {report.photo_url && (
                      <div className="mt-3">
                        <img 
                          src={report.photo_url} 
                          alt="Foto da reunião" 
                          className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MeetingReport;