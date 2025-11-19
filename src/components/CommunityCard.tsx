import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  memberCount: number;
  color: string;
}

interface CommunityCardProps {
  community: Community;
}

export const CommunityCard = ({ community }: CommunityCardProps) => {
  const Icon = community.icon;

  return (
    <Card className="overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${community.color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="secondary" className="bg-muted">
            <Users className="h-3 w-3 mr-1" />
            {community.memberCount}
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{community.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{community.description}</p>
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Join Community
        </Button>
      </div>
    </Card>
  );
};
