'use client';

import { useState } from 'react';
import type { Recipe } from '@/lib/types';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  recipe: Recipe;
}

export function FavoriteButton({ recipe }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);
  const [totalFavorites, setTotalFavorites] = useState(recipe.totalFavorites);
  const { toast } = useToast();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();      // stop Link navigation
    e.stopPropagation();     // stop card click

    const token = typeof window !== 'undefined'
      ? sessionStorage.getItem('AUTH_TOKEN')
      : null;

    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to favorite recipes.',
      });
      return;
    }

    const next = !isFavorite;

    setIsFavorite(next);
    setTotalFavorites(prev => prev + (next ? 1 : -1));

    try {
      const res = await fetch('/api/dashboard/community-recipes/favorites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe.id,
          favorite: next,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to update favorite.');
      }

      setIsFavorite(data.isFavorite);
      setTotalFavorites(data.totalFavorites);

      toast({
        title: data.isFavorite ? 'Added to favorites!' : 'Removed from favorites.',
        description: recipe.title,
      });
    } catch (error: any) {
      setIsFavorite(!next);
      setTotalFavorites(prev => prev + (next ? -1 : 1));

      toast({
        variant: 'destructive',
        title: 'Could not update favorite',
        description: error.message || 'Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-background/70 hover:bg-background h-10 w-10 backdrop-blur-sm transition-all duration-300 group active:scale-110"
        onClick={handleFavoriteClick}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all duration-300",
            isFavorite ? 'text-favorite fill-favorite' : 'text-foreground/80 fill-transparent'
          )}
        />
      </Button>
      <span className="text-sm font-medium bg-background/70 text-foreground/80 px-2 py-1 rounded-full backdrop-blur-sm">{totalFavorites}</span>
    </div>
  );
}
