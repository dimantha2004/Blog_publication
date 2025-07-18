'use client';

import { usePost } from '@/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Lock, ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface PostDetailPageProps {
  postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { post, loading, error } = usePost(postId);
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The post you are looking for does not exist.'}</p>
            <Button asChild>
              <Link href="/posts">Back to Posts</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canViewPremium = !!profile?.is_premium || post.visibility === 'free';
  const isAuthor = user?.id === post.author_id;

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!canViewPremium) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {post.cover_image && (
              <div className="aspect-video relative">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Premium Content</h2>
                    <p className="mb-4">Upgrade to access this premium post</p>
                    <Button asChild>
                      <Link href="/pricing">Upgrade Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  <Lock className="w-3 h-3 mr-1" />
                  Premium Content
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
              )}

              <div className="flex items-center space-x-4 mb-8">
                <Avatar>
                  <AvatarImage src={post.author?.avatar_url || ''} />
                  <AvatarFallback>
                    {getInitials(post.author?.display_name || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author?.display_name || 'Anonymous'}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">This is premium content</h3>
                <p className="text-gray-600 mb-6">
                  Upgrade to our premium plan to access this post and all other premium content.
                </p>
                <Button asChild size="lg">
                  <Link href="/pricing">
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {isAuthor && (
            <Button asChild variant="outline">
              <Link href={`/posts/${post.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Link>
            </Button>
          )}
        </div>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {post.cover_image && (
            <div className="aspect-video relative">
              <img
                src={post.cover_image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {post.visibility === 'premium' && (
                  <Badge variant="secondary" className="bg-yellow-500 text-white">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {post.status === 'draft' && (
                  <Badge variant="outline">Draft</Badge>
                )}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            )}

            <div className="flex items-center space-x-4 mb-8">
              <Avatar>
                <AvatarImage src={post.author?.avatar_url || ''} />
                <AvatarFallback>
                  {getInitials(post.author?.display_name || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author?.display_name || 'Anonymous'}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.created_at)}
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}