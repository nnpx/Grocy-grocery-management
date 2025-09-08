'use client';

import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Heart, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MyRecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function MyRecipeCard({ recipe, onEdit, onDelete }: MyRecipeCardProps) {
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
    <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full">
        <Link href={`/dashboard/recipes/${recipe.id}`} className="block flex flex-col flex-grow">
            <div className="relative">
                <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    width={600}
                    height={400}
                    className="aspect-[3/2] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="food recipe"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2 text-sm font-medium bg-background/70 text-foreground/80 px-2 py-1 rounded-full backdrop-blur-sm">
                    <Heart className="w-4 h-4 text-favorite fill-favorite" />
                    <span>{recipe.totalFavorites}</span>
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
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {recipe.description || 'A delicious recipe to try out with your fresh ingredients.'}
                </p>
            </CardContent>
        </Link>
        <CardFooter className="flex justify-end gap-1 p-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onEdit}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Recipe</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete Recipe</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </CardFooter>
    </Card>
  );
}
