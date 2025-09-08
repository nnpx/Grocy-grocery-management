import { mockRecipes } from '@/lib/mock-data';
import { MyRecipesClient } from '@/components/grocy/MyRecipesClient';

export default function MyRecipesPage() {
    const myRecipes = mockRecipes.filter(recipe => recipe.isOwner);
    return <MyRecipesClient recipes={myRecipes} />;
}
