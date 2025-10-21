import { subDays, subHours, subMinutes } from 'date-fns';
import type { ModeratorRecipe, ModeratorStatsData } from './moderator-types';

const now = new Date();

const users = [
  { name: 'Alex Johnson', email: 'alex@example.com' },
  { name: 'Maria Garcia', email: 'maria@example.com' },
  { name: 'Sam Chen', email: 'sam@example.com' },
  { name: 'Priya Patel', email: 'priya@example.com' },
];

const categories: ModeratorRecipe['category'][] = ['Vegan', 'Halal', 'Dessert', 'Quick & Easy', 'Gluten-Free', 'Main Course'];
const countries: ModeratorRecipe['country'][] = ['American', 'Italian', 'International', 'French', 'Indian', 'Mexican'];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const mockModeratorRecipes: ModeratorRecipe[] = Array.from({ length: 32 }, (_, i) => {
  const user = getRandomItem(users);
  const cookTime = Math.floor(Math.random() * 30) + 10;
  return {
    id: `recipe_${i + 1}`,
    name: `Gourmet Recipe #${i + 1}`,
    author_name: user.name,
    author_email: user.email,
    category: getRandomItem(categories),
    country: getRandomItem(countries),
    cook_time: Math.floor(Math.random() * 90) + 15,
    description: `A delicious and easy-to-make dish that's perfect for a quick weeknight dinner. Flavorful, satisfying, and ready in under ${cookTime + 5} minutes.`,
    ingredients: Array.from({ length: Math.floor(Math.random() * 5) + 4 }, (_, j) => `Ingredient ${j + 1}`),
    instructions: [
        'Do something.',
        'Do something else.',
        `Combine everything and cook for ${cookTime} minutes.`,
        'Serve and enjoy.'
    ],
    image_url: `https://picsum.photos/seed/${i + 200}/800/600`,
    created_at: i < 5 ? subHours(now, i * 3).toISOString() : subDays(now, i).toISOString(),
  };
});


export const mockModeratorStats: ModeratorStatsData = {
  totalRecipes: mockModeratorRecipes.length,
  recipesThisWeek: mockModeratorRecipes.filter(r => subDays(now, 7) < new Date(r.created_at)).length,
  recipesDeleted: 14,
  topCategory: { name: 'Quick & Easy', count: 8 },
  recipesPerCategory: [
    { name: 'Vegan', value: 5 },
    { name: 'Halal', value: 4 },
    { name: 'Dessert', value: 6 },
    { name: 'Quick & Easy', value: 8 },
    { name: 'Gluten-Free', value: 3 },
    { name: 'Main Course', value: 6 },
  ],
};
