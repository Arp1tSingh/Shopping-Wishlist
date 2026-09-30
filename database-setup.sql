-- Create the items table
CREATE TABLE items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    price numeric,
    category text,
    priority text,
    link text,
    image_url text,
    notes text,
    purchased boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own items
CREATE POLICY "Users can view their own items" ON items
    FOR SELECT USING (auth.uid() = user_id);

-- Allow public to view shared items (read-only)
CREATE POLICY "Anyone can view items" ON items
    FOR SELECT USING (true);

-- Allow users to insert their own items
CREATE POLICY "Users can insert their own items" ON items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own items
CREATE POLICY "Users can update their own items" ON items
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own items
CREATE POLICY "Users can delete their own items" ON items
    FOR DELETE USING (auth.uid() = user_id);
