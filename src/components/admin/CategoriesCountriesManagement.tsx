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

  const handleSave = () => {
    if (!itemName.trim()) {
      toast({ title: 'Error', description: 'Name cannot be empty.', variant: 'destructive' });
      return;
    }
    const type = currentItem?.type;
    
    if (currentItem) { // Editing
      if (type === 'category') {
        setCategories(cats => cats.map(c => c.id === currentItem.id ? { ...c, name: itemName } : c));
      } else {
        setCountries(cts => cts.map(c => c.id === currentItem.id ? { ...c, name: itemName } : c));
      }
      toast({ title: 'Success', description: `${type} updated successfully.` });
    } else { // Adding
      const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('data-tab') || 'categories';
      if (activeTab === 'categories') {
        const newCategory: Category = { id: Date.now(), name: itemName, recipeCount: 0, dateAdded: new Date().toISOString() };
        setCategories(cats => [...cats, newCategory]);
      } else {
        const newCountry: Country = { id: Date.now(), name: itemName, recipeCount: 0, dateAdded: new Date().toISOString() };
        setCountries(cts => [...cts, newCountry]);
      }
      toast({ title: 'Success', description: `New item added successfully.` });
    }
    setDialogOpen(false);
  };
  
  const handleOpenDeleteDialog = (item: EditableItem) => {
    setCurrentItem(item);
    setDeleteDialogOpen(true);
  }

  const handleDelete = () => {
    if (currentItem) {
      if (currentItem.type === 'category') {
        setCategories(cats => cats.filter(c => c.id !== currentItem.id));
      } else {
        setCountries(cts => cts.filter(c => c.id !== currentItem.id));
      }
      toast({ title: 'Success', description: `${currentItem.type} deleted.` });
    }
    setDeleteDialogOpen(false);
    setCurrentItem(null);
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

  const categoryData = categories.map(c => ({...c, recipeCount: categoryUsage[c.name] || 0}));
  const countryData = countries.map(c => ({...c, recipeCount: countryUsage[c.name] || 0}));

  const columns: ColumnDef<Category | Country>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'recipeCount', header: 'Used By' },
    {
      accessorKey: 'dateAdded',
      header: 'Date Added',
      cell: ({ row }) => format(new Date(row.getValue('dateAdded')), 'PPP'),
    },
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
      <h1 className="text-3xl font-bold font-headline">Categories & Countries</h1>
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
          <DataTable columns={columns.map(c => c.id === 'actions' ? {...c, cell: ({ row }) => {
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
              }} : c)} data={categoryData} />
        </TabsContent>
        <TabsContent value="countries">
          <DataTable columns={columns.map(c => c.id === 'actions' ? {...c, cell: ({ row }) => {
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
              }} : c)} data={countryData} />
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
