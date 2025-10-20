import { AdminPageClient } from '@/components/admin/AdminPageClient';
import { mockAdminUsers, mockAdminRecipes, mockAdminCategories, mockAdminCountries } from '@/lib/admin-mock-data';

export default function AdminPage() {
  return <AdminPageClient 
    users={mockAdminUsers}
    recipes={mockAdminRecipes}
    categories={mockAdminCategories}
    countries={mockAdminCountries}
  />;
}
