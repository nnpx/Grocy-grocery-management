'use client';

import { useState, useEffect } from 'react';
import type { ModeratorRecipe } from '@/lib/moderator-types';
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
import { ScrollArea } from '../ui/scroll-area';
import { PlusCircle, Trash2 } from 'lucide-react';

interface EditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: ModeratorRecipe) => void;
  recipe: ModeratorRecipe;
}

export function EditRecipeModal({ isOpen, onClose, onSave, recipe }: EditRecipeModalProps) {
  const [formData, setFormData] = useState(recipe);

  useEffect(() => {
    setFormData(recipe);
  }, [recipe]);

  const handleChange = (field: keyof Omit<ModeratorRecipe, 'ingredients' | 'instructions'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newArray = [...(formData[field] || [''])];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || ['']), ''] }));
  };

  const removeArrayField = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length <= 1) return;
    const newArray = [...(formData[field] || [''])];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
          <DialogDescription>
            Modify the details for "{recipe.name}".
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Recipe Name</Label>
              <Input id="title" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cook_time">Cook Time (x min)</Label>
              <Input id="cook_time" value={formData.cook_time} onChange={(e) => handleChange('cook_time', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={formData.image_url} onChange={(e) => handleChange('image_url', e.target.value)} />
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
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
