'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { ModeratorStatsData } from '@/lib/moderator-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/grocy/StatCard';
import { BookCopy, PlusCircle, Trash2, Trophy, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface ModeratorStatsProps {
  stats: ModeratorStatsData;
}

export function ModeratorStats({ stats }: ModeratorStatsProps) {
  const { toast } = useToast();

  const handleRefresh = () => {
    console.log('Refreshing stats...');
    toast({
      title: 'Stats Refreshed',
      description: 'The latest data has been loaded.',
    });
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold font-headline">Stats</h1>
            <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
            </Button>
        </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Recipes" value={stats.totalRecipes.toString()} icon={<BookCopy className="text-primary" />} />
        <StatCard title="Recipes This Week" value={stats.recipesThisWeek.toString()} icon={<PlusCircle className="text-primary" />} />
        <StatCard title="Recipes Deleted" value={stats.recipesDeleted.toString()} icon={<Trash2 className="text-destructive" />} />
        <StatCard title="Top Category" value={stats.topCategory.name} description={`${stats.topCategory.count} recipes`} icon={<Trophy className="text-accent" />} />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recipes per Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats.recipesPerCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
