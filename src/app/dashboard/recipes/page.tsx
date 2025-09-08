import { CommunityRecipesClient } from '@/components/grocy/CommunityRecipesClient';
import { mockRecipes } from '@/lib/mock-data';

export default function RecipesPage() {
    return <CommunityRecipesClient recipes={mockRecipes} />;
}
