# Supabase Configuration for Community Membership

## Problem
The `community_members` table has Row Level Security (RLS) enabled, which requires Supabase authentication. Users authenticated with the new REST API cannot join communities because they don't have Supabase auth tokens.

## Solution
Temporarily disable RLS or add a permissive policy to allow anonymous inserts/deletes for development.

## Option 1: Disable RLS (Quick Fix for Development)

Run this SQL in your Supabase SQL Editor:

```sql
-- Disable RLS on community_members table
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: This makes the table publicly writable. Only use in development!

## Option 2: Add Permissive Policy (Better for Development)

```sql
-- Enable RLS (if not already enabled)
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read community memberships
CREATE POLICY "Allow public read access"
ON community_members
FOR SELECT
TO public
USING (true);

-- Allow anyone to insert community memberships
CREATE POLICY "Allow public insert access"
ON community_members
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to delete community memberships
CREATE POLICY "Allow public delete access"
ON community_members
FOR DELETE
TO public
USING (true);
```

## Option 3: Production-Ready Policy (Recommended)

For production, you'd want to verify the user owns the membership:

```sql
-- Enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Allow users to read all memberships
CREATE POLICY "Allow read access"
ON community_members
FOR SELECT
TO public
USING (true);

-- Allow users to insert their own memberships
CREATE POLICY "Allow insert own membership"
ON community_members
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own memberships
CREATE POLICY "Allow delete own membership"
ON community_members
FOR DELETE
TO public
USING (auth.uid() = user_id);
```

## Current Implementation

The app now uses **user ID mapping** to handle REST API users:
- REST API numeric IDs (e.g., `"1"`) are converted to UUIDs (e.g., `"00000000-0000-4000-8001-000000000000"`)
- Consistent mapping ensures the same user always gets the same UUID
- This allows REST API users to join/leave communities

## Testing

After updating RLS policies, test with:

1. **Login with REST API auth** (mock or real backend)
2. **Navigate to Communities tab**
3. **Click "Join Community"** button
4. **Should see success toast** and button changes to "Leave Community"
5. **Refresh page** - membership should persist

## Rollback

To re-enable strict RLS:

```sql
-- Drop permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON community_members;
DROP POLICY IF EXISTS "Allow public insert access" ON community_members;
DROP POLICY IF EXISTS "Allow public delete access" ON community_members;

-- Re-enable strict RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
```

## Notes

- The mapping system is transparent to users
- UUID format follows v4 specification
- Numeric IDs are padded and formatted into the UUID structure
- This is a development workaround - production should use proper authentication sync
