'use client';

import { useState, useMemo } from 'react';
import type { User } from '@/lib/admin-types';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UsersManagementProps {
  initialUsers: User[];
}

export function UsersManagement({ initialUsers }: UsersManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { toast } = useToast();

  const handleSave = () => {
    if (selectedUser && editedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editedUser } : u));
      toast({ title: 'Success', description: 'User updated successfully.' });
    }
    setModalOpen(false);
    setSelectedUser(null);
    setEditedUser({});
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast({ title: 'Success', description: 'User deleted.' });
    }
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  
  const openModal = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ name: user.name, role: user.role, status: user.status });
    setModalOpen(true);
  }

  const openSheet = (user: User) => {
    setSelectedUser(user);
    setSheetOpen(true);
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }

  const columns: ColumnDef<User>[] = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as User['role'];
        const roleColors: Record<User['role'], string> = {
            Admin: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Developer: 'bg-blue-100 text-blue-800 border-blue-200',
            User: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return <Badge variant="outline" className={cn("font-semibold", roleColors[role])}>{role}</Badge>
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.getValue('status') === 'Active' ? 'default' : 'outline'}>{row.getValue('status')}</Badge>
    },
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
      <h1 className="text-3xl font-bold font-headline">Users Management</h1>
      <DataTable columns={columns} data={users} searchKey="name" />

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editedUser.name || ''} onChange={e => setEditedUser(u => ({ ...u, name: e.target.value }))} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editedUser.role || ''} onValueChange={value => setEditedUser(u => ({ ...u, role: value as User['role'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
               <Select value={editedUser.status || ''} onValueChange={value => setEditedUser(u => ({ ...u, status: value as User['status'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedUser?.name}</SheetTitle>
            <SheetDescription>
                {selectedUser?.email}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-2">
            <p><strong>Role:</strong> {selectedUser?.role}</p>
            <p><strong>Status:</strong> {selectedUser?.status}</p>
            <p><strong>Date Added:</strong> {selectedUser && format(new Date(selectedUser.dateAdded), 'PPP')}</p>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user "{selectedUser?.name}".
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
