'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../app/lib/supabase';

export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  visibility: 'free' | 'premium';
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorAvatarUrl?: string; // Optional avatar URL for author
}

interface PostContextType {
  posts: Post[];
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => Post | undefined;
  getUserPosts: (userId: string) => Post[];
  searchPosts: (query: string) => Post[];
  getAccessiblePosts: () => Post[];
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } else {
        // Map Supabase fields to Post type
        setPosts((data || []).map((post: any) => ({
          ...post,
          authorId: post.user_id,
          authorName: post.author_name,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
        })));
      }
    };
    fetchPosts();
  }, []);

  // Create post in Supabase
  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase.from('posts').insert([{
      title: postData.title,
      content: postData.content,
      cover_image: postData.coverImage, // use cover_image not coverImage
      visibility: postData.visibility,
      user_id: postData.authorId,
      author_name: postData.authorName,
      published: postData.published,
    }]).select();
    console.log('Supabase insert data:', data);
    console.error('Supabase insert error:', error);
    if (error) {
      // Optionally show a toast or error message to the user
      return;
    }
    if (data && data[0]) {
      const newPost = {
        ...data[0],
        authorId: data[0].user_id,
        authorName: data[0].author_name,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at,
      };
      setPosts(prev => [newPost, ...prev]);
      console.log('New post added to state:', newPost);
    }
  };

  // Update post in Supabase
  const updatePost = async (id: string, postData: Partial<Post>) => {
    const { data, error } = await supabase.from('posts').update({
      ...postData,
      updated_at: new Date().toISOString(),
    }).eq('id', id).select();
    if (error) {
      console.error('Supabase update error:', error);
      return;
    }
    if (data && data[0]) {
      setPosts(prev => prev.map(post => post.id === id ? { ...post, ...data[0] } : post));
    }
  };

  // Delete post in Supabase
  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error);
      return;
    }
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const getUserPosts = (userId: string) => {
    return posts.filter(post => post.authorId === userId);
  };

  const searchPosts = (query: string) => {
    if (!query.trim()) return getAccessiblePosts();
    const lowercaseQuery = query.toLowerCase();
    return getAccessiblePosts().filter(post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getAccessiblePosts = () => {
    const isPremium = (user as any)?.is_premium;
    return posts.filter(post => {
      if (post.visibility === 'free') return true;
      if (post.visibility === 'premium' && isPremium) return true;
      return false;
    });
  };

  return (
    <PostContext.Provider value={{
      posts,
      createPost,
      updatePost,
      deletePost,
      getPost,
      getUserPosts,
      searchPosts,
      getAccessiblePosts
    }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}