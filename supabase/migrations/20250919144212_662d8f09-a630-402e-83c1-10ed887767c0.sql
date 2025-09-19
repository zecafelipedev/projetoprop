-- Ensure all necessary tables exist and add any missing functionality

-- Add trigger for meeting_reports updated_at
CREATE TRIGGER update_meeting_reports_updated_at
  BEFORE UPDATE ON public.meeting_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for group_meetings updated_at  
CREATE TRIGGER update_group_meetings_updated_at
  BEFORE UPDATE ON public.group_meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for discipleship_notes updated_at
CREATE TRIGGER update_discipleship_notes_updated_at
  BEFORE UPDATE ON public.discipleship_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add text sanitization triggers for all content tables
CREATE TRIGGER sanitize_discipleship_notes_content
  BEFORE INSERT OR UPDATE ON public.discipleship_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_text_content();

CREATE TRIGGER sanitize_meeting_reports_content
  BEFORE INSERT OR UPDATE ON public.meeting_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_text_content();