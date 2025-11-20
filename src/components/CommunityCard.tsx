import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Camera, Dumbbell, Music, Palette, Book, Heart, Check, UserPlus, Sparkles } from "lucide-react";
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

// Color mapping with actual gradient styles
const colorStyles: Record<string, { gradient: string; shadow: string; accent: string }> = {
  'from-purple-500 to-pink-500': {
    gradient: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
    shadow: 'rgba(168, 85, 247, 0.3)',
    accent: 'rgba(168, 85, 247, 0.1)',
  },
  'from-blue-500 to-cyan-500': {
    gradient: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)',
    shadow: 'rgba(59, 130, 246, 0.3)',
    accent: 'rgba(59, 130, 246, 0.1)',
  },
  'from-green-500 to-emerald-500': {
    gradient: 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(16, 185, 129) 100%)',
    shadow: 'rgba(34, 197, 94, 0.3)',
    accent: 'rgba(34, 197, 94, 0.1)',
  },
  'from-orange-500 to-red-500': {
    gradient: 'linear-gradient(135deg, rgb(249, 115, 22) 0%, rgb(239, 68, 68) 100%)',
    shadow: 'rgba(249, 115, 22, 0.3)',
    accent: 'rgba(249, 115, 22, 0.1)',
  },
  'from-yellow-500 to-orange-500': {
    gradient: 'linear-gradient(135deg, rgb(234, 179, 8) 0%, rgb(249, 115, 22) 100%)',
    shadow: 'rgba(234, 179, 8, 0.3)',
    accent: 'rgba(234, 179, 8, 0.1)',
  },
  'from-indigo-500 to-purple-500': {
    gradient: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(168, 85, 247) 100%)',
    shadow: 'rgba(99, 102, 241, 0.3)',
    accent: 'rgba(99, 102, 241, 0.1)',
  },
};

export const CommunityCard = ({ community, userId }: CommunityCardProps) => {
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();

  const Icon = iconMap[community.icon] || Camera;
  const isLoading = joinMutation.isPending || leaveMutation.isPending;
  const colors = colorStyles[community.color] || colorStyles['from-purple-500 to-pink-500'];

  // Allow community joins for all authenticated users
  // REST API numeric IDs will be mapped to UUIDs automatically
  const canJoinCommunity = Boolean(userId);

  const handleToggleMembership = () => {
    if (!canJoinCommunity) {
      return; // Button will be disabled
    }
    if (community.is_member) {
      leaveMutation.mutate({ communityId: community.id, userId });
    } else {
      joinMutation.mutate({ communityId: community.id, userId });
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group relative ${community.is_member ? 'ring-2 ring-primary/20' : ''
      }`}>
      {/* Membership indicator */}
      {community.is_member && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-primary-foreground shadow-md">
            <Check className="h-3 w-3 mr-1" />
            Member
          </Badge>
        </div>
      )}

      {/* Decorative corner accent */}
      <div
        className="absolute top-0 left-0 w-24 h-24 rounded-br-full"
        style={{ background: colors.accent }}
      />

      <div className="p-6 relative">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
            style={{ background: colors.gradient }}
          >
            <Icon className="h-7 w-7 text-white relative z-10" />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-muted w-fit">
              <Users className="h-3 w-3 mr-1" />
              {community.member_count || 0} {(community.member_count || 0) === 1 ? 'member' : 'members'}
            </Badge>
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {community.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {community.description}
        </p>

        <Button
          variant={community.is_member ? "secondary" : "default"}
          className={`w-full transition-all duration-300 ${community.is_member
            ? 'bg-secondary hover:bg-destructive/10 hover:text-destructive'
            : 'group-hover:shadow-md'
            }`}
          onClick={handleToggleMembership}
          disabled={isLoading || !canJoinCommunity}
        >
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : community.is_member ? (
            "Leave Community"
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Join Community
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
