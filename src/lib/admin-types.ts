export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Developer';
  status: 'Active' | 'Deactivated';
  dateAdded: string; // ISO string
}

export interface Recipe {
  id: number;
  name: string;
  author: string;
  category: string;
  country: string;
  dateAdded: string; // ISO string
  favorites: number;
  imageUrl: string;
  description: string;
  ingredients: string[];
}

export interface Category {
  id: number;
  name: string;
  recipeCount: number;
  dateAdded: string; // ISO string
}

export interface Country {
  id: number;
  name: string;
  recipeCount: number;
  dateAdded: string; // ISO string
}
