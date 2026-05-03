import { supabase } from '../lib/supabaseClient'

export const uploadThumbnail = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('thumbnails')
    .upload(filePath, file);

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data } = supabase.storage.from('thumbnails').getPublicUrl(filePath);
  return { data: data.publicUrl, error: null };
}

export const createVideo = async (video: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from('videos')
    .insert([{ ...video, user_id: user.id }])
    .select()

  return { data, error }
}

export const getVideos = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const schedulePost = async (post: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from('scheduled_posts')
    .insert([{ ...post, user_id: user.id }])
    .select();

  return { data, error };
}

export const getScheduledPosts = async () => {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*, videos(title, thumbnail_url)')
    .order('scheduled_time', { ascending: true })

  return { data, error }
}

export const updatePostStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .update({ status })
    .eq('id', id)
    .select();

  return { data, error };
}
