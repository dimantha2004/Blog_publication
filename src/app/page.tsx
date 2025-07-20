'use client';

import { useState, useEffect } from 'react';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Crown, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  const hasActiveSubscription = user?.subscription?.status === 'active';
  const isPremium = (user as any)?.is_premium;

  useEffect(() => {
    let result = searchQuery
      ? posts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : posts;
    if (filter === 'free') {
      result = result.filter(post => post.visibility === 'free');
    } else if (filter === 'premium') {
      result = result.filter(post => post.visibility === 'premium');
    }
    setFilteredPosts(result);
  }, [posts, searchQuery, filter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Bloggers hub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing content from our community of writers. Join our premium membership for exclusive access to advanced articles and insights.
          </p>
          
          {!user && (
            <div className="flex items-center justify-center space-x-4">
              <Link href="/signup">
                <Button size="lg" className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Get Started Free</span>
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="lg" variant="outline" className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Go Premium</span>
                </Button>
              </Link>
            </div>
          )}
          {user && isPremium && (
            <div className="flex items-center justify-center mt-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                <Crown className="w-4 h-4 mr-1" />
                Premium Member
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All Posts
              </Button>
              <Button
                variant={filter === 'free' ? 'default' : 'outline'}
                onClick={() => setFilter('free')}
                size="sm"
              >
                Free
              </Button>
              <Button
                variant={filter === 'premium' ? 'default' : 'outline'}
                onClick={() => setFilter('premium')}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchQuery 
                ? `No posts match "${searchQuery}". Try a different search term.`
                : 'Be the first to create a post!'
              }
            </p>
            {user && (
              <Link href="/create">
                <Button>Create Your First Post</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}