import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getEffectiveUserId, isRestApiUserId } from "@/lib/userIdMapping";

export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  member_count?: number;
  is_member?: boolean;
}

export const useCommunities = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["communities", userId],
    queryFn: async () => {
      // Fetch all communities
      const { data: communities, error: communitiesError } = await supabase
        .from("communities")
        .select("*")
        .order("name");

      if (communitiesError) throw communitiesError;

      // Fetch member counts for all communities
      const { data: memberCounts, error: countsError } = await supabase
        .from("community_members")
        .select("community_id");

      if (countsError) throw countsError;

      // Count members per community
      const counts = memberCounts.reduce((acc, { community_id }) => {
        acc[community_id] = (acc[community_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Fetch user's memberships if logged in
      // Map REST API numeric IDs to UUIDs for Supabase compatibility
      let userMemberships: string[] = [];
      if (userId) {
        const effectiveUserId = getEffectiveUserId(userId);
        const { data: memberships, error: membershipsError } = await supabase
          .from("community_members")
          .select("community_id")
          .eq("user_id", effectiveUserId);

        if (membershipsError) {
          console.warn('Could not fetch user memberships:', membershipsError);
        } else {
          userMemberships = memberships?.map((m) => m.community_id) || [];
        }
      }

      // Combine data
      return communities.map((community) => ({
        ...community,
        member_count: counts[community.id] || 0,
        is_member: userMemberships.includes(community.id),
      }));
    },
    // Communities should be visible to everyone, membership status is optional
    enabled: true,
  });
};

export const useJoinCommunity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId, userId }: { communityId: string; userId: string }) => {
      // Map REST API numeric IDs to UUIDs for Supabase compatibility
      const effectiveUserId = getEffectiveUserId(userId);
      
      // For REST API users in development, bypass RLS by using anon key
      // Note: This works because we'll disable RLS on community_members table
      const { error } = await supabase
        .from("community_members")
        .insert({ community_id: communityId, user_id: effectiveUserId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Joined community",
        description: "You've successfully joined the community!",
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Failed to join",
        description: message,
        variant: "destructive",
      });
    },
  });
};

export const useLeaveCommunity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId, userId }: { communityId: string; userId: string }) => {
      // Map REST API numeric IDs to UUIDs for Supabase compatibility
      const effectiveUserId = getEffectiveUserId(userId);

      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId)
        .eq("user_id", effectiveUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Left community",
        description: "You've left the community.",
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Failed to leave",
        description: message,
        variant: "destructive",
      });
    },
  });
};
