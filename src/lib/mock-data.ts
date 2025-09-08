import type { GroceryItem, Recipe } from '@/lib/types';
import { format, addDays } from 'date-fns';

const today = new Date();

export const mockGroceryItems: GroceryItem[] = [
  { id: 1, name: 'Avocado', category: 'Produce', quantity: 3, expiryDate: format(addDays(today, 2), 'yyyy-MM-dd') },
  { id: 2, name: 'Chicken Breast', category: 'Meat', quantity: 2, expiryDate: format(addDays(today, 1), 'yyyy-MM-dd') },
  { id: 3, name: 'Milk', category: 'Dairy', quantity: 1, expiryDate: format(addDays(today, 5), 'yyyy-MM-dd') },
  { id: 4, name: 'Cheddar Cheese', category: 'Dairy', quantity: 1, expiryDate: format(addDays(today, 14), 'yyyy-MM-dd') },
  { id: 5, name: 'Tomatoes', category: 'Produce', quantity: 5, expiryDate: format(addDays(today, 6), 'yyyy-MM-dd') },
  { id: 6, name: 'Whole Wheat Bread', category: 'Bakery', quantity: 1, expiryDate: format(addDays(today, 4), 'yyyy-MM-dd') },
  { id: 7, name: 'Eggs', category: 'Dairy', quantity: 12, expiryDate: format(addDays(today, 20), 'yyyy-MM-dd') },
  { id: 8, name: 'Spinach', category: 'Produce', quantity: 1, expiryDate: format(addDays(today, 7), 'yyyy-MM-dd') },
];

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Spicy Avocado Toast',
    category: 'Quick & Easy',
    country: 'International',
    imageUrl: 'https://picsum.photos/600/400',
    totalFavorites: 132,
    isFavorite: true,
    ingredients: ['Avocado', 'Bread', 'Chili Flakes'],
  },
  {
    id: 2,
    title: 'Grilled Chicken Salad',
    category: 'Halal',
    country: 'American',
    imageUrl: 'https://picsum.photos/600/400',
    totalFavorites: 250,
    isFavorite: false,
    ingredients: ['Chicken Breast', 'Spinach', 'Tomatoes', 'Avocado'],
  },
  {
    id: 3,
    title: 'Tomato Soup',
    category: 'Vegan',
    country: 'Italian',
    imageUrl: 'https://picsum.photos/600/400',
    totalFavorites: 89,
    isFavorite: false,
    ingredients: ['Tomatoes', 'Vegetable Broth', 'Onion'],
  },
  {
    id: 4,
    title: 'Classic Tiramisu',
    category: 'Dessert',
    country: 'Italian',
    imageUrl: 'https://picsum.photos/600/400',
    totalFavorites: 401,
    isFavorite: true,
    ingredients: ['Eggs', 'Mascarpone', 'Coffee'],
  },
  {
    id: 5,
    title: 'Cheesy Omelette',
    category: 'Quick & Easy',
    country: 'French',
    imageUrl: 'https://picsum.photos/600/400',
    totalFavorites: 175,
    isFavorite: false,
    ingredients: ['Eggs', 'Cheddar Cheese', 'Milk'],
  },
];
