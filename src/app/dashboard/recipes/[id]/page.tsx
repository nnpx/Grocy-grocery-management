import { mockRecipes } from '@/lib/mock-data';
import { RecipeDetailClient } from '@/components/grocy/RecipeDetailClient';
import { notFound } from 'next/navigation';

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
    const awaitedParams = await params;
    const recipe = mockRecipes.find(r => r.id === parseInt(awaitedParams.id, 10));

    if (!recipe) {
        notFound();
    }

    return <RecipeDetailClient recipe={recipe} />;
}
