import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  color?: "blue" | "green" | "amber";
}

export const TopicCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  color = "blue" 
}: TopicCardProps) => {
  const colorClasses = {
    blue: "hover:border-[hsl(var(--medical-blue))] hover:bg-[hsl(var(--medical-blue-light))]",
    green: "hover:border-[hsl(var(--health-green))] hover:bg-[hsl(var(--health-green-light))]",
    amber: "hover:border-[hsl(var(--warning-amber))] hover:bg-amber-50 dark:hover:bg-amber-950",
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        colorClasses[color]
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            color === "blue" && "bg-[hsl(var(--medical-blue-light))] text-[hsl(var(--medical-blue))]",
            color === "green" && "bg-[hsl(var(--health-green-light))] text-[hsl(var(--health-green))]",
            color === "amber" && "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
