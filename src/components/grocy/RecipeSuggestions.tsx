'use client';

import type { Recipe } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RecipeCard } from './RecipeCard';

interface RecipeSuggestionsProps {
  recipes: Recipe[];
}

export function RecipeSuggestions({ recipes }: RecipeSuggestionsProps) {
  return (
    <div>
      <h2 className="text-2xl font-headline font-bold mb-4">Recipe Suggestions</h2>
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">No recipe suggestions based on your current groceries. Add more items!</p>
      ) : (
        <Carousel
          opts={{
            align: 'start',
            loop: recipes.length > 2,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <RecipeCard recipe={recipe} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      )}
    </div>
  );
}
