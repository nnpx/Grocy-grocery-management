'use client';

import { ModeratorRecipesClient } from '@/components/moderator/ModeratorRecipesClient';
// import { ModeratorStats } from '@/components/moderator/ModeratorStats';
// import { mockModeratorRecipes, mockModeratorStats } from '@/lib/moderator-mock-data';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ModeratorData {
    recipes: any[];
}

interface ModeratorPageClientProps {
    initialTab: string;
}

export function ModeratorPageClient({ initialTab }: ModeratorPageClientProps) {
    const [activeTab, setActiveTab] = useState(initialTab || 'recipes');

    const [data, setData] = useState<ModeratorData | null>(null);
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

            // Redirect if no token
            router.push('/login');
            return;
        }

        async function fetchRecipes() {
            try {
                const response = await fetch('/api/moderator/recipes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                console.log('Fetched recipes: \n', result);

                if (!response.ok) {
                    if (response.status === 401) {
                        sessionStorage.removeItem('AUTH_TOKEN');

                        toast({
                            variant: 'destructive',
                            title: 'Session Expired',
                            description: 'Your session has expired. Please log in again.',
                        });
                    } else if (response.status === 403) {
                        toast({
                            variant: 'destructive',
                            title: 'Access Denied',
                            description: 'You do not have permission to access this resource.',
                        });
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Error Loading Dashboard',
                            description: result.error || 'Could not load data. Please try again later.',
                        });
                        setLoading(false);
                        return;
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

        fetchRecipes();
    }, [router]);

    if (loading) {
        return <div>Loading recipes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div className="text-center py-10 text-gray-500">No dashboard data available.</div>;
    }

    return (
        <>
            {activeTab === 'recipes' && <ModeratorRecipesClient recipes={data.recipes} />}
            {/* {activeTab === 'stats' && <ModeratorStats stats={mockModeratorStats} />} */}
        </>
    );
}
