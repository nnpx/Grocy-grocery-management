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
import { useToast } from '@/hooks/use-toast';

interface MyRecipesClientProps {
  recipes: Recipe[];
  categories: string[];
  countries: string[];
}

export function MyRecipesClient({ recipes: initialRecipes, categories, countries }: MyRecipesClientProps) {
  const { toast } = useToast();

  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const recipeCategories = [...categories];
  const recipeCountries = [...countries];

  const totalRecipes = recipes.length;
  const totalFavorites = recipes.reduce((acc, recipe) => acc + recipe.totalFavorites, 0);

  const handleAddRecipe = async (newRecipe: Omit<Recipe, 'id' | 'totalFavorites' | 'isFavorite' | 'owner' | 'createdAt'>) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('AUTH_TOKEN') : null;
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Log in Required',
        description: 'Please log in before adding a recipe.',
      });
      return;
    }

    try {
      const res = await fetch('/api/dashboard/my-recipes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newRecipe.title,
          description: newRecipe.description,
          category: newRecipe.category,
          country: newRecipe.country,
          imageUrl: newRecipe.imageUrl,
          cookTime: newRecipe.cookTime,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions || [],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        toast({
          variant: 'destructive',
          title: 'Error Creating Recipe',
          description: data.error || 'Could not create recipe.',
        });
        return;
      }

      const recipeToAdd: Recipe = {
        ...newRecipe,
        id: data.recipe_id,
        totalFavorites: 0,
        isFavorite: false,
        owner: 'You',
        createdAt: new Date().toISOString(),
      };

      setRecipes(prev => [...prev, recipeToAdd]);

      toast({
        title: 'Recipe Added',
        description: `"${newRecipe.title}" has been created successfully!`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Could not connect to the server.',
      });
    }
  };

  const handleEditRecipe = async (updatedRecipe: Recipe) => {
    const token = typeof window !== 'undefined'
      ? sessionStorage.getItem('AUTH_TOKEN')
      : null;

    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'Please log in again to edit your recipe.',
      });
      return;
    }

    try {
      const res = await fetch('/api/dashboard/my-recipes', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatedRecipe.id,
          title: updatedRecipe.title,
          description: updatedRecipe.description,
          category: updatedRecipe.category,
          country: updatedRecipe.country,
          imageUrl: updatedRecipe.imageUrl,
          cookTime: updatedRecipe.cookTime,
          ingredients: updatedRecipe.ingredients,
          instructions: updatedRecipe.instructions || [],
        }),
      });

      const data = await res.json();

      console.log('Update recipe response:', data);

      if (!res.ok || !data.ok) {
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: data.error || 'Could not update your recipe.',
        });
        return;
      }

      // Update local UI with latest values from dialog
      setRecipes(prev =>
        prev.map(r =>
          r.id === updatedRecipe.id
            ? { ...r, ...updatedRecipe }
            : r
        )
      );

      toast({
        title: 'Recipe updated',
        description: `"${updatedRecipe.title}" has been saved successfully.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Could not connect to the server.',
      });
    }
  };

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('AUTH_TOKEN') : null;

    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Log in Required',
        description: 'You need to be logged in to delete a recipe.',
      });
      return;
    }

    try {
      const res = await fetch('/api/dashboard/my-recipes', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: recipeToDelete.id }),
      });

      const data = await res.json();
      console.log('Delete recipe response:', data);

      if (!res.ok || !data.ok) {
        toast({
          variant: 'destructive',
          title: 'Error Deleting Recipe',
          description: data.error || 'Could not delete the recipe.',
        });
        return;
      }

      // If successful, remove recipe from the UI
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeToDelete.id));
      toast({
        title: 'Recipe Deleted',
        description: `"${recipeToDelete.title}" has been deleted successfully.`,
      });

      setDeleteConfirmOpen(false);
      setRecipeToDelete(null);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Could not connect to the server.',
      });
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
