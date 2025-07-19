'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  visibility: 'free' | 'premium';
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function usePosts(options?: {
  authorId?: string;
  visibility?: 'free' | 'premium';
  status?: 'draft' | 'published';
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [user, options?.authorId, options?.visibility, options?.status, options?.search, options?.limit, options?.offset]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' });

      
      if (options?.authorId) {
        query = query.eq('author_id', options.authorId);
      }

      if (options?.visibility) {
        query = query.eq('visibility', options.visibility);
      }

      if (options?.status) {
        query = query.eq('status', options.status);
      } else {
        
        if (!options?.authorId) {
          query = query.eq('status', 'published');
        }
      }

      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
      }

      
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      
      const postsWithAuthors = await Promise.all((data || []).map(async (post) => {
        let authorProfile = null;
        if (post.author_id) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('display_name, avatar_url')
            .eq('id', post.author_id)
            .single();
          
          authorProfile = profile || { display_name: post.author_id, avatar_url: null };
        }
        return { ...post, author: authorProfile };
      }));

      setPosts(postsWithAuthors);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    title: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    visibility?: 'free' | 'premium';
    status?: 'draft' | 'published';
  }) => {
    if (!user) throw new Error('User not authenticated');

    
    await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        display_name: user.email,
      });

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...postData,
        author_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await fetchPosts();
    return data;
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from('posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await fetchPosts();
    return data;
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    totalCount,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
}

export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            author:user_profiles!posts_author_id_fkey(display_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading, error };
}