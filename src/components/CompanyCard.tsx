import { useState } from "react";
import { Building2, ChevronDown, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessUnitCard } from "./BusinessUnitCard";

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

interface Company {
  id: string;
  name: string;
  description: string;
  businessUnits: BusinessUnit[];
}

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-[var(--shadow-medium)]">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{company.name}</h2>
              <p className="text-muted-foreground mb-3">{company.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{company.businessUnits.length} Business Units</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-muted/30 p-6 space-y-4 animate-in slide-in-from-top-2">
          {company.businessUnits.map((bu) => (
            <BusinessUnitCard key={bu.id} businessUnit={bu} />
          ))}
        </div>
      )}
    </Card>
  );
};
