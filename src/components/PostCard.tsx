'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Crown, Lock, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
}

export default function PostCard({ post, showActions = false }: PostCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const hasActiveSubscription = user?.subscription?.status === 'active';
  const canAccessPost = post.visibility === 'free' || hasActiveSubscription;
  const isAuthor = user?.id === post.authorId;
  const isPremiumUser = user?.is_premium;
  const isPremiumPost = post.visibility === 'premium';

  const getExcerpt = (content: string, maxLength: number = 150) => {
    // Remove markdown formatting for excerpt
    const plainText = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  const formattedDate = useMemo(
    () => format(new Date(post.createdAt), 'MMM d, yyyy'),
    [post.createdAt]
  );

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {post.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            {isPremiumPost && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <time>{formattedDate}</time>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        
        <p className="text-gray-600 line-clamp-3 mb-4">
          {getExcerpt(post.content)}
        </p>
        
        {isPremiumPost && !isPremiumUser && (
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Premium content - upgrade to access full article</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between w-full">
          {isPremiumPost ? (
            isPremiumUser ? (
              <Link href={`/posts/${post.id}/view`}>
                <Button variant="default" className="flex items-center space-x-2">
                  <span>Read More</span>
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={() => router.push('/subscription')}
              >
                <Lock className="w-4 h-4" />
                <span>Preview</span>
              </Button>
            )
          ) : (
            <Link href={`/posts/${post.id}/view`}>
              <Button variant="default" className="flex items-center space-x-2">
                <span>Read More</span>
              </Button>
            </Link>
          )}
          {showActions && isAuthor && (
            <div className="flex items-center space-x-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}