'use client';

import Image from 'next/image';
import { Globe, Clock, Dot, Pencil, Trash2, Soup } from 'lucide-react';
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
}

export function ModeratorRecipeCard({
  recipe,
  onView,
  onEdit,
  onDelete,
}: ModeratorRecipeCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm bg-white text-card-foreground border flex flex-col h-full group">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 left-2 z-10">

        </div>
        <div className="aspect-[16/9] h-48 bg-muted overflow-hidden cursor-pointer" onClick={onView}>
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <Badge className="absolute top-3 left-10 bg-accent text-accent-foreground">
          {recipe.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <CardTitle className="font-headline font-bold text-lg line-clamp-2 cursor-pointer" onClick={onView}>
          {recipe.name}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            {recipe.country}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {recipe.cook_time}
          </span>
          <span className="flex items-center gap-1.5">
            <Soup className="w-4 h-4" />
            {recipe.ingredients.length} ingredients
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <p>By {recipe.author_name}</p>
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
