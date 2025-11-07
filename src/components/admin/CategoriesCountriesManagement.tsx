'use client';

import { useState, useMemo } from 'react';
import type { Category, Country, Recipe } from '@/lib/admin-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './DataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoriesCountriesManagementProps {
  initialCategories: Category[];
  initialCountries: Country[];
  recipes: Recipe[];
}

type EditableItem = (Category | Country) & { type: 'category' | 'country' };

export function CategoriesCountriesManagement({ initialCategories, initialCountries, recipes }: CategoriesCountriesManagementProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [countries, setCountries] = useState(initialCountries);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<EditableItem | null>(null);
  const [itemName, setItemName] = useState('');

  const { toast } = useToast();

  const handleOpenDialog = (item?: EditableItem) => {
    if (item) {
      setCurrentItem(item);
      setItemName(item.name);
    } else {
      setCurrentItem(null);
      setItemName('');
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!itemName.trim()) {
      toast({ title: 'Error', description: 'Name cannot be empty.', variant: 'destructive' });
      return;
    }
    const type = currentItem?.type;

    if (currentItem) { // Editing
      try {
        const token = sessionStorage.getItem('AUTH_TOKEN');

        const response = await fetch('/api/admin/categories-countries', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: currentItem.type, // 'category' or 'country'
            id: currentItem.id,
            name: itemName,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast({ title: 'Error', description: result.error, variant: 'destructive' });
          return;
        }

        // Update the category or country in the state
        if (type === 'category') {
          setCategories(cats => cats.map(c => c.id === currentItem.id ? { ...c, name: itemName } : c));
        } else {
          setCountries(cts => cts.map(c => c.id === currentItem.id ? { ...c, name: itemName } : c));
        }

        toast({ title: 'Success', description: `${type} updated successfully.` });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to update item.', variant: 'destructive' });
      }

    } else { // Adding
      const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('data-tab') || 'categories';
      const apiType = activeTab === 'categories' ? 'category' : 'country';

      const response = await fetch('/api/admin/categories-countries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: apiType, name: itemName }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
        return;
      }

      // Add new category or country to the state
      if (activeTab === 'categories') {
        setCategories(cats => [...cats, { id: result.id, name: itemName, recipeCount: 0 }]);
      } else {
        setCountries(cts => [...cts, { id: result.id, name: itemName, recipeCount: 0 }]);
      }

      toast({ title: 'Success', description: `New ${activeTab.slice(0, -1)} added successfully.` });
    }

    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (item: EditableItem) => {
    setCurrentItem(item);
    setDeleteDialogOpen(true);
  }

  const handleDelete = async () => {
    if (!currentItem) return;

    try {
      const token = sessionStorage.getItem('AUTH_TOKEN');

      const response = await fetch('/api/admin/categories-countries', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: currentItem.type, // 'category' or 'country'
          id: currentItem.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
        return;
      }

      // Remove the deleted item from the state
      if (currentItem.type === 'category') {
        setCategories(cats => cats.filter(c => c.id !== currentItem.id));
      } else {
        setCountries(cts => cts.filter(c => c.id !== currentItem.id));
      }

      toast({ title: 'Success', description: `${currentItem.type} deleted successfully.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete item.', variant: 'destructive' });
    }

    setDeleteDialogOpen(false);
    setCurrentItem(null);

    // if (currentItem) {
    //   if (currentItem.type === 'category') {
    //     setCategories(cats => cats.filter(c => c.id !== currentItem.id));
    //   } else {
    //     setCountries(cts => cts.filter(c => c.id !== currentItem.id));
    //   }
    //   toast({ title: 'Success', description: `${currentItem.type} deleted.` });
    // }
    // setDeleteDialogOpen(false);
    // setCurrentItem(null);
  };

  const categoryUsage = useMemo(() => {
    const counts: { [key: string]: number } = {};
    recipes.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [recipes]);

  const countryUsage = useMemo(() => {
    const counts: { [key: string]: number } = {};
    recipes.forEach(r => {
      counts[r.country] = (counts[r.country] || 0) + 1;
    });
    return counts;
  }, [recipes]);

  const categoryData = categories;
  const countryData = countries;

  const columns: ColumnDef<Category | Country>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'recipeCount', header: 'Used By' },
    {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original as EditableItem;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleOpenDeleteDialog(item)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Categories & Countries of Recipes</h1>
      <Tabs defaultValue="categories">
        <div className="flex justify-between items-end">
          <TabsList>
            <TabsTrigger value="categories" data-tab="categories">Categories</TabsTrigger>
            <TabsTrigger value="countries" data-tab="countries">Countries</TabsTrigger>
          </TabsList>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <TabsContent value="categories">
          <DataTable columns={columns.map(c => c.id === 'actions' ? {
            ...c, cell: ({ row }) => {
              const item: EditableItem = { ...row.original as Category, type: 'category' };
              return (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleOpenDeleteDialog(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            }
          } : c)} data={categoryData} />
        </TabsContent>
        <TabsContent value="countries">
          <DataTable columns={columns.map(c => c.id === 'actions' ? {
            ...c, cell: ({ row }) => {
              const item: EditableItem = { ...row.original as Country, type: 'country' };
              return (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleOpenDeleteDialog(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            }
          } : c)} data={countryData} />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem ? `Edit ${currentItem.type}` : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {currentItem ? `Rename "${currentItem.name}"` : 'Create a new category or country.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="item-name">Name</Label>
            <Input id="item-name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item "{currentItem?.name}".
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
