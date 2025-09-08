'use client';

import { useState } from 'react';
import type { Recipe } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import { Label } from '../ui/label';

interface CommunityRecipesClientProps {
  recipes: Recipe[];
}

const recipeCategories = ['All', 'Vegan', 'Halal', 'Dessert', 'Quick & Easy'];
const recipeCountries = ['All', 'American', 'Italian', 'International', 'French'];

export function CommunityRecipesClient({ recipes: initialRecipes }: CommunityRecipesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [country, setCountry] = useState('All');
  const [sort, setSort] = useState('newest');

  const filteredRecipes = recipes
    .filter(recipe => {
      const searchTerm = search.toLowerCase();
      const nameMatch = recipe.title.toLowerCase().includes(searchTerm);
      const ingredientMatch = recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
      const countryMatch = recipe.country.toLowerCase().includes(searchTerm);
      return nameMatch || ingredientMatch || countryMatch;
    })
    .filter(recipe => category === 'All' || recipe.category === category)
    .filter(recipe => country === 'All' || recipe.country === country);

  const sortedRecipes = filteredRecipes.sort((a, b) => {
    if (sort === 'favorites') {
      return b.totalFavorites - a.totalFavorites;
    }
    if (sort === 'oldest') {
      return a.id - b.id;
    }
    // 'newest' is default
    return b.id - a.id;
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold font-headline">Community Recipes</h1>
        <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search recipes..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {recipeCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              {recipeCountries.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="favorites">Most Favorites</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

        {sortedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <p className="text-lg font-medium text-muted-foreground">No recipes found.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
        )}
    </div>
  );
}
