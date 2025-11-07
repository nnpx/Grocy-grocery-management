"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/types";
import { RecipeCard } from "./RecipeCard";
import { Heart, HeartCrack } from "lucide-react";
import { Button } from "../ui/button";
import { StatCard } from "./StatCard";

interface FavoritesClientProps {
  recipes: Recipe[];
}

export function FavoritesClient({
  recipes: initialRecipes,
}: FavoritesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  // 🔁 Optionally allow removing a recipe from favorites (client-side only)
  const handleToggleFavorite = (recipeId: number) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r,
      ),
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="font-headline font-bold text-3xl">My Favorites</h1>
      </div>

      {/* Stat section */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <StatCard
          title="Total Favorite Recipes"
          value={recipes.filter((r) => r.isFavorite).length.toString()}
          icon={<Heart className="w-6 h-6 text-favorite" />}
        />
      </div>

      {/* Recipes grid */}
      {recipes.length > 0 ? (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center bg-muted/50 py-20 rounded-2xl text-center">
          <HeartCrack className="mb-4 w-20 h-20 text-muted-foreground/50" />
          <h2 className="mb-2 font-headline font-bold text-2xl">
            No Saved Recipes Yet
          </h2>
          <p className="mb-6 text-muted-foreground">
            Explore community recipes and save your favorites!
          </p>
          <Button asChild>
            <a href="/dashboard/recipes">Find Recipes</a>
          </Button>
        </div>
      )}
    </div>
  );
}
