export interface GroceryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string; // ISO 8601 format: "YYYY-MM-DD"
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  category: 'Vegan' | 'Halal' | 'Gluten-Free' | 'Quick & Easy' | 'Dessert';
  country: string;
  imageUrl: string;
  totalFavorites: number;
  isFavorite: boolean;
  ingredients: string[];
  instructions?: string[]; // Optional for now
  owner: string;
  cookTime: number; // in minutes
  createdAt: string; // ISO date string
}
