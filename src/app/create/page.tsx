'use client';

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

export default function CreatePostPage() {
  const { user, isLoading } = useAuth();
  const { createPost } = usePosts();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [visibility, setVisibility] = useState<'free' | 'premium'>('free');
  const [saving, setSaving] = useState(false);

  const hasActiveSubscription = user?.subscription?.status === 'active';
  const isPremiumUser = user?.is_premium;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  if (!user) {
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

    // Enforce: only premium users can post premium posts
    if (visibility === 'premium' && !isPremiumUser) {
      toast.error('Only premium members can create premium posts');
      return;
    }

    setSaving(true);
    
    try {
      createPost({
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImage.trim() || undefined,
        visibility: isPremiumUser ? visibility : 'free',
        authorId: user.id,
        authorName: user.user_metadata?.full_name || user.email || 'Anonymous',
        published: true
      });
      
      toast.success('Post created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Link href="/dashboard" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Create New Post</h1>
          <p className="text-lg text-gray-600">Share your thoughts with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Post Settings */}
          <Card className="shadow-xl rounded-2xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-900">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title..."
                    required
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base px-4 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility" className="text-base font-medium">Visibility</Label>
                  <Select value={visibility} onValueChange={(value: 'free' | 'premium') => setVisibility(value)}>
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">
                        <div className="flex items-center space-x-2">
                          <span>Free Post</span>
                          <Badge variant="secondary">Public</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="premium" disabled={!isPremiumUser}>
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4" />
                          <span>Premium Post</span>
                          {!isPremiumUser && (
                            <Badge variant="outline" className="text-xs">Premium Only</Badge>
                          )}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {visibility === 'premium' && (
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
          <Card className="shadow-xl rounded-2xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-900">Post Content</CardTitle>
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
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-lg px-6 py-2 text-base">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving} className="flex items-center space-x-2 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md transition-all duration-200">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Post</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}