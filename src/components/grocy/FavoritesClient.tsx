'use client';

import { useState } from 'react';
import type { Recipe } from '@/lib/types';
import { RecipeCard } from './RecipeCard';
import { HeartCrack } from 'lucide-react';
import { Button } from '../ui/button';

interface FavoritesClientProps {
  recipes: Recipe[];
}

export function FavoritesClient({ recipes: initialRecipes }: FavoritesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  // In a real app, this would be a server action to update the database
  const handleRemoveFavorite = (recipeId: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
  };

  return (
    <div className="space-y-6 w-full">
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-muted/50">
            <HeartCrack className="w-20 h-20 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-2">No Saved Recipes Yet</h2>
            <p className="text-muted-foreground mb-6">Explore community recipes and save your favorites!</p>
            <Button asChild>
                <a href="/dashboard/recipes">Find Recipes</a>
            </Button>
        </div>
      )}
    </div>
  );
}
