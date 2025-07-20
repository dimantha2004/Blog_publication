"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Crown, Lock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import type { Post } from '@/contexts/PostContext';

interface PostViewClientProps {
  post: Post;
}

export default function PostViewClient({ post }: PostViewClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { deletePost } = usePosts();

  const isPremium = (user as any)?.is_premium;
  const canAccessPost = post.visibility === "free" || isPremium;
  const isAuthor = user?.id === post.authorId;
  const isPremiumPost = post.visibility === "premium";

  const renderMarkdown = (text: string) => {
    // Simple markdown renderer
    return text
      .replace(/# (.*)/g, '<h1 class="text-3xl font-bold mb-6 mt-8 first:mt-0">$1</h1>')
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mb-4 mt-6">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-bold mb-3 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  // Add excerpt/summary for non-premium users on premium posts
  const getExcerpt = (content: string, maxLength: number = 300) => {
    const plainText = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  const handleDelete = () => {
    deletePost(post.id);
    toast.success("Post deleted successfully");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Posts</span>
            </Link>
          </div>

          {/* Post Header */}
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {post.coverImage && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    {isPremiumPost && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Post Meta */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <time>{post.createdAt ? (() => { try { return format(new Date(post.createdAt), "MMM d, yyyy"); } catch { return "Unknown date"; } })() : "Unknown date"}</time>
                  </div>
                </div>
                
                {!post.coverImage && (
                  <div className="flex items-center space-x-2">
                    {isPremiumPost && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {isAuthor && (
                      <div className="flex items-center space-x-2">
                        <Link href={`/posts/${post.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this post? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>

              {/* Content Access Control */}
              {!canAccessPost ? (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-8 text-center">
                    <Lock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-amber-800 mb-2">Premium Content</h3>
                    <p className="text-amber-700 mb-6">
                      This is premium content. Only premium members can access this article and many more exclusive posts.
                    </p>
                    {/* Show excerpt/summary for non-premium users */}
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-6 text-left mx-auto">
                      <strong>Preview:</strong>
                      <p>{getExcerpt(post.content)}</p>
                    </div>
                    <Link href="/subscription">
                      <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                        Upgrade to Premium to Read Full Article
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                /* Post Content */
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class=\"mb-4\">${renderMarkdown(post.content)}</p>` 
                  }}
                />
              )}

              {/* Author Info */}
              <div className="border-t pt-8 mt-12">
                <div className="flex items-center space-x-4">
                  {post.authorAvatarUrl ? (
                    <Image
                      src={post.authorAvatarUrl}
                      alt={post.authorName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {post.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
                    <p className="text-gray-600">Author</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
} 