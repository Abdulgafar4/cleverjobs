import { cn } from '@/lib/utils';

interface StatRowProps {
  label: string;
  value: string | number;
  change?: number;
}

export const StatRow = ({ label, value, change }: StatRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {change !== undefined && (
          <span className={cn(
            "text-xs",
            change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-muted-foreground"
          )}>
            {change > 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
};


