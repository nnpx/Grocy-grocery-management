"use client";

import { useState } from "react";
import type { GroceryItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  Trash2,
  Pencil,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { AddItemDialog } from "./AddItemDialog";
import { EditItemDialog } from "./EditItemDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { GroceryItemCard } from "./GroceryItemCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { getExpiryStatus } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Label } from "../ui/label";

interface GroceryItemsClientProps {
  items: GroceryItem[];
  categories: string[]; // from API
}

const itemCategories = ["All", "Produce", "Meat", "Dairy", "Bakery", "Snacks"];

export function GroceryItemsClient({
  items: initialItems,
  categories,
}: GroceryItemsClientProps) {
  const [items, setItems] = useState<GroceryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("expiryDate");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<GroceryItem | null>(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GroceryItem | null>(null);
  const isMobile = useIsMobile();

  const allCategories = ["All", ...categories]; // uses API data

  // Add this helper above handleAddItem
  async function apiAddItem(newItem: Omit<GroceryItem, "id">) {
    const token = sessionStorage.getItem("AUTH_TOKEN");
    console.log("🟦 Sending Add Item request:", newItem);

    const res = await fetch("/api/dashboard/groceries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newItem),
    });

    const data = await res.json();
    console.log("🟩 API response from /api/dashboard/groceries:", data);

    if (!res.ok) throw new Error(data?.error || "Failed to add item");
    return data.item as GroceryItem;
  }

  async function apiEditItem(updatedItem: GroceryItem) {
    const token = sessionStorage.getItem("AUTH_TOKEN");
    console.log("🟦 Sending Edit Item request:", updatedItem);

    const res = await fetch("/api/dashboard/groceries", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedItem),
    });

    const data = await res.json();
    console.log("🟩 API response (EDIT):", data);

    if (!res.ok) throw new Error(data?.error || "Failed to update item");
    return data.item as GroceryItem;
  }

  async function apiDeleteItem(id: number) {
    const token = sessionStorage.getItem("AUTH_TOKEN");
    console.log("🟦 Sending DELETE request for item:", id);

    const res = await fetch("/api/dashboard/groceries", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    console.log("🟩 API response (DELETE):", data);

    if (!res.ok) throw new Error(data?.error || "Failed to delete item");
    return data.message;
  }

  // Then replace your old handleAddItem with this:
  const handleAddItem = async (newItem: Omit<GroceryItem, "id">) => {
    try {
      const created = await apiAddItem(newItem);
      console.log("✅ Added new item successfully:", created);
      setItems((prev) => [...prev, created]);
      setAddModalOpen(false);
    } catch (e: any) {
      console.error("❌ Add item failed:", e.message);
    }
  };

  const handleEditItem = async (updatedItem: GroceryItem) => {
    try {
      const edited = await apiEditItem(updatedItem);
      setItems((prev) => prev.map((i) => (i.id === edited.id ? edited : i)));
      setEditModalOpen(false);
      console.log("✅ Item updated successfully:", edited);
    } catch (e: any) {
      console.error("❌ Edit failed:", e.message);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      // Call the DELETE API
      const message = await apiDeleteItem(itemToDelete.id);
      console.log("✅ Deleted item:", message);

      // Update state to remove the deleted item from the UI
      setItems(items.filter((item) => item.id !== itemToDelete.id));
      setItemToDelete(null);
      setDeleteConfirmOpen(false);
    } catch (e: any) {
      console.error("❌ Delete failed:", e.message);
      // Optionally, show an error message to the user via toast
    }
  };

  const openEditModal = (item: GroceryItem) => {
    setItemToEdit(item);
    setEditModalOpen(true);
  };

  const openDeleteConfirm = (item: GroceryItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => category === "All" || item.category === category);

  const sortedItems = filteredItems.sort((a, b) => {
    if (sort === "expiryDate") {
      return (
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
    }
    if (sort === "category") {
      return a.category.localeCompare(b.category);
    }
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Produce":
        return "bg-green-100 text-green-800 border-green-200";
      case "Meat":
        return "bg-red-100 text-red-800 border-red-200";
      case "Dairy":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Bakery":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
        <h1 className="font-headline font-bold text-3xl">My Grocery Items</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8 w-full sm:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <PlusCircle className="mr-2 w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      <div className="flex md:flex-row flex-col md:items-end gap-4">
        <div className="gap-2 grid">
          <Label>Filter by</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="gap-2 grid">
          <Label>Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiryDate">Expiry Date</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isMobile ? (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          {sortedItems.map((item) => (
            <GroceryItemCard
              key={item.id}
              item={item}
              getCategoryBadgeClass={getCategoryBadgeClass}
              onEdit={() => openEditModal(item)}
              onDelete={() => openDeleteConfirm(item)}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => {
                const status = getExpiryStatus(item.expiryDate);
                const expiryBadgeClass = {
                  destructive: "bg-red-100 text-red-800",
                  accent: "bg-orange-100 text-orange-800",
                  primary: "bg-green-100 text-green-800",
                }[status.variant];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getCategoryBadgeClass(item.category)}
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge className={expiryBadgeClass}>
                        {format(new Date(item.expiryDate), "MMM d, yyyy")} (
                        {status.text})
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(item)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Item</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => openDeleteConfirm(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Item</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <AddItemDialog
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddItem={handleAddItem}
        categories={categories}
      />

      {itemToEdit && (
        <EditItemDialog
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setItemToEdit(null);
          }}
          onEditItem={handleEditItem}
          item={itemToEdit}
          categories={categories}
        />
      )}

      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              grocery item "{itemToDelete?.name}" from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
