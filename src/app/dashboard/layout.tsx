'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ChefHat, ShoppingBasket, Heart, BookUser, LogOut, Users, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('AUTH_TOKEN');
        if (!token) {
          toast({
            variant: 'destructive',
            title: 'Log in Required',
            description: 'Please log in to view your dashboard.',
          });

          router.push('/login');
          return;
        }

        const res = await fetch('/api/dashboard/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Could not fetch user data');
        }

        setUser({
          username: data.username,
          email: data.email
        });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch user info. Please try again later.',
        });
      }
    };

    fetchUserData();
  }, [toast]);

  const handleLogout = () => {
    sessionStorage.removeItem('AUTH_TOKEN');

    router.push('/login');
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        Loading user info...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ChefHat className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-headline font-bold text-primary">Grocy</h1>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Groceries" isActive={pathname === '/dashboard/groceries'}>
                  <Link href="/dashboard/groceries">
                    <ShoppingBasket />
                    <span>My Groceries</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Community Recipes" isActive={pathname.startsWith('/dashboard/recipes')}>
                  <Link href="/dashboard/recipes">
                    <Users />
                    <span>Community Recipes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Recipes" isActive={pathname === '/dashboard/my-recipes'}>
                  <Link href="/dashboard/my-recipes">
                    <BookUser />
                    <span>My Recipes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Favorite" isActive={pathname === '/dashboard/favorites'}>
                  <Link href="/dashboard/favorites">
                    <Heart />
                    <span>My Favorite</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Log Out" onClick={handleLogout}>
                  <Link href="/login">
                    <LogOut />
                    <span>Log Out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center gap-3 px-2 py-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.username}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4 sm:p-6 flex flex-col w-full">
          <div className="md:hidden pb-4">
            <SidebarTrigger />
          </div>
          <main className="flex-1 w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
