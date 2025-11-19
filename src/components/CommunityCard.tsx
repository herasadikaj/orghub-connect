import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Camera, Dumbbell, Music, Palette, Book, Heart } from "lucide-react";
import { useJoinCommunity, useLeaveCommunity } from "@/hooks/useCommunities";

interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  member_count?: number;
  is_member?: boolean;
}

interface CommunityCardProps {
  community: Community;
  userId: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  Dumbbell,
  Music,
  Palette,
  Book,
  Heart,
};

export const CommunityCard = ({ community, userId }: CommunityCardProps) => {
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();
  
  const Icon = iconMap[community.icon] || Camera;
  const isLoading = joinMutation.isPending || leaveMutation.isPending;

  const handleToggleMembership = () => {
    if (community.is_member) {
      leaveMutation.mutate({ communityId: community.id, userId });
    } else {
      joinMutation.mutate({ communityId: community.id, userId });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${community.color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="secondary" className="bg-muted">
            <Users className="h-3 w-3 mr-1" />
            {community.member_count || 0}
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{community.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{community.description}</p>
        <Button
          variant={community.is_member ? "secondary" : "outline"}
          className={`w-full transition-colors ${
            !community.is_member && "group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
          onClick={handleToggleMembership}
          disabled={isLoading}
        >
          {isLoading ? "..." : community.is_member ? "Leave Community" : "Join Community"}
        </Button>
      </div>
    </Card>
  );
};
