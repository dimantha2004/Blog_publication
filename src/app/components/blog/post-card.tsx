'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Calendar, Lock, User, Edit, Trash2 } from 'lucide-react';
import { Post } from '../../hooks/use-posts';
import { useAuth } from '../../hooks/use-auth';
import { useProfile } from '../../hooks/use-profile';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  showActions?: boolean;
}

export function PostCard({ post, onEdit, onDelete, showActions = false }: PostCardProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const router = useRouter();

  const canViewPremium = profile?.is_premium || post.visibility === 'free';
  const isAuthor = user?.id === post.author_id;

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full flex flex-col">
      {post.cover_image && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={post.cover_image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
          {post.visibility === 'premium' && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.author?.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {getInitials(post.author?.display_name || '')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {post.author?.display_name || 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {post.status === 'draft' && (
              <Badge variant="outline">Draft</Badge>
            )}
            {post.visibility === 'premium' && !post.cover_image && (
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
        
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        
        {post.excerpt && (
          <CardDescription className="line-clamp-3">
            {post.excerpt}
          </CardDescription>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(post.created_at)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          {canViewPremium ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              Read More
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/pricing">
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to Read
              </Link>
            </Button>
          )}
          
          {showActions && isAuthor && (
            <div className="flex space-x-2">
              {onEdit ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/posts/${post.id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              ) : null}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(post)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}