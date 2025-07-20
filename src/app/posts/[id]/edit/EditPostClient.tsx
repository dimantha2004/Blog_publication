"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Crown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Post } from '@/contexts/PostContext';

interface EditPostClientProps {
  post: Post;
}

export default function EditPostClient({ post }: EditPostClientProps) {
  const { user, isLoading } = useAuth();
  const { updatePost } = usePosts();
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [coverImage, setCoverImage] = useState(post.coverImage || '');
  const [visibility, setVisibility] = useState<'free' | 'premium'>(post.visibility);
  const [saving, setSaving] = useState(false);

  const hasActiveSubscription = user?.subscription?.status === 'active';

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (post && user && post.authorId !== user.id) {
      toast.error('You can only edit your own posts');
      router.push('/dashboard');
    }
  }, [post, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !post) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title for your post');
      return;
    }
    if (!content.trim()) {
      toast.error('Please write some content for your post');
      return;
    }
    if (visibility === 'premium' && !hasActiveSubscription) {
      toast.error('You need a premium account to create premium posts');
      return;
    }
    setSaving(true);
    try {
      updatePost(post.id, {
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImage.trim() || undefined,
        visibility,
      });
      toast.success('Post updated successfully!');
      router.push(`/posts/${post.id}/view`);
    } catch (error) {
      toast.error('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/posts/${post.id}/view`} className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Post</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600 mt-2">Update your post content and settings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your post title..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={visibility} onValueChange={(value: 'free' | 'premium') => setVisibility(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">
                          <div className="flex items-center space-x-2">
                            <span>Free Post</span>
                            <Badge variant="secondary">Public</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="premium" disabled={!hasActiveSubscription}>
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4" />
                            <span>Premium Post</span>
                            {!hasActiveSubscription && (
                              <Badge variant="outline" className="text-xs">Upgrade Required</Badge>
                            )}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {visibility === 'premium' && hasActiveSubscription && (
                      <p className="text-sm text-amber-600">
                        This post will only be visible to premium subscribers
                      </p>
                    )}
                  </div>
                </div>
                <ImageUpload
                  onImageUploaded={setCoverImage}
                  currentImage={coverImage}
                  onImageRemoved={() => setCoverImage('')}
                />
              </CardContent>
            </Card>
            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here... You can use Markdown formatting!"
                />
                <div className="mt-4 text-sm text-gray-500">
                  <p>Tip: You can use Markdown formatting like **bold**, *italic*, # headings, and more!</p>
                </div>
              </CardContent>
            </Card>
            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <Link href={`/posts/${post.id}/view`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving} className="flex items-center space-x-2">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 