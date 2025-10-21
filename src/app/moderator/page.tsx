import { ModeratorRecipesClient } from '@/components/moderator/ModeratorRecipesClient';
import { ModeratorStats } from '@/components/moderator/ModeratorStats';
import { mockModeratorRecipes, mockModeratorStats } from '@/lib/moderator-mock-data';

export default function ModeratorPage({ searchParams }: { searchParams: { tab?: string } }) {
  const activeTab = searchParams.tab || 'recipes';

  return (
    <>
      {activeTab === 'recipes' && <ModeratorRecipesClient recipes={mockModeratorRecipes} />}
      {activeTab === 'stats' && <ModeratorStats stats={mockModeratorStats} />}
    </>
  );
}
