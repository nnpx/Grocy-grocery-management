'use client';

import { BarChart, LineChart, ResponsiveContainer, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/grocy/StatCard';
import { Users, ChefHat, Heart, Globe, Activity } from 'lucide-react';
import type { User, Recipe, Category, Country } from '@/lib/admin-types';
import { format, subDays } from 'date-fns';

interface AdminDashboardProps {
  users: User[];
  recipes: Recipe[];
  categories: Category[];
  countries: Country[];
}

const generateChartData = (items: (User | Recipe)[], days = 14) => {
  const data = Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    return {
      date: format(date, 'MMM d'),
      count: 0,
    };
  });

  items.forEach(item => {
    const itemDate = new Date(item.dateAdded);
    const dayDiff = Math.floor((new Date().getTime() - itemDate.getTime()) / (1000 * 3600 * 24));
    if (dayDiff < days && dayDiff >= 0) {
      const formattedDate = format(itemDate, 'MMM d');
      const dataPoint = data.find(d => d.date === formattedDate);
      if (dataPoint) {
        dataPoint.count++;
      }
    }
  });

  return data;
};


export function AdminDashboard({ users, recipes, categories, countries }: AdminDashboardProps) {
  const totalUsers = users.length;
  const totalRecipes = recipes.length;
  const totalFavorites = recipes.reduce((sum, recipe) => sum + recipe.favorites, 0);

  const usersChartData = generateChartData(users);
  const recipesChartData = generateChartData(recipes);

  const recentActivity = [
    ...users.slice(0, 3).map(u => ({ type: 'user', item: u })),
    ...recipes.slice(0, 2).map(r => ({ type: 'recipe', item: r })),
  ].sort((a, b) => new Date(b.item.dateAdded).getTime() - new Date(a.item.dateAdded).getTime());

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers.toString()} icon={<Users className="h-6 w-6 text-primary" />} />
        <StatCard title="Total Recipes" value={totalRecipes.toString()} icon={<ChefHat className="h-6 w-6 text-primary" />} />
        <StatCard title="Total Favorites" value={totalFavorites.toString()} icon={<Heart className="h-6 w-6 text-favorite" />} />
        <StatCard title="Categories & Countries" value={`${categories.length} / ${countries.length}`} icon={<Globe className="h-6 w-6 text-accent" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>New Users (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="New Users" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>New Recipes (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recipesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="New Recipes" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <div>
                  {activity.type === 'user' ? (
                    <>
                      <span className="font-semibold">New user signed up:</span> {(activity.item as User).name} ({(activity.item as User).email})
                    </>
                  ) : (
                    <>
                       <span className="font-semibold">New recipe created:</span> {(activity.item as Recipe).name} by {(activity.item as Recipe).author}
                    </>
                  )}
                </div>
                <span className="text-muted-foreground">{format(new Date(activity.item.dateAdded), 'MMM d, yyyy')}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
