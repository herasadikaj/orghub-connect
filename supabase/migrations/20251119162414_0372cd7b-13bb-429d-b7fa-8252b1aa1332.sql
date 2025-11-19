-- Create communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Create policy for reading communities (public access)
CREATE POLICY "Anyone can view communities" 
ON public.communities 
FOR SELECT 
USING (true);

-- Create community_members junction table
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Create policies for community_members
CREATE POLICY "Anyone can view community members" 
ON public.community_members 
FOR SELECT 
USING (true);

CREATE POLICY "Users can join communities" 
ON public.community_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities" 
ON public.community_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial community data
INSERT INTO public.communities (name, description, icon, color) VALUES
  ('Photography Club', 'Capture moments and share your passion for photography with fellow enthusiasts', 'Camera', 'from-purple-500 to-pink-500'),
  ('Fitness & Wellness', 'Stay active and healthy together with workout tips and motivation', 'Dumbbell', 'from-green-500 to-emerald-500'),
  ('Music Lovers', 'Share your favorite tunes and discover new music from around the world', 'Music', 'from-blue-500 to-cyan-500'),
  ('Art & Design', 'Express your creativity and get inspired by amazing artworks', 'Palette', 'from-orange-500 to-red-500'),
  ('Book Club', 'Discuss your favorite books and discover new literary adventures', 'Book', 'from-indigo-500 to-purple-500'),
  ('Volunteer Network', 'Make a difference in your community through volunteer opportunities', 'Heart', 'from-pink-500 to-rose-500');