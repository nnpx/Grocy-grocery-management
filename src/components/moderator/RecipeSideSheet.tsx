'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, Globe, Pencil, Trash2 } from 'lucide-react';
import type { ModeratorRecipe } from '@/lib/moderator-types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface RecipeSideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: ModeratorRecipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeSideSheet({ isOpen, onClose, recipe, onEdit, onDelete }: RecipeSideSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <SheetHeader className="relative h-64">
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </SheetHeader>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
                <SheetTitle className="text-2xl font-bold font-headline">{recipe.name}</SheetTitle>
                <SheetDescription>
                    By {recipe.author_name} &bull; Added on {format(new Date(recipe.created_at), 'MMM d, yyyy')}
                </SheetDescription>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary">{recipe.category}</Badge>
                <span className="flex items-center gap-1 text-muted-foreground"><Globe className="w-4 h-4" />{recipe.country}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" />{recipe.cook_time} min</span>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
            </div>

             <div>
                <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                <ol className="space-y-4 list-decimal list-inside">
                    {recipe.instructions.map((step, i) => (
                        <li key={i} className="pl-2 text-muted-foreground">{step}</li>
                    ))}
                </ol>
            </div>
          </div>
          <SheetFooter className="p-6 pt-0 bg-background sticky bottom-0">
            <Button variant="outline" onClick={onEdit}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
            <Button variant="destructive" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
