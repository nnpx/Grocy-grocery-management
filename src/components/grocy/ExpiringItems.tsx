import type { GroceryItem } from '@/lib/types';
import type { getExpiryStatus } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ExpiringItem = GroceryItem & { status: ReturnType<typeof getExpiryStatus> };

interface ExpiringItemsProps {
  items: ExpiringItem[];
}

const variantToBgColor = {
  destructive: 'bg-destructive',
  accent: 'bg-accent',
  primary: 'bg-primary',
};

const variantToBorderColor = {
  destructive: 'border-destructive/50',
  accent: 'border-accent/50',
  primary: 'border-primary/50',
}

export function ExpiringItems({ items }: ExpiringItemsProps) {
  return (
    <div>
      <h2 className="text-2xl font-headline font-bold mb-4">Expiring Soon</h2>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No items expiring within the next week. Well done!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map(item => (
            <Card key={item.id} className={cn("rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border-2", variantToBorderColor[item.status.variant])}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{item.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`h-2 w-2 rounded-full ${variantToBgColor[item.status.variant]}`}></span>
                  <p className="text-sm font-medium">{item.status.text}</p>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Expires on: {format(new Date(item.expiryDate), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
