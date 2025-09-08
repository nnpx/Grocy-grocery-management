'use client';

import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FavoriteButton } from './FavoriteButton';
import { Globe } from 'lucide-react';

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
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative">
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        width={600}
                        height={400}
                        className="aspect-[3/2] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint="food recipe"
                      />
                      <div className="absolute top-3 right-3">
                         <FavoriteButton recipe={recipe} />
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                         <Badge>{recipe.category}</Badge>
                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4"/>
                            <span>{recipe.country}</span>
                         </div>
                      </div>
                      <h3 className="text-lg font-headline font-bold pt-2">{recipe.title}</h3>
                    </CardContent>
                  </Card>
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
