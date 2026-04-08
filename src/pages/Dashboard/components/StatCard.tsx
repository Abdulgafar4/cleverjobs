import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
  onClick?: () => void;
}

export const StatCard = ({ title, value, change, icon, description, color, onClick }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400',
    green: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-600 dark:text-green-400',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <Card 
      className={cn(
        "border bg-gradient-to-br cursor-pointer hover:shadow-lg transition-all duration-300",
        colorClasses[color],
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={cn("p-2 rounded-lg bg-current/10", colorClasses[color])}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              change > 0 ? "text-green-600" : "text-red-600"
            )}>
              {change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};


