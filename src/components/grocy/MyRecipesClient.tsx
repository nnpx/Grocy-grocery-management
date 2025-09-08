'use client';

import { useState } from 'react';
import type { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Star, BookOpen } from 'lucide-react';
import { StatCard } from '@/components/grocy/StatCard';
import { MyRecipeCard } from './MyRecipeCard';
import { AddEditRecipeDialog } from './AddEditRecipeDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MyRecipesClientProps {
  recipes: Recipe[];
}

const recipeCategories = ['Vegan', 'Halal', 'Dessert', 'Quick & Easy', 'Gluten-Free'];
const recipeCountries = ['American', 'Italian', 'International', 'French', 'Indian'];

export function MyRecipesClient({ recipes: initialRecipes }: MyRecipesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isModalOpen, setModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const totalRecipes = recipes.length;
  const totalFavorites = recipes.reduce((acc, recipe) => acc + recipe.totalFavorites, 0);

  const handleAddRecipe = (newRecipe: Omit<Recipe, 'id' | 'isFavorite' | 'totalFavorites' | 'isOwner'>) => {
    const newId = Math.max(...recipes.map(r => r.id), 0) + 1;
    const recipeToAdd: Recipe = {
      ...newRecipe,
      id: newId,
      isFavorite: false,
      totalFavorites: 0,
      isOwner: true,
    };
    setRecipes([...recipes, recipeToAdd]);
  };

  const handleEditRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(recipe => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)));
  };

  const handleDeleteRecipe = () => {
    if (recipeToDelete) {
      setRecipes(recipes.filter(recipe => recipe.id !== recipeToDelete.id));
      setRecipeToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const openModalForEdit = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setModalOpen(true);
  };

  const openModalForAdd = () => {
    setRecipeToEdit(null);
    setModalOpen(true);
  };
  
  const openDeleteConfirm = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setDeleteConfirmOpen(true);
  };
  
  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold font-headline">My Recipes</h1>
            <Button onClick={openModalForAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Recipe
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
                title="Total Recipes Created"
                value={totalRecipes.toString()}
                icon={<BookOpen className="h-6 w-6 text-primary" />}
            />
            <StatCard
                title="Total Favorites Received"
                value={totalFavorites.toString()}
                icon={<Star className="h-6 w-6 text-accent" />}
            />
        </div>
        
        {recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map(recipe => (
                <MyRecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onEdit={() => openModalForEdit(recipe)}
                    onDelete={() => openDeleteConfirm(recipe)}
                />
            ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-muted/50">
                <p className="text-lg font-medium text-foreground">You haven't created any recipes yet.</p>
                <p className="text-sm text-muted-foreground mb-4">Click "Add Recipe" to get started!</p>
                <Button onClick={openModalForAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Recipe
                </Button>
            </div>
        )}

      <AddEditRecipeDialog
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={recipeToEdit ? handleEditRecipe : handleAddRecipe}
        recipe={recipeToEdit}
        categories={recipeCategories}
        countries={recipeCountries}
      />

       <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your recipe
                "{recipeToDelete?.title}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecipe} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </div>
  );
}
