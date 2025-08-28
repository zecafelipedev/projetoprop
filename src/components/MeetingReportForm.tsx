import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, Upload } from 'lucide-react';

interface MeetingReportFormProps {
  disciplerId: string;
  onReportSaved: () => void;
}

export const MeetingReportForm: React.FC<MeetingReportFormProps> = ({
  disciplerId,
  onReportSaved
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    meeting_type: '',
    title: '',
    content: '',
    meeting_date: '',
    participants_count: 0
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${disciplerId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meeting-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('meeting-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.meeting_type || !formData.meeting_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let photoUrl = null;
      
      if (photo) {
        photoUrl = await uploadPhoto(photo);
      }

      const { error } = await supabase
        .from('meeting_reports')
        .insert([{
          discipler_id: disciplerId,
          meeting_type: formData.meeting_type,
          title: formData.title,
          content: formData.content,
          meeting_date: formData.meeting_date,
          participants_count: formData.participants_count,
          photo_url: photoUrl
        }]);

      if (error) throw error;

      toast({
        title: "Relatório salvo",
        description: "Relatório da reunião salvo com sucesso!"
      });

      // Reset form
      setFormData({
        meeting_type: '',
        title: '',
        content: '',
        meeting_date: '',
        participants_count: 0
      });
      setPhoto(null);
      setPhotoPreview(null);

      onReportSaved();
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o relatório.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Relatório de Reunião
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-type">Tipo de Reunião *</Label>
              <Select value={formData.meeting_type} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, meeting_type: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Em Grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-date">Data da Reunião *</Label>
              <Input
                id="meeting-date"
                type="date"
                value={formData.meeting_date}
                onChange={(e) => setFormData(prev => ({ ...prev, meeting_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título da Reunião *</Label>
            <Input
              id="title"
              placeholder="Ex: Estudo sobre Oração, Célula Semanal..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Relatório da Reunião *</Label>
            <Textarea
              id="content"
              placeholder="Descreva como foi a reunião, pontos abordados, participação, resultados..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Número de Participantes</Label>
            <Input
              id="participants"
              type="number"
              min="0"
              value={formData.participants_count}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                participants_count: parseInt(e.target.value) || 0 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto da Reunião</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Foto
                </Button>
                {photo && <span className="text-sm text-muted-foreground">{photo.name}</span>}
              </div>

              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Relatório
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};