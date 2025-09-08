import Link from 'next/link';
import { mockGroceryItems, mockRecipes } from '@/lib/mock-data';
import { getExpiryStatus } from '@/lib/utils';
import { StatCard } from '@/components/grocy/StatCard';
import { ExpiringItems } from '@/components/grocy/ExpiringItems';
import { RecipeSuggestions } from '@/components/grocy/RecipeSuggestions';
import { Package, Clock3, Heart } from 'lucide-react';

export default function DashboardPage() {
  const userName = "Casey";

  // Process data
  const totalGroceries = mockGroceryItems.length;
  const expiringSoonCount = mockGroceryItems.filter(item => {
    const status = getExpiryStatus(item.expiryDate);
    return status.days <= 7;
  }).length;
  const favoriteRecipesCount = mockRecipes.filter(recipe => recipe.isFavorite).length;

  const expiringItems = mockGroceryItems
    .map(item => ({...item, status: getExpiryStatus(item.expiryDate)}))
    .filter(item => item.status.days >= 0 && item.status.days <= 7)
    .sort((a, b) => a.status.days - b.status.days);

  const inventory = new Set(mockGroceryItems.map(item => item.name));
  const suggestedRecipes = mockRecipes.filter(recipe => 
    recipe.ingredients.some(ingredient => inventory.has(ingredient))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-foreground">Welcome, {userName}!</h1>
        <p className="text-muted-foreground">Here’s what’s happening in your kitchen today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Groceries" 
          value={totalGroceries.toString()} 
          icon={<Package className="h-6 w-6 text-primary" />} 
        />
        <StatCard 
          title="Expiring Soon" 
          value={expiringSoonCount.toString()} 
          icon={<Clock3 className="h-6 w-6 text-accent" />} 
          description="Within 1 week" 
        />
        <Link href="/dashboard/favorites" className="h-full">
            <StatCard 
            title="Favorite Recipes" 
            value={favoriteRecipesCount.toString()} 
            icon={<Heart className="h-6 w-6 text-favorite" />} 
            />
        </Link>
      </div>

      <ExpiringItems items={expiringItems} />
      
      <RecipeSuggestions recipes={suggestedRecipes} />
    </div>
  );
}
