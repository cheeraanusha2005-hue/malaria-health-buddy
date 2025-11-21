import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FAQButtonProps {
  icon: LucideIcon;
  question: string;
  onClick: () => void;
}

export const FAQButton = ({ icon: Icon, question, onClick }: FAQButtonProps) => {
  return (
    <Button
      variant="outline"
      className="justify-start text-left h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
    >
      <Icon className="h-4 w-4 mr-2 shrink-0" />
      <span className="text-sm">{question}</span>
    </Button>
  );
};
