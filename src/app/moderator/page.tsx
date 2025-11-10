import { ModeratorPageClient } from '@/components/moderator/ModeratorPageClient';

export default function ModeratorPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const activeTab = searchParams?.tab || 'recipes';

  return <ModeratorPageClient initialTab={activeTab} />;
}
