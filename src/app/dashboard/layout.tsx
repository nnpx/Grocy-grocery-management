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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChefHat, ShoppingBasket, Heart, BookUser, Settings, LogOut, Users, Home } from 'lucide-react';

const pathToTitle: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/groceries': 'My Groceries',
    '/dashboard/recipes': 'Community Recipes',
    '/dashboard/my-recipes': 'My Recipes',
    '/dashboard/favorites': '',
    '/dashboard/settings': 'Settings',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const userName = "Casey";
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard/recipes/')) return 'Recipe Details';
    return pathToTitle[pathname] || 'Grocy';
  };
  
  const pageTitle = getPageTitle();

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
                <SidebarMenuButton asChild tooltip="My Favorites" isActive={pathname === '/dashboard/favorites'}>
                  <Link href="/dashboard/favorites">
                    <Heart />
                    <span>My Favorites</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Log Out">
                  <Link href="/">
                    <LogOut />
                    <span>Log Out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center gap-3 px-2 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${userName}`} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{userName}</span>
                <span className="text-xs text-muted-foreground">casey@example.com</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 sm:p-6 md:hidden">
              <SidebarTrigger />
            </div>
            <main className="flex-1 p-4 sm:p-6">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
