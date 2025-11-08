'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/lib/types';
import { MyRecipesClient } from '@/components/grocy/MyRecipesClient';

export default function MyRecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const token = sessionStorage.getItem('AUTH_TOKEN');

        if (!token) {
            toast({
                variant: 'destructive',
                title: 'Log in Required',
                description: 'Please log in to view your recipes.',
            });
            router.push('/login');
            return;
        }

        async function fetchRecipes() {
            try {
                const res = await fetch('/api/dashboard/my-recipes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log('Fetched my recipes:', data);

                if (!res.ok || !data.ok) {
                    if (res.status === 401) {
                        sessionStorage.removeItem('AUTH_TOKEN');
                        toast({
                            variant: 'destructive',
                            title: 'Session Expired',
                            description: 'Your session has expired. Please log in again.',
                        });
                        router.push('/login');
                        return;
                    }

                    toast({
                        variant: 'destructive',
                        title: 'Error Loading Recipes',
                        description: data.error || 'Could not load your recipes.',
                    });
                    setLoading(false);
                    return;
                }

                setRecipes(data.recipes || []);
                setCategories(data.categories || []);
                setCountries(data.countries || []);
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

        fetchRecipes();
    }, [router, toast]);

    if (loading) return <div className="text-center py-10">Loading your recipes...</div>;

    if (!recipes) {
        return (
            <div className="text-center py-10 text-gray-500">
                You haven’t added any recipes yet.
            </div>
        );
    }

    return <MyRecipesClient recipes={recipes} categories={categories} countries={countries} />;
}
