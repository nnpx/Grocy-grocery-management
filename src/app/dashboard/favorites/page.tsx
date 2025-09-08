import { FavoritesClient } from '@/components/grocy/FavoritesClient';
import { mockRecipes } from '@/lib/mock-data';

export default function FavoritesPage() {
    const favoriteRecipes = mockRecipes.filter(recipe => recipe.isFavorite);
    return <FavoritesClient recipes={favoriteRecipes} />;
}
