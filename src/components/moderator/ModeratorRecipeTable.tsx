'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ModeratorRecipe } from '@/lib/moderator-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Clock, Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface ModeratorRecipeTableProps {
  recipes: ModeratorRecipe[];
  selectedRecipes: Set<string>;
  onSelectAll: (isSelected: boolean) => void;
  onSelectRecipe: (recipeId: string, isSelected: boolean) => void;
  onView: (recipe: ModeratorRecipe) => void;
  onEdit: (recipe: ModeratorRecipe) => void;
  onDelete: (recipeId: string) => void;
}

export function ModeratorRecipeTable({
  recipes,
  selectedRecipes,
  onSelectAll,
  onSelectRecipe,
  onView,
  onEdit,
  onDelete,
}: ModeratorRecipeTableProps) {
  const isAllSelected = recipes.length > 0 && selectedRecipes.size === recipes.length;
  const isIndeterminate = selectedRecipes.size > 0 && selectedRecipes.size < recipes.length;

  return (
    <Card className="rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={checked => onSelectAll(Boolean(checked))}
                aria-label="Select all rows"
              />
            </TableHead>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Cook Time</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map(recipe => (
            <TableRow key={recipe.id} data-state={selectedRecipes.has(recipe.id) && "selected"}>
              <TableCell>
                <Checkbox
                  checked={selectedRecipes.has(recipe.id)}
                  onCheckedChange={checked => onSelectRecipe(recipe.id, Boolean(checked))}
                  aria-label={`Select recipe ${recipe.name}`}
                />
              </TableCell>
              <TableCell>
                <Image
                  src={recipe.image_url}
                  alt={recipe.name}
                  width={64}
                  height={48}
                  className="rounded-md object-cover aspect-[4/3]"
                />
              </TableCell>
              <TableCell className="font-medium">{recipe.name}</TableCell>
              <TableCell>{recipe.author_name}</TableCell>
              <TableCell><Badge variant="secondary">{recipe.category}</Badge></TableCell>
              <TableCell><Badge variant="outline">{recipe.country}</Badge></TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {recipe.cook_time}m
                </div>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })}</TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <div className="inline-flex">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onView(recipe)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(recipe)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(recipe.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
