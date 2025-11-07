"use client";

import type { Recipe } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "./FavoriteButton";
import { Clock, Globe, Soup } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: () => void; // ✅ add this optional prop
}

export function RecipeCard({ recipe, onToggleFavorite }: RecipeCardProps) {
  // ✅ include in destructure
  return (
    <Link href={`/dashboard/recipes/${recipe.id}`} className="block h-full">
      <Card className="group flex flex-col bg-white shadow-sm hover:shadow-lg rounded-2xl h-full overflow-hidden transition-shadow duration-300">
        <div className="relative">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
            data-ai-hint="food recipe"
          />
          <Badge className="top-3 left-3 absolute bg-accent text-accent-foreground">
            {recipe.category}
          </Badge>

          {/* ✅ make heart button clickable if onToggleFavorite is passed */}
          <div
            className="top-3 right-3 absolute"
            onClick={(e) => {
              if (!onToggleFavorite) return;
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <FavoriteButton recipe={recipe} />
          </div>
        </div>

        <CardContent className="flex flex-col flex-grow space-y-3 p-4">
          <h3 className="flex-grow font-headline font-bold text-foreground text-lg">
            {recipe.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              {recipe.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {recipe.cookTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Soup className="w-4 h-4" />
              {recipe.ingredients.length} ingredients
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {recipe.description ||
              "A delicious recipe to try out with your fresh ingredients."}
          </p>
        </CardContent>

        <CardFooter className="justify-between p-4 pt-0 text-muted-foreground text-xs">
          <span>{recipe.owner}</span>
          <span>
            {formatDistanceToNow(new Date(recipe.createdAt || new Date()), {
              addSuffix: true,
            })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
