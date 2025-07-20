import EditPostClient from './EditPostClient';
import { createClient } from '@supabase/supabase-js';

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id');
  if (error || !posts) {
    throw new Error('Failed to fetch post IDs from Supabase.');
  }
  return posts.map((post: { id: string }) => ({ id: post.id }));
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!post) {
    return <div>Post not found</div>;
  }

  // Map DB fields as needed
  const mappedPost = {
    ...post,
    authorId: post.user_id,
    authorName: post.author_name,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };

  return <EditPostClient post={mappedPost} />;
}