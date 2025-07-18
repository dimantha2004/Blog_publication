'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/blog/post-form';
import { usePost, usePosts } from '@/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface EditPostPageProps {
  postId: string;
}

export function EditPostPage({ postId }: EditPostPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { post, loading: postLoading, error } = usePost(postId);
  const { updatePost } = usePosts();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (post && user && post.author_id !== user.id) {
      router.push('/dashboard');
    }
  }, [post, user, router]);

  if (authLoading || postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user || !post || error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The post you are trying to edit does not exist or you don't have permission to edit it.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    await updatePost(post.id, data);
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostForm post={post} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}