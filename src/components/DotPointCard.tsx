import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DotPointCardProps {
  text: string;
  className?: string;
}

export const DotPointCard = React.forwardRef<HTMLDivElement, DotPointCardProps>(({ text, className }, ref) => {
  return (
    <Card ref={ref} className={cn("w-full max-w-md bg-slate-800 border-slate-700 shadow-md", className)}>
      <CardContent className="p-4">
        <p className="text-lg text-slate-200">{text}</p>
      </CardContent>
    </Card>
  );
});

DotPointCard.displayName = "DotPointCard";
