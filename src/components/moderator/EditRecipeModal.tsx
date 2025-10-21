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

  const handleChange = (field: keyof ModeratorRecipe, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                    <Label htmlFor="cook_time">Cook Time (minutes)</Label>
                    <Input id="cook_time" type="number" value={formData.cook_time} onChange={(e) => handleChange('cook_time', parseInt(e.target.value, 10))} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={formData.image_url} onChange={(e) => handleChange('image_url', e.target.value)} />
                </div>
                <div className="grid gap-3">
                    <Label>Ingredients (comma-separated)</Label>
                    <Textarea value={formData.ingredients.join(', ')} onChange={(e) => handleChange('ingredients', e.target.value.split(',').map(s => s.trim()))} placeholder="Ingredient 1, Ingredient 2, ..." />
                </div>
                <div className="grid gap-3">
                    <Label>Instructions</Label>
                    <Textarea value={formData.instructions} onChange={(e) => handleChange('instructions', e.target.value)} placeholder="Step 1..." rows={6} />
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
