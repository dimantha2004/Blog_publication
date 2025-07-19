'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from '../../components/blog/post-form';
import { usePosts } from '../../hooks/use-posts';
import { useAuth } from '../../hooks/use-auth';
import { useEffect } from 'react';

export function CreatePostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { createPost } = usePosts();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  type PostFormData = {
    title: string;
    content: string;
  };
  const handleSubmit = async (data: PostFormData) => {
    await createPost(data);
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}