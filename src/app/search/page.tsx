'use client';

import { useState, useEffect } from 'react';
import { usePosts } from '@/contexts/PostContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Crown, Filter } from 'lucide-react';

export default function SearchPage() {
  const { searchPosts, getAccessiblePosts } = usePosts();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(getAccessiblePosts());
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  const hasActiveSubscription = user?.subscription?.status === 'active';
  const isPremium = (user as any)?.is_premium;

  useEffect(() => {
    let result = searchQuery ? searchPosts(searchQuery) : getAccessiblePosts();
    
    if (filter === 'free') {
      result = result.filter(post => post.visibility === 'free');
    } else if (filter === 'premium') {
      result = result.filter(post => post.visibility === 'premium');
    }
    
    setFilteredPosts(result);
  }, [searchQuery, filter, searchPosts, getAccessiblePosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Posts</h1>
            <p className="text-gray-600">Find the content you're looking for</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for posts, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
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

          {/* Search Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              {searchQuery ? (
                <>
                  Found <span className="font-semibold">{filteredPosts.length}</span> result
                  {filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </>
              ) : (
                <>
                  Showing <span className="font-semibold">{filteredPosts.length}</span> available post
                  {filteredPosts.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Results Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {searchQuery ? 'No posts found' : 'No posts available'}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchQuery 
                  ? `No posts match "${searchQuery}". Try a different search term or adjust your filters.`
                  : 'There are no posts available with the current filters.'
                }
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Premium Upsell */}
          {!isPremium && filter === 'premium' && (
            <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg text-center">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Unlock Premium Content
              </h3>
              <p className="text-yellow-700 mb-4">
                Get access to all premium posts and exclusive content with a premium subscription.
              </p>
              <Button 
                asChild
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900"
              >
                <a href="/subscription">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </a>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}