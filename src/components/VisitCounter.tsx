import { useVisitTracker } from '@/hooks/useVisitTracker';
import { Eye, Users } from 'lucide-react';

interface VisitCounterProps {
  pagePath?: string;
  className?: string;
}

export const VisitCounter = ({ pagePath = '/', className = '' }: VisitCounterProps) => {
  const { totalVisits, todayVisits } = useVisitTracker(pagePath);

  return (
    <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>Oggi: {todayVisits.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span>Totale: {totalVisits.toLocaleString()}</span>
      </div>
    </div>
  );
};