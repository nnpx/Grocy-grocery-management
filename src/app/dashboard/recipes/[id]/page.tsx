import { mockRecipes } from '@/lib/mock-data';
import { RecipeDetailClient } from '@/components/grocy/RecipeDetailClient';
import { notFound } from 'next/navigation';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
    const recipe = mockRecipes.find(r => r.id === parseInt(params.id, 10));

    if (!recipe) {
        notFound();
    }

    return <RecipeDetailClient recipe={recipe} />;
}
