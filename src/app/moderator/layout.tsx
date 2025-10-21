'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ChefHat, BookCopy, BarChart3, Home, LogOut } from 'lucide-react';

export default function ModeratorLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'recipes';
  const userName = "Moderator";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Link href="/moderator" className="flex items-center gap-2">
                 <ChefHat className="w-8 h-8 text-primary" />
                 <h1 className="text-2xl font-headline font-bold text-primary">Grocy Moderator</h1>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Recipes" isActive={activeTab === 'recipes'}>
                  <Link href="/moderator?tab=recipes">
                    <BookCopy />
                    <span>Recipes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Stats" isActive={activeTab === 'stats'}>
                  <Link href="/moderator?tab=stats">
                    <BarChart3 />
                    <span>Stats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
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
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{userName}</span>
                <span className="text-xs text-muted-foreground">moderator@example.com</span>
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
