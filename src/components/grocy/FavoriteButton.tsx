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

  const handleFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    setTotalFavorites(newFavoriteStatus ? totalFavorites + 1 : totalFavorites - 1);
    toast({
        title: newFavoriteStatus ? "Added to favorites!" : "Removed from favorites.",
        description: recipe.title,
    })
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
