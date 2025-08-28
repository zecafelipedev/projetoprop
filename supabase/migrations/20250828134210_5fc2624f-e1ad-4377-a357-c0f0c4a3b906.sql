-- Enable Row Level Security and create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'disciple' CHECK (role IN ('master', 'discipler', 'disciple')),
  spiritual_stage TEXT,
  discipler_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create discipleship notes table (private notes for disciplers)
CREATE TABLE public.discipleship_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciple_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  discipler_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  prayer_requests TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting reports table (with photo support)
CREATE TABLE public.meeting_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('individual', 'group')),
  discipler_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  meeting_date DATE NOT NULL,
  participants_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group meetings table
CREATE TABLE public.group_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipler_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  theme TEXT,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create attendance tracking table
CREATE TABLE public.meeting_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_meeting_id UUID NOT NULL REFERENCES public.group_meetings(id) ON DELETE CASCADE,
  disciple_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_meeting_id, disciple_id)
);

-- Create group members table (who belongs to which group)
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_meeting_id UUID NOT NULL REFERENCES public.group_meetings(id) ON DELETE CASCADE,
  disciple_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_meeting_id, disciple_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipleship_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Masters can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'master'
  )
);

-- Create policies for discipleship notes (only discipler can see)
CREATE POLICY "Disciplers can manage notes of their disciples" ON public.discipleship_notes 
FOR ALL USING (
  discipler_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create policies for meeting reports
CREATE POLICY "Disciplers can manage their meeting reports" ON public.meeting_reports 
FOR ALL USING (
  discipler_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Masters can view all meeting reports" ON public.meeting_reports 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'master'
  )
);

-- Create policies for group meetings
CREATE POLICY "Disciplers can manage their group meetings" ON public.group_meetings 
FOR ALL USING (
  discipler_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Masters can view all group meetings" ON public.group_meetings 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'master'
  )
);

-- Create policies for attendance
CREATE POLICY "Disciplers can manage attendance of their groups" ON public.meeting_attendance 
FOR ALL USING (
  group_meeting_id IN (
    SELECT id FROM public.group_meetings gm 
    JOIN public.profiles p ON p.id = gm.discipler_id 
    WHERE p.user_id = auth.uid()
  )
);

-- Create policies for group members
CREATE POLICY "Disciplers can manage their group members" ON public.group_members 
FOR ALL USING (
  group_meeting_id IN (
    SELECT id FROM public.group_meetings gm 
    JOIN public.profiles p ON p.id = gm.discipler_id 
    WHERE p.user_id = auth.uid()
  )
);

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'disciple'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discipleship_notes_updated_at BEFORE UPDATE ON public.discipleship_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meeting_reports_updated_at BEFORE UPDATE ON public.meeting_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_meetings_updated_at BEFORE UPDATE ON public.group_meetings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for meeting photos
INSERT INTO storage.buckets (id, name, public) VALUES ('meeting-photos', 'meeting-photos', true);

-- Create storage policies for meeting photos
CREATE POLICY "Disciplers can upload meeting photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'meeting-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view meeting photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'meeting-photos');

CREATE POLICY "Disciplers can update their meeting photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'meeting-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Disciplers can delete their meeting photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'meeting-photos' AND auth.role() = 'authenticated');