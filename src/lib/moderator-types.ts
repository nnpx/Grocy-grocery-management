export interface ModeratorRecipe {
  id: string;
  name: string;
  author_name: string;
  author_email: string;
  category: 'Vegan' | 'Halal' | 'Dessert' | 'Quick & Easy' | 'Gluten-Free' | 'Main Course';
  country: 'American' | 'Italian' | 'International' | 'French' | 'Indian' | 'Mexican';
  cook_time: number; // in minutes
  ingredients: string[];
  instructions: string;
  image_url: string;
  created_at: string; // ISO date string
}

export interface ModeratorStatsData {
  totalRecipes: number;
  recipesThisWeek: number;
  recipesDeleted: number;
  topCategory: { name: string; count: number };
  recipesPerCategory: { name: string; value: number }[];
}
