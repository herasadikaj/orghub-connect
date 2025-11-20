/**
 * User ID Mapping for Community Membership
 * 
 * Maps REST API numeric user IDs to Supabase UUIDs for development.
 * This allows users authenticated with the new REST API to join communities
 * that are stored in Supabase.
 */

// Generate a deterministic UUID v4 format from a numeric ID
export function numericIdToUUID(numericId: number | string): string {
  const id = typeof numericId === 'string' ? parseInt(numericId, 10) : numericId;
  
  // Pad to 12 digits
  const paddedId = id.toString().padStart(12, '0');
  
  // Format as UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // The '4' indicates version 4 (random UUID)
  return `00000000-0000-4000-8${paddedId.slice(0, 3)}-${paddedId.slice(3, 12)}`;
}

// Extract numeric ID from generated UUID (for reverse mapping if needed)
export function uuidToNumericId(uuid: string): number | null {
  if (!uuid.startsWith('00000000-0000-4000-8')) {
    return null; // Not a mapped UUID
  }
  
  const parts = uuid.split('-');
  if (parts.length !== 5) return null;
  
  const id3 = parts[3].slice(1); // Remove the '8' prefix
  const id4 = parts[4];
  const numericStr = id3 + id4;
  
  return parseInt(numericStr, 10);
}

// Check if a user ID is from the REST API (numeric)
export function isRestApiUserId(userId: string): boolean {
  return userId.length < 30 && /^\d+$/.test(userId);
}

// Check if a user ID is a Supabase UUID
export function isSupabaseUserId(userId: string): boolean {
  return userId.length === 36 && userId.includes('-');
}

// Get the effective user ID for Supabase operations
export function getEffectiveUserId(userId: string): string {
  if (isRestApiUserId(userId)) {
    return numericIdToUUID(userId);
  }
  return userId;
}
