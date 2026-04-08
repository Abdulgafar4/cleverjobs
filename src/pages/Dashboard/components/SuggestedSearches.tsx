import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuggestedSearchesProps {
  searches: string[];
  onSearchClick: (query: string) => void;
}

export function SuggestedSearches({ searches, onSearchClick }: SuggestedSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Suggested Searches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {searches.map((search, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-sm font-normal"
            onClick={() => onSearchClick(search)}
          >
            <Search className="mr-2 h-4 w-4" />
            {search}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

