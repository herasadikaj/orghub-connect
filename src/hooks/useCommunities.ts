import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      let userMemberships: string[] = [];
      if (userId) {
        const { data: memberships, error: membershipsError } = await supabase
          .from("community_members")
          .select("community_id")
          .eq("user_id", userId);

        if (membershipsError) throw membershipsError;
        userMemberships = memberships.map((m) => m.community_id);
      }

      // Combine data
      return communities.map((community) => ({
        ...community,
        member_count: counts[community.id] || 0,
        is_member: userMemberships.includes(community.id),
      }));
    },
    enabled: !!userId,
  });
};

export const useJoinCommunity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId, userId }: { communityId: string; userId: string }) => {
      const { error } = await supabase
        .from("community_members")
        .insert({ community_id: communityId, user_id: userId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Joined community",
        description: "You've successfully joined the community!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to join",
        description: error.message,
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
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Left community",
        description: "You've left the community.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to leave",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
