'use client';

import Image from 'next/image';
import { Globe, Clock, Dot, Pencil, Trash2 } from 'lucide-react';
import type { ModeratorRecipe } from '@/lib/moderator-types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ModeratorRecipeCardProps {
  recipe: ModeratorRecipe;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
}

export function ModeratorRecipeCard({
  recipe,
  onView,
  onEdit,
  onDelete,
  isSelected,
  onSelectChange,
}: ModeratorRecipeCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm bg-card text-card-foreground border flex flex-col h-full group">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 left-2 z-10">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelectChange}
            aria-label={`Select recipe ${recipe.name}`}
            className="bg-background/80 border-background/90"
          />
        </div>
        <div className="aspect-[4/3] bg-muted overflow-hidden cursor-pointer" onClick={onView}>
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-semibold line-clamp-2 text-base mb-2 cursor-pointer" onClick={onView}>
          {recipe.name}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
            <Badge variant="secondary">{recipe.category}</Badge>
            <Badge variant="secondary">{recipe.country}</Badge>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.cook_time}m</span>
            <span>{recipe.ingredients.length} ingredients</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.instructions}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{recipe.author_name}</p>
          <p>{formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })}</p>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onEdit}><Pencil className="w-4 h-4" /></Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
