import PostViewClient from './PostViewClient';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import Header from '@/components/Header';

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

export default async function PostViewPage({ params }: { params: { id: string } }) {
  // Fetch post data from Supabase (server-side)
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
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The post you're looking for doesn't exist or was not included in the static export. Try rebuilding the site or check your post IDs.</p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch the author's profile for avatar
  let authorAvatarUrl: string | undefined = undefined;
  if (post.user_id) {
    const { data: userProfile } = await supabase
      .from('users')
      .select('avatar_url, user_metadata')
      .eq('id', post.user_id)
      .maybeSingle();
    authorAvatarUrl =
      userProfile?.avatar_url ||
      (userProfile?.user_metadata && userProfile.user_metadata.avatar_url);
  }

  // Map DB fields to expected props
  const mappedPost = {
    ...post,
    authorId: post.user_id,
    authorName: post.author_name,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    authorAvatarUrl,
  };

  return <PostViewClient post={mappedPost} />;
} 