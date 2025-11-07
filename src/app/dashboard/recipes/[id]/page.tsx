'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/lib/types';
import { RecipeDetailClient } from '@/components/grocy/RecipeDetailClient';

interface RecipeDetailPageProps {
    params: { id: string };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
    const { id } = params;
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const token = sessionStorage.getItem('AUTH_TOKEN');

        if (!token) {
            toast({
                variant: 'destructive',
                title: 'Log in Required',
                description: 'Please log in to view this recipe.',
            });
            router.push('/login');
            return;
        }

        async function fetchRecipe() {
            try {
                const res = await fetch(`/api/dashboard/community-recipes/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log('Fetched recipe detail:', data);

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

                    if (res.status === 404) {
                        toast({
                            variant: 'destructive',
                            title: 'Recipe Not Found',
                            description: 'This recipe may have been removed.',
                        });
                        router.push('/dashboard/recipes');
                        return;
                    }

                    toast({
                        variant: 'destructive',
                        title: 'Error Loading Recipe',
                        description: data.error || 'Could not load this recipe.',
                    });
                    setLoading(false);
                    return;
                }

                setRecipe(data.recipe);
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

        fetchRecipe();
    }, [id, router, toast]);

    if (loading) {
        return <div className="text-center py-10">Loading recipe...</div>;
    }

    if (!recipe) {
        return (
            <div className="text-center py-10 text-gray-500">
                Recipe not found.
            </div>
        );
    }

    return <RecipeDetailClient recipe={recipe} />;
}
