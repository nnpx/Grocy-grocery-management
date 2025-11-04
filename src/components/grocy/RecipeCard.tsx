'use client';

import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from './FavoriteButton';
import { Clock, Globe, Soup } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/dashboard/recipes/${recipe.id}`} className="block h-full">
      <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full bg-white">
        <div className="relative">
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
          <div className="absolute top-3 right-3">
            <FavoriteButton recipe={recipe} />
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
            {recipe.description ||
              'A delicious recipe to try out with your fresh ingredients.'}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground justify-between">
          <span>{recipe.owner}</span>
          <span>{formatDistanceToNow(new Date(recipe.createdAt || new Date()), { addSuffix: true })}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
