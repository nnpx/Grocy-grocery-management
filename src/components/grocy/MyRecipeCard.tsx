'use client';

import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Heart, Pencil, Trash2, Clock, Soup } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface MyRecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function MyRecipeCard({ recipe, onEdit, onDelete }: MyRecipeCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full bg-white">
      <div className="relative">
        <Link href={`/dashboard/recipes/${recipe.id}`} className="block">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={600}
            height={400}
            className="aspect-[16/9] h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint="food recipe"
          />
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            {recipe.category}
          </Badge>
        </Link>
        <div className="absolute top-3 right-3 flex items-center gap-2 text-sm font-medium bg-background/70 text-foreground/80 px-2 py-1 rounded-full backdrop-blur-sm">
          <Heart className="w-4 h-4 text-favorite fill-favorite" />
          <span>{recipe.totalFavorites}</span>
        </div>
      </div>
      <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
        <h3 className="text-lg font-headline font-bold text-foreground flex-grow">
          {recipe.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
             <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                {recipe.country}
            </span>
             <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {recipe.cookTime} min
            </span>
             <span className="flex items-center gap-1.5">
                <Soup className="w-4 h-4" />
                {recipe.ingredients.length} ingredients
            </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {recipe.description || 'A delicious recipe to try out with your fresh ingredients.'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
         <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
        </span>
        <div className="flex justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit Recipe</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Recipe</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
