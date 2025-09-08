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
  category: 'Vegan' | 'Halal' | 'Gluten-Free' | 'Quick & Easy' | 'Dessert';
  country: string;
  imageUrl: string;
  totalFavorites: number;
  isFavorite: boolean;
  ingredients: string[];
  instructions?: string[]; // Optional for now
}
