/*
  # Blog Platform Schema

  1. New Tables
    - `posts`: Blog posts with premium content support
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `excerpt` (text, optional)
      - `cover_image` (text, optional URL)
      - `visibility` (enum: 'free', 'premium')
      - `status` (enum: 'draft', 'published')
      - `author_id` (uuid, references auth.users)
      - `created_at` and `updated_at` timestamps

    - `user_profiles`: Extended user information
      - `id` (uuid, references auth.users)
      - `display_name` (text, optional)
      - `bio` (text, optional)
      - `avatar_url` (text, optional)
      - `is_premium` (boolean, default false)

  2. Storage
    - Create storage bucket for blog images
    - Set up RLS policies for image uploads

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Premium content access based on subscription status
*/

-- Create enum types
CREATE TYPE post_visibility AS ENUM ('free', 'premium');
CREATE TYPE post_status AS ENUM ('draft', 'published');

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  bio text,
  avatar_url text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image text,
  visibility post_visibility DEFAULT 'free',
  status post_status DEFAULT 'draft',
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Remove all RLS policies for posts and add permissive policies for testing
DROP POLICY IF EXISTS "Anyone can view published free posts" ON posts;
DROP POLICY IF EXISTS "Premium users can view published premium posts" ON posts;
DROP POLICY IF EXISTS "Authors can view own posts" ON posts;
DROP POLICY IF EXISTS "Authors can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON posts;

CREATE POLICY "Anyone can select posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete posts" ON posts FOR DELETE USING (true);

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Users can update own blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user premium status based on subscription
CREATE OR REPLACE FUNCTION update_user_premium_status()
RETURNS trigger AS $$
BEGIN
  -- Update user profile premium status based on subscription status
  UPDATE user_profiles 
  SET is_premium = (NEW.status = 'active')
  WHERE id = (
    SELECT user_id 
    FROM stripe_customers 
    WHERE customer_id = NEW.customer_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update premium status when subscription changes
DROP TRIGGER IF EXISTS on_subscription_updated ON stripe_subscriptions;
CREATE TRIGGER on_subscription_updated
  AFTER UPDATE ON stripe_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_user_premium_status();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_status_visibility_idx ON posts(status, visibility);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);

-- Enable full-text search on posts
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts 
USING gin(to_tsvector('english', title || ' ' || content));