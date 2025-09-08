'use client';

import type { GroceryItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getExpiryStatus } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GroceryItemCardProps {
  item: GroceryItem;
  getCategoryBadgeClass: (category: string) => string;
}

export function GroceryItemCard({ item, getCategoryBadgeClass }: GroceryItemCardProps) {
  const status = getExpiryStatus(item.expiryDate);
  const expiryBadgeClass = {
      destructive: 'bg-red-100 text-red-800',
      accent: 'bg-orange-100 text-orange-800',
      primary: 'bg-green-100 text-green-800',
  }[status.variant];

  return (
    <Card className="rounded-2xl flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <Badge variant="outline" className={`w-fit ${getCategoryBadgeClass(item.category)}`}>{item.category}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
        <Badge className={`mt-2 ${expiryBadgeClass}`}>
          {format(new Date(item.expiryDate), 'MMM d, yyyy')} ({status.text})
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Item</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Item</TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
