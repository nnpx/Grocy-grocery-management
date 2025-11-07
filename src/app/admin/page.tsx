'use client';

import { AdminPageClient } from '@/components/admin/AdminPageClient';
import { mockAdminRecipes } from '@/lib/admin-mock-data';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Category, Country, User } from '@/lib/admin-types';

interface AdminData {
  users: User[];
  categories: Category[];
  countries: Country[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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

    async function fetchCategoriesCountries() {
      try {
        const userResponse = await fetch('/api/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const userResult = await userResponse.json();
        console.log('Fetched users: \n', userResult);

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            sessionStorage.removeItem('AUTH_TOKEN');

            toast({
              variant: 'destructive',
              title: 'Session Expired',
              description: 'Your session has expired. Please log in again.',
            });
          } else if (userResponse.status === 403) {
            toast({
              variant: 'destructive',
              title: 'Access Denied',
              description: 'You do not have permission to access this resource.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Error Loading Dashboard',
              description: userResult.error || 'Could not load data. Please try again later.',
            });
            setLoading(false);
            return;
          }

          setTimeout(() => {
            router.push('/login');
          }, 500);

          setLoading(false);
          return;
        }

        const categoriesResponse = await fetch('/api/admin/categories-countries', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const categoriesResult = await categoriesResponse.json();

        console.log('Fetched categories-countries: \n', categoriesResult);

        if (!categoriesResponse.ok) {
          if (categoriesResponse.status === 401) {
            sessionStorage.removeItem('AUTH_TOKEN');

            toast({
              variant: 'destructive',
              title: 'Session Expired',
              description: 'Your session has expired. Please log in again.',
            });
          } else if (categoriesResponse.status === 403) {
            toast({
              variant: 'destructive',
              title: 'Access Denied',
              description: 'You do not have permission to access this resource.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Error Loading Dashboard',
              description: categoriesResult.error || 'Could not load data. Please try again later.',
            });
            setLoading(false);
            return;
          }

          setTimeout(() => {
            router.push('/login');
          }, 500);

          setLoading(false);
          return;
        }

        // Only runs if response.ok is true
        setData({
          users: userResult.users,
          categories: categoriesResult.categories,
          countries: categoriesResult.countries,
        });

        setLoading(false);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Network Error',
          description: 'Could not connect to the server.',
        });
        setLoading(false);
      }
    }

    fetchCategoriesCountries();
  }, [router]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-center py-10 text-gray-500">No dashboard data available.</div>;
  }

  return <AdminPageClient
    users={data.users}
    recipes={mockAdminRecipes}
    categories={data.categories}
    countries={data.countries}
  />;
}
