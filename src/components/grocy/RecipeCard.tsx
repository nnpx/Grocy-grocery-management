'use client';

import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from './FavoriteButton';
import { Globe } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case 'Vegan': return 'bg-green-100 text-green-800 border-green-200';
            case 'Halal': return 'bg-sky-100 text-sky-800 border-sky-200';
            case 'Dessert': return 'bg-pink-100 text-pink-800 border-pink-200';
            case 'Quick & Easy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

  return (
    <Link href={`/dashboard/recipes/${recipe.id}`} className="block">
        <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full">
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
            <CardContent className="p-4 space-y-2 flex-grow flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={`w-fit ${getCategoryBadgeClass(recipe.category)}`}>{recipe.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                        <Globe className="w-4 h-4"/>
                        <span>{recipe.country}</span>
                    </div>
                </div>
                <h3 className="text-lg font-headline font-bold pt-2 flex-grow">{recipe.title}</h3>
                <p className="text-sm text-muted-foreground">
                    A delicious recipe to try out with your fresh ingredients.
                </p>
            </CardContent>
        </Card>
    </Link>
  );
}
