import { useState } from "react";
import { Users2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonCard } from "./PersonCard";

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

interface TeamCardProps {
  team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-card border-l-4 border-l-primary">
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-md bg-primary/10">
              <Users2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{team.name}</h4>
              <p className="text-xs text-muted-foreground">{team.people.length} Members</p>
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
        <div className="border-t bg-muted/10 p-3 space-y-2 animate-in slide-in-from-top-2">
          {team.people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </Card>
  );
};
