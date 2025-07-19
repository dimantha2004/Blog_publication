'use client';

import { useAuth } from '../../hooks/use-auth';
import { useSubscription } from '../../hooks/use-subscription';
import { usePosts } from '../../hooks/use-posts';
import { useProfile } from '../../hooks/use-profile';
import { PostCard } from '../../components/blog/post-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Post = {
  id: string;
  title: string;
  content: string;
  // Add other fields as needed
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const { subscription, loading: subLoading, isActive, activeSubscriptionName } = useSubscription();
  const { posts, loading: postsLoading, deletePost } = usePosts({ 
    authorId: user?.id,
    limit: 10 
  });
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    
    refetchProfile();
  }, [user, authLoading, router, refetchProfile]);

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDeletePost = async (post: Post) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeletingPost(post.id);
    try {
      await deletePost(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeletingPost(null);
    }
  };

  const handleEditPost = (post: Post) => {
    router.push(`/posts/${post.id}/edit`);
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'past_due':
        return 'destructive';
      case 'canceled':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600 flex items-center gap-2">
            Welcome back, {user.email}
            {profile?.is_premium && (
              <span className="inline-block bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded ml-2">Premium User</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member since</label>
                <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

         
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Posts</CardTitle>
                <CardDescription>Manage your blog posts</CardDescription>
              </div>
              <Button asChild>
                <Link href="/create-post">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any posts yet</p>
                <Button asChild>
                  <Link href="/create-post">Create your first post</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showActions={true}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/posts">Browse All Posts</Link>
              </Button>
              <Button asChild>
                <Link href="/pricing">View All Plans</Link>
              </Button>
              {isActive && (
                <Button disabled>
                  Manage Subscription (Coming Soon)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}