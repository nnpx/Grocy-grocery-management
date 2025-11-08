'use client';

import { useState, useEffect } from 'react';
import type { Recipe } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface AddEditRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: any) => void;
  recipe: Recipe | null;
  categories: string[];
  countries: string[];
}

type FormData = Omit<Recipe, 'id' | 'totalFavorites' | 'isFavorite' | 'owner' | 'createdAt'>;

const emptyForm: FormData = {
  title: '',
  description: '',
  category: 'Quick & Easy',
  country: 'International',
  imageUrl: '',
  ingredients: [''],
  instructions: [''],
  cookTime: ''
};

export function AddEditRecipeDialog({ isOpen, onClose, onSave, recipe, categories, countries }: AddEditRecipeDialogProps) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const isEditing = !!recipe;

  useEffect(() => {
    if (isEditing && recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        category: recipe.category,
        country: recipe.country,
        imageUrl: recipe.imageUrl,
        cookTime: recipe.cookTime,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
        instructions: recipe.instructions && recipe.instructions.length > 0 ? recipe.instructions : [''],
      });
    } else {
      setFormData(emptyForm);
    }
  }, [recipe, isEditing, isOpen]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newArray = [...(formData[field] || [''])];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const addArrayField = (field: 'ingredients' | 'instructions') => {
    handleChange(field, [...(formData[field] || ['']), '']);
  };

  const removeArrayField = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length <= 1) return;
    const newArray = [...(formData[field] || [''])];
    newArray.splice(index, 1);
    handleChange(field, newArray);
  };

  const handleSave = () => {
    if (isEditing && recipe) {
      onSave({ ...recipe, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Updating "${recipe?.title}"` : 'Share your culinary creation with the community.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Recipe Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="A short and enticing description of your recipe." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country / Origin</Label>
                <Select value={formData.country} onValueChange={(val) => handleChange('country', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" placeholder="https://picsum.photos/600/400" value={formData.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Cook Time (x min)</Label>
              <Input id="imageUrl" placeholder="x min" value={formData.cookTime} onChange={(e) => handleChange('cookTime', e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label>Ingredients</Label>
              {formData.ingredients.map((ing, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={ing} onChange={(e) => handleArrayChange('ingredients', index, e.target.value)} placeholder={`Ingredient ${index + 1}`} />
                  <Button variant="ghost" size="icon" onClick={() => removeArrayField('ingredients', index)} disabled={formData.ingredients.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayField('ingredients')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
              </Button>
            </div>
            <div className="grid gap-3">
              <Label>Instructions</Label>
              {formData.instructions?.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="font-bold pt-2">{index + 1}.</span>
                  <Textarea value={step} onChange={(e) => handleArrayChange('instructions', index, e.target.value)} placeholder={`Step ${index + 1}`} />
                  <Button variant="ghost" size="icon" onClick={() => removeArrayField('instructions', index)} disabled={formData.instructions && formData.instructions.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayField('instructions')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Step
              </Button>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Create Recipe'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
