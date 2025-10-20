'use client';

import { useState, useMemo } from 'react';
import type { Recipe, User } from '@/lib/admin-types';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { AddEditRecipeDialog } from '@/components/grocy/AddEditRecipeDialog';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { mockRecipes } from '@/lib/mock-data';

interface RecipesManagementProps {
  initialRecipes: Recipe[];
  allUsers: User[];
}

const recipeCategories = ['Vegan', 'Halal', 'Dessert', 'Quick & Easy', 'Gluten-Free'];
const recipeCountries = ['American', 'Italian', 'International', 'French', 'Indian'];

export function RecipesManagement({ initialRecipes, allUsers }: RecipesManagementProps) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();

  const handleAddRecipe = (newRecipeData: any) => {
    const newRecipe: Recipe = {
      id: Math.max(...recipes.map(r => r.id), 0) + 1,
      name: newRecipeData.title,
      author: allUsers[0]?.name || 'Admin', // Placeholder author
      category: newRecipeData.category,
      country: newRecipeData.country,
      dateAdded: new Date().toISOString(),
      favorites: 0,
      imageUrl: newRecipeData.imageUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
      description: newRecipeData.description,
      ingredients: newRecipeData.ingredients,
    };
    setRecipes(prev => [...prev, newRecipe]);
    toast({ title: 'Success', description: 'Recipe added successfully.' });
  };

  const handleEditRecipe = (updatedRecipeData: any) => {
    const updatedRecipe: Partial<Recipe> = {
      name: updatedRecipeData.title,
      category: updatedRecipeData.category,
      country: updatedRecipeData.country,
      imageUrl: updatedRecipeData.imageUrl,
      description: updatedRecipeData.description,
      ingredients: updatedRecipeData.ingredients,
    };
    setRecipes(prev => prev.map(r => r.id === updatedRecipeData.id ? { ...r, ...updatedRecipe } : r));
    toast({ title: 'Success', description: 'Recipe updated successfully.' });
  };

  const handleDelete = () => {
    if (selectedRecipe) {
      setRecipes(prev => prev.filter(r => r.id !== selectedRecipe.id));
      toast({ title: 'Success', description: 'Recipe deleted.' });
    }
    setDeleteDialogOpen(false);
    setSelectedRecipe(null);
  };
  
  const openModal = (recipe?: Recipe) => {
    setSelectedRecipe(recipe || null);
    setModalOpen(true);
  }

  const openSheet = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSheetOpen(true);
  }

  const openDeleteDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDeleteDialogOpen(true);
  }

  const recipeToDialogFormat = (recipe: Recipe | null) => {
    if (!recipe) return null;
    const mockBase = mockRecipes[0];
    return {
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
        category: recipe.category as any,
        country: recipe.country,
        imageUrl: recipe.imageUrl,
        totalFavorites: recipe.favorites,
        isFavorite: false,
        ingredients: recipe.ingredients || [],
        instructions: ['Generated instruction'],
        isOwner: false
    }
  }


  const columns: ColumnDef<Recipe>[] = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'author', header: 'Author' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'favorites', header: 'Favorites' },
    {
      accessorKey: 'dateAdded',
      header: 'Date Added',
      cell: ({ row }) => format(new Date(row.getValue('dateAdded')), 'PPP'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => openSheet(row.original)}><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => openModal(row.original)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(row.original)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <h1 className="text-3xl font-bold font-headline">Recipes Management</h1>
         <Button onClick={() => openModal()}>Add Recipe</Button>
      </div>

      <DataTable columns={columns} data={recipes} searchKey="name" />

      <AddEditRecipeDialog
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={selectedRecipe ? handleEditRecipe : handleAddRecipe}
        recipe={recipeToDialogFormat(selectedRecipe)}
        categories={recipeCategories}
        countries={recipeCountries}
      />

       <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedRecipe?.name}</SheetTitle>
            <SheetDescription>
                By {selectedRecipe?.author}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <img src={selectedRecipe?.imageUrl} alt={selectedRecipe?.name} className="rounded-lg aspect-video object-cover" />
             <div className="flex gap-2">
                <Badge>{selectedRecipe?.category}</Badge>
                <Badge variant="secondary">{selectedRecipe?.country}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selectedRecipe?.description}</p>
            <div>
                <h4 className="font-semibold">Ingredients</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {selectedRecipe?.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the recipe "{selectedRecipe?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
