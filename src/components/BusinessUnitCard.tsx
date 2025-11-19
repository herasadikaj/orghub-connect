import { useState } from "react";
import { Briefcase, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamCard } from "./TeamCard";

interface Person {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  people: Person[];
}

interface BusinessUnit {
  id: string;
  name: string;
  teams: Team[];
}

interface BusinessUnitCardProps {
  businessUnit: BusinessUnit;
}

export const BusinessUnitCard = ({ businessUnit }: BusinessUnitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-md bg-secondary/10">
              <Briefcase className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{businessUnit.name}</h3>
              <p className="text-sm text-muted-foreground">{businessUnit.teams.length} Teams</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-muted/20 p-4 space-y-3 animate-in slide-in-from-top-2">
          {businessUnit.teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </Card>
  );
};
