import type { GroceryItem, Recipe } from "@/lib/types";
import { format, addDays, subDays, subHours } from "date-fns";

const today = new Date();

export const mockGroceryItems: GroceryItem[] = [
  {
    id: 1,
    name: "Avocado",
    category: "Produce",
    quantity: 3,
    expiryDate: format(addDays(today, 2), "yyyy-MM-dd"),
  },
  {
    id: 2,
    name: "Chicken Breast",
    category: "Meat",
    quantity: 2,
    expiryDate: format(addDays(today, 1), "yyyy-MM-dd"),
  },
  {
    id: 3,
    name: "Milk",
    category: "Dairy",
    quantity: 1,
    expiryDate: format(addDays(today, 5), "yyyy-MM-dd"),
  },
  {
    id: 4,
    name: "Cheddar Cheese",
    category: "Dairy",
    quantity: 1,
    expiryDate: format(addDays(today, 14), "yyyy-MM-dd"),
  },
  {
    id: 5,
    name: "Tomatoes",
    category: "Produce",
    quantity: 5,
    expiryDate: format(addDays(today, 6), "yyyy-MM-dd"),
  },
  {
    id: 6,
    name: "Whole Wheat Bread",
    category: "Bakery",
    quantity: 1,
    expiryDate: format(addDays(today, 4), "yyyy-MM-dd"),
  },
  {
    id: 7,
    name: "Eggs",
    category: "Dairy",
    quantity: 12,
    expiryDate: format(addDays(today, 20), "yyyy-MM-dd"),
  },
  {
    id: 8,
    name: "Spinach",
    category: "Produce",
    quantity: 1,
    expiryDate: format(addDays(today, 7), "yyyy-MM-dd"),
  },
];

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Spicy Avocado Toast with Egg",
    description:
      "A quick and delicious breakfast to kickstart your day with a spicy twist and a protein boost.",
    category: "Quick & Easy",
    country: "International",
    imageUrl:
      "https://eatingoutloud.com/wp-content/uploads/2025/04/avocado-toast-with-egg-recipe-1745727108.jpg",
    totalFavorites: 132,
    isFavorite: true,
    ingredients: ["Avocado", "Bread", "Chili Flakes", "Egg"],
    owner: "owner name",
    cookTime: 10,
    createdAt: subHours(today, 2).toISOString(),
  },
  {
    id: 2,
    title: "Grilled Chicken Salad",
    description:
      "A healthy and satisfying salad with perfectly grilled chicken and fresh vegetables, drizzled with a light vinaigrette.",
    category: "Halal",
    country: "American",
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/grilled-chicken-salad-index-6628169554c88.jpg?crop=0.891xw:1.00xh;0.0977xw,0",
    totalFavorites: 250,
    isFavorite: false,
    ingredients: [
      "Chicken Breast",
      "Spinach",
      "Tomatoes",
      "Avocado",
      "Vinaigrette",
    ],
    owner: "owner name",
    cookTime: 25,
    createdAt: subDays(today, 1).toISOString(),
  },
  {
    id: 3,
    title: "Creamy Tomato Soup",
    description:
      "A comforting and rich tomato soup that is perfect for a chilly day. Serve with a side of grilled cheese.",
    category: "Vegan",
    country: "Italian",
    imageUrl:
      "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/roasted_tomato_soup_82555_16x9.jpg",
    totalFavorites: 89,
    isFavorite: false,
    ingredients: [
      "Tomatoes",
      "Vegetable Broth",
      "Onion",
      "Coconut Cream",
      "Herbs",
    ],
    owner: "owner name",
    cookTime: 40,
    createdAt: subDays(today, 2).toISOString(),
  },
  {
    id: 4,
    title: "Classic Italian Tiramisu",
    description:
      "An elegant and rich layered Italian dessert made with coffee, mascarpone, and a sprinkle of cocoa.",
    category: "Dessert",
    country: "Italian",
    imageUrl:
      "https://img.sndimg.com/food/image/upload/q_92,fl_progressive,w_1200,c_scale/v1/img/recipes/13/75/80/gIOf9wmOTUSvekgU8VaD_0S9A7296.jpg",
    totalFavorites: 401,
    isFavorite: true,
    ingredients: [
      "Eggs",
      "Mascarpone",
      "Coffee",
      "Ladyfingers",
      "Cocoa Powder",
    ],
    owner: "owner name",
    cookTime: 20,
    createdAt: subDays(today, 3).toISOString(),
  },
  {
    id: 5,
    title: "Fluffy Cheesy Omelette",
    description:
      "A fluffy and cheesy omelette that makes for a perfect and quick breakfast. Customize with your favorite fillings.",
    category: "Quick & Easy",
    country: "French",
    imageUrl:
      "https://api.photon.aremedia.net.au/wp-content/uploads/sites/12/media/6798/omelette.jpg",
    totalFavorites: 175,
    isFavorite: false,
    ingredients: ["Eggs", "Cheddar Cheese", "Milk", "Butter"],
    owner: "owner name",
    cookTime: 15,
    createdAt: subDays(today, 5).toISOString(),
  },
  {
    id: 6,
    title: "Vegan Lentil Shepherd's Pie",
    description:
      "A hearty and wholesome vegan version of the classic Shepherd's Pie, topped with creamy mashed potatoes.",
    category: "Vegan",
    country: "International",
    imageUrl:
      "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/lentilshepherdspiewi_93532_16x9.jpg",
    totalFavorites: 210,
    isFavorite: false,
    ingredients: ["Lentils", "Potatoes", "Carrots", "Onion", "Peas"],
    owner: "owner name",
    cookTime: 60,
    createdAt: subDays(today, 7).toISOString(),
  },
  {
    id: 7,
    title: "Authentic Chicken Biryani",
    description:
      "A fragrant and flavorful Indian rice dish with spiced chicken and aromatic basmati rice. A true feast!",
    category: "Halal",
    country: "Indian",
    imageUrl: "https://picsum.photos/seed/7/600/400",
    totalFavorites: 520,
    isFavorite: true,
    ingredients: ["Chicken", "Basmati Rice", "Yogurt", "Spices", "Onion"],
    owner: "owner name",
    cookTime: 75,
    createdAt: subDays(today, 10).toISOString(),
  },
  {
    id: 8,
    title: "Molten Chocolate Lava Cake",
    description:
      "A decadent and gooey chocolate cake with a molten chocolate center that flows out when you cut into it.",
    category: "Dessert",
    country: "American",
    imageUrl: "https://picsum.photos/seed/8/600/400",
    totalFavorites: 350,
    isFavorite: false,
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour"],
    owner: "owner name",
    cookTime: 25,
    createdAt: subDays(today, 12).toISOString(),
  },
];
