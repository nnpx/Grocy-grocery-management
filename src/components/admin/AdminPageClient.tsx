'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
} from '@/components/ui/sidebar';
import { ChefHat, Users, BookMarked, Globe, LayoutDashboard } from 'lucide-react';
import type { User, Recipe, Category, Country } from '@/lib/admin-types';
import { AdminDashboard } from './AdminDashboard';
import { UsersManagement } from './UsersManagement';
import { RecipesManagement } from './RecipesManagement';
import { CategoriesCountriesManagement } from './CategoriesCountriesManagement';

interface AdminPageClientProps {
  users: User[];
  recipes: Recipe[];
  categories: Category[];
  countries: Country[];
}

const TABS: { [key: string]: { icon: ReactNode, label: string, component: ReactNode } } = {
  dashboard: { icon: <LayoutDashboard />, label: 'Dashboard', component: <div>Dashboard Content</div> },
  users: { icon: <Users />, label: 'Users', component: <div>Users Content</div> },
  recipes: { icon: <BookMarked />, label: 'Recipes', component: <div>Recipes Content</div> },
  'categories-countries': { icon: <Globe />, label: 'Categories & Countries', component: <div>Categories & Countries Content</div> },
};

export function AdminPageClient({ users, recipes, categories, countries }: AdminPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const handleTabChange = (tab: string) => {
    router.push(`${pathname}?tab=${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard users={users} recipes={recipes} categories={categories} countries={countries} />;
      case 'users':
        return <UsersManagement initialUsers={users} />;
      case 'recipes':
        return <RecipesManagement initialRecipes={recipes} allUsers={users} />;
      case 'categories-countries':
        return <CategoriesCountriesManagement initialCategories={categories} initialCountries={countries} recipes={recipes} />;
      default:
        return <AdminDashboard users={users} recipes={recipes} categories={categories} countries={countries} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2">
                 <ChefHat className="w-8 h-8 text-primary" />
                 <h1 className="text-2xl font-headline font-bold text-primary">Grocy Admin</h1>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {Object.keys(TABS).map(tabKey => (
                 <SidebarMenuItem key={tabKey}>
                    <SidebarMenuButton 
                        onClick={() => handleTabChange(tabKey)} 
                        tooltip={TABS[tabKey].label} 
                        isActive={activeTab === tabKey}
                    >
                        {TABS[tabKey].icon}
                        <span>{TABS[tabKey].label}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="p-4 sm:p-6 flex flex-col w-full">
            <div className="md:hidden pb-4">
              <SidebarTrigger />
            </div>
            <main className="flex-1 w-full">
                {renderContent()}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
