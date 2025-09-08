'use client';

import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChefHat, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FavoriteButton } from './FavoriteButton';
import { Separator } from '@/components/ui/separator';

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export function RecipeDetailClient({ recipe }: RecipeDetailClientProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/recipes">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Recipes</span>
          </Link>
        </Button>
        <div className="text-center flex-1">
             <h1 className="text-2xl md:text-3xl font-bold font-headline">{recipe.title}</h1>
        </div>
        <div className="flex items-center gap-2">
            <FavoriteButton recipe={recipe} />
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl shadow-lg">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="food recipe details"
          />
           <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge className="text-sm py-1 px-3 bg-background/80 text-foreground backdrop-blur-sm">{recipe.category}</Badge>
                <Badge className="text-sm py-1 px-3 bg-background/80 text-foreground backdrop-blur-sm flex items-center gap-1">
                    <Globe className="w-4 h-4" /> {recipe.country}
                </Badge>
            </div>
        </div>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <ChefHat className="w-5 h-5 text-primary" />
                <span>Created by <span className="font-semibold text-foreground">Grocy Community</span></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span>Cook time: <span className="font-semibold text-foreground">45 minutes</span></span>
            </div>
             <Separator />
            <p className="text-muted-foreground leading-relaxed">
              {recipe.description || `A delicious and easy-to-make ${recipe.title} recipe that is perfect for any occasion. This ${recipe.category} dish from ${recipe.country} will surely impress your friends and family.`}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
           <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox id={`ingredient-${index}`} />
                  <label htmlFor={`ingredient-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {ingredient}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
            <ol className="space-y-6 list-decimal list-inside">
                {(recipe.instructions && recipe.instructions.length > 0) ? recipe.instructions.map((step, index) => (
                    <li key={index}>
                        <p className="text-muted-foreground pl-2">
                            {step}
                        </p>
                    </li>
                )) : (
                <>
                  <li>
                      <h4 className="font-semibold mb-2">Preparation</h4>
                      <p className="text-muted-foreground pl-2">
                          Gather all your ingredients. Wash and chop the vegetables as needed. Preheat your oven to 375°F (190°C).
                      </p>
                  </li>
                  <li>
                      <h4 className="font-semibold mb-2">Cooking</h4>
                      <p className="text-muted-foreground pl-2">
                          In a large skillet, heat olive oil over medium-high heat. Add the main protein and cook until browned. Add the vegetables and cook until tender.
                      </p>
                  </li>
                  <li>
                      <h4 className="font-semibold mb-2">Combine</h4>
                      <p className="text-muted-foreground pl-2">
                          Stir in the spices and sauces. Bring to a simmer and let it cook for 10-15 minutes to allow the flavors to meld together.
                      </p>
                  </li>
                  <li>
                      <h4 className="font-semibold mb-2">Serve</h4>
                      <p className="text-muted-foreground pl-2">
                          Serve hot with your favorite side dish, such as rice or a fresh salad. Garnish with fresh herbs before serving. Enjoy your delicious homemade meal!
                      </p>
                  </li>
                </>
                )}
            </ol>
        </CardContent>
      </Card>

    </div>
  );
}
