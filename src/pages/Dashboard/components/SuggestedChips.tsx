import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestedChipsProps {
  suggestions: string[];
  onChipClick: (term: string) => void;
  className?: string;
}

export function SuggestedChips({ suggestions, onChipClick, className }: SuggestedChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <span className="text-sm text-muted-foreground self-center">Try:</span>
      {suggestions.map((term, index) => (
        <Badge
          key={index}
          variant="outline"
          className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors px-3 py-1.5 h-8"
          onClick={() => onChipClick(term)}
        >
          {term}
        </Badge>
      ))}
    </div>
  );
}

