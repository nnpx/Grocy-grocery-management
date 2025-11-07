import type { User, Recipe, Category, Country } from './admin-types';
import { subDays, format } from 'date-fns';

const today = new Date();

const generateItems = <T>(count: number, factory: (index: number) => T): T[] => {
  return Array.from({ length: count }, (_, i) => factory(i));
};

// Mock Users
const roles: User['role'][] = ['Admin', 'Moderator', 'User'];
export const mockAdminUsers: User[] = generateItems(25, i => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: roles[i % roles.length],
  status: i % 5 === 0 ? 'Deactivated' : 'Active',
  dateAdded: format(subDays(today, Math.floor(Math.random() * 40)), 'yyyy-MM-dd HH:mm:ss'),
}));

// Mock Recipes
const categories = ['Quick & Easy', 'Vegan', 'Dessert', 'Halal', 'French'];
const countries = ['International', 'American', 'Italian', 'French', 'Indian'];

export const mockAdminRecipes: Recipe[] = generateItems(50, i => ({
  id: i + 1,
  name: `Recipe Title ${i + 1}`,
  author: mockAdminUsers[i % mockAdminUsers.length].name,
  category: categories[i % categories.length],
  country: countries[i % countries.length],
  dateAdded: format(subDays(today, Math.floor(Math.random() * 40)), 'yyyy-MM-dd HH:mm:ss'),
  favorites: Math.floor(Math.random() * 500),
  imageUrl: `https://picsum.photos/seed/${i + 100}/600/400`,
  description: 'A delicious recipe for your enjoyment.',
  ingredients: ['Ingredient A', 'Ingredient B', 'Ingredient C'],
}));

// Mock Categories
export const mockAdminCategories: Category[] = categories.map((name, i) => ({
  id: i + 1,
  name: name,
  recipeCount: mockAdminRecipes.filter(r => r.category === name).length,
  dateAdded: format(subDays(today, Math.floor(Math.random() * 40)), 'yyyy-MM-dd HH:mm:ss'),
}));

// Mock Countries
export const mockAdminCountries: Country[] = countries.map((name, i) => ({
  id: i + 1,
  name: name,
  recipeCount: mockAdminRecipes.filter(r => r.country === name).length,
  dateAdded: format(subDays(today, Math.floor(Math.random() * 40)), 'yyyy-MM-dd HH:mm:ss'),
}));
