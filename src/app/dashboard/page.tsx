'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Crown, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { getUserPosts } = usePosts();
  const router = useRouter();

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

  const userPosts = getUserPosts(user.id);
  const totalPosts = userPosts.length;
  const premiumPosts = userPosts.filter(post => post.visibility === 'premium').length;
  const freePosts = userPosts.filter(post => post.visibility === 'free').length;
  const isPremium = (user as any)?.is_premium;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.user_metadata?.full_name || user.email}!
              </h1>
              <p className="text-gray-600">
                Manage your posts and track your writing progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium Member
                </Badge>
              )}
              <Link href="/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Post</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                All your published posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Posts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freePosts}</div>
              <p className="text-xs text-muted-foreground">
                Available to all readers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Posts</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{premiumPosts}</div>
              <p className="text-xs text-muted-foreground">
                Exclusive content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isPremium ? 'Premium' : 'Free'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isPremium ? 'Full access' : 'Limited features'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
            {totalPosts > 0 && (
              <Link href="/create">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </Button>
              </Link>
            )}
          </div>

          {totalPosts === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start sharing your thoughts and ideas with the world
                  </p>
                  <Link href="/create">
                    <Button className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Create Your First Post</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} showActions={true} />
              ))}
            </div>
          )}
        </div>

        {/* Premium Message for Premium Users */}
        {isPremium && (
          <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-800">
                <Crown className="w-5 h-5" />
                <span>Premium Member</span>
              </CardTitle>
              <CardDescription className="text-yellow-700">
                You have full access to all premium features and content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                <Crown className="w-4 h-4 mr-1" />
                Premium Active
              </Badge>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}