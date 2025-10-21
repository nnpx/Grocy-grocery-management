
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeratorRecipe } from '@/lib/moderator-types';
import { ModeratorRecipeCard } from './ModeratorRecipeCard';
import { EditRecipeModal } from './EditRecipeModal';
import { RecipeSideSheet } from './RecipeSideSheet';
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

interface ModeratorRecipesClientProps {
  recipes: ModeratorRecipe[];
}

export function ModeratorRecipesClient({ recipes: initialRecipes }: ModeratorRecipesClientProps) {
  const { toast } = useToast();

  const [recipes, setRecipes] = useState(initialRecipes);
  const [search, setSearch] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());

  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const [activeRecipe, setActiveRecipe] = useState<ModeratorRecipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.author_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [recipes, search]);
  
  const handleSelectRecipe = (recipeId: string, isSelected: boolean) => {
    setSelectedRecipes(prev => {
      const newSet = new Set(prev);
      if (isSelected) newSet.add(recipeId);
      else newSet.delete(recipeId);
      return newSet;
    });
  };

  const openSheet = (recipe: ModeratorRecipe) => {
    setActiveRecipe(recipe);
    setSheetOpen(true);
  };

  const openModal = (recipe: ModeratorRecipe) => {
    setActiveRecipe(recipe);
    setModalOpen(true);
  };

  const openDeleteDialog = (recipeId: string) => {
    setRecipeToDelete(recipeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteRecipe = () => {
    if (!recipeToDelete) return;
    setRecipes(prev => prev.filter(r => r.id !== recipeToDelete));
    setSelectedRecipes(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeToDelete!);
        return newSet;
    });
    console.log(`Deleted recipe: ${recipeToDelete}`);
    toast({ title: "Recipe Deleted", description: `Successfully removed recipe ${recipeToDelete}.`});
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const handleBulkDelete = () => {
    setRecipes(prev => prev.filter(r => !selectedRecipes.has(r.id)));
    console.log(`Bulk deleted recipes:`, Array.from(selectedRecipes));
    toast({ title: "Bulk Delete Successful", description: `Removed ${selectedRecipes.size} recipes.`});
    setSelectedRecipes(new Set());
    setBulkDeleteDialogOpen(false);
  };

  const handleSaveRecipe = (updatedRecipe: ModeratorRecipe) => {
    setRecipes(prev => prev.map(r => (r.id === updatedRecipe.id ? updatedRecipe : r)));
    console.log('Saved recipe:', updatedRecipe);
    toast({ title: 'Recipe Updated', description: `Successfully saved "${updatedRecipe.name}".`});
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold font-headline">Recipes</h1>
            <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or author..."
                    className="pl-8 w-full"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex-grow">
            </div>
            <Button 
                variant="destructive"
                size="sm"
                disabled={selectedRecipes.size === 0}
                onClick={() => setBulkDeleteDialogOpen(true)}
            >
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedRecipes.size})
            </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
            <ModeratorRecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={() => openSheet(recipe)}
                onEdit={() => openModal(recipe)}
                onDelete={() => openDeleteDialog(recipe.id)}
                isSelected={selectedRecipes.has(recipe.id)}
                onSelectChange={isSelected => handleSelectRecipe(recipe.id, isSelected)}
            />
            ))}
        </div>

      {filteredRecipes.length === 0 && (
         <div className="text-center py-20">
            <p className="text-lg font-medium text-muted-foreground">No recipes found.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
      
      {activeRecipe && (
        <>
            <RecipeSideSheet
                isOpen={isSheetOpen}
                onClose={() => setSheetOpen(false)}
                recipe={activeRecipe}
                onEdit={() => openModal(activeRecipe)}
                onDelete={() => openDeleteDialog(activeRecipe.id)}
            />
            <EditRecipeModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                recipe={activeRecipe}
                onSave={handleSaveRecipe}
            />
        </>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the recipe.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteRecipe} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the {selectedRecipes.size} selected recipe(s).
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
