'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExpiryStatus } from '@/lib/utils';
import { StatCard } from '@/components/grocy/StatCard';
import { ExpiringItems } from '@/components/grocy/ExpiringItems';
import { RecipeSuggestions } from '@/components/grocy/RecipeSuggestions';
import { Package, Clock3, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the expected structure of dashboard data
interface DashboardData {
  userName: string;
  totalGroceries: number;
  expiringItems: any[];
  favoriteRecipes: any[];
  suggestedRecipes: any[];
}

export default function DashboardPage() {

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch the dashboard data from the API
  useEffect(() => {
    const token = sessionStorage.getItem('AUTH_TOKEN');

    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Log in Required',
        description: 'Please log in to access dashboard page.',
      });

      router.push('/login');
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // If the response is OK, parse the JSON result
        const result = await response.json();
        console.log("Dashboard data:\n", result);


        if (!response.ok) {
          if (response.status === 401) {
            // The token is bad, clear it from session storage immediately
            sessionStorage.removeItem('AUTH_TOKEN');

            toast({
              variant: 'destructive',
              title: 'Session Expired',
              description: 'Your session has expired. Please log in again.',
            });
          } else if (response.status === 403) {
            // 403 Forbidden - Role-based access denied
            toast({
              variant: 'destructive',
              title: 'Access Denied',
              description: 'You do not have permission to access this resource.',
            });
          } else {
            // Handle other server errors (500 Internal, etc.)
            toast({
              variant: 'destructive',
              title: 'Error Loading Dashboard',
              description: result.error || 'Could not load data. Please try again later.',
            });
            setLoading(false);
            return; // Stop execution if it's a non-auth error
          }


          setTimeout(() => {
            router.push('/login');
          }, 500);

          setLoading(false); // Stop loading state while redirecting
          return; // Stop execution
        }

        // Only runs if response.ok is true
        setData(result);
        setLoading(false);
      } catch (error) {
        // This catches network errors (e.g., server offline, CORS issues)
        toast({
          variant: 'destructive',
          title: 'Network Error',
          description: 'Could not connect to the server.',
        });
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="text-center py-10">Loading Dashboard...</div>;
  }

  if (!data) {
    return <div className="text-center py-10 text-gray-500">No dashboard data available.</div>;
  }

  const userName = data.userName;

  const expiringItems = data.expiringItems
    .map(item => ({ ...item, status: getExpiryStatus(item.expiryDate) }))
    .filter(item => item.status.days >= 0 && item.status.days <= 7)
    .sort((a, b) => a.status.days - b.status.days);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-foreground">Welcome, {userName}!</h1>
        <p className="text-muted-foreground">Here’s what’s happening in your kitchen today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/groceries" className="h-full">
          <StatCard
            title="Total Groceries"
            value={data.totalGroceries.toString()}
            icon={<Package className="h-6 w-6 text-primary" />}
          />
        </Link>
        <StatCard
          title="Expiring Soon"
          value={data.expiringItems.length.toString()}
          icon={<Clock3 className="h-6 w-6 text-accent" />}
          description="Within 1 week"
        />
        <Link href="/dashboard/favorites" className="h-full">
          <StatCard
            title="Favorite Recipes"
            value={data.favoriteRecipes.toString()}
            icon={<Heart className="h-6 w-6 text-favorite" />}
          />
        </Link>
      </div>

      <ExpiringItems items={expiringItems} />

      <RecipeSuggestions recipes={data.suggestedRecipes} />
    </div>
  );
}
