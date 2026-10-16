// Approximate nutrition values per serving for this educational demo.
const foods = [
  {
    id: 1,
    name: "Grilled Chicken Breast",
    category: "Protein",
    calories: 250,
    protein: 40,
    carbs: 0,
    fat: 7,
    goals: ["High Protein", "Balanced Diet"],
    description: "A lean and filling protein-rich meal option."
  },
  {
    id: 2,
    name: "Boiled Eggs",
    category: "Protein",
    calories: 156,
    protein: 13,
    carbs: 1,
    fat: 11,
    goals: ["High Protein", "Low Calorie"],
    description: "A simple source of protein for a light meal."
  },
  {
    id: 3,
    name: "Greek Yogurt",
    category: "Dairy",
    calories: 120,
    protein: 15,
    carbs: 8,
    fat: 3,
    goals: ["High Protein", "Low Calorie", "Balanced Diet"],
    description: "Creamy yogurt with protein and moderate calories."
  },
  {
    id: 4,
    name: "Paneer",
    category: "Dairy",
    calories: 300,
    protein: 20,
    carbs: 6,
    fat: 22,
    goals: ["High Protein", "Balanced Diet"],
    description: "A vegetarian protein option made from milk."
  },
  {
    id: 5,
    name: "Dal",
    category: "Legumes",
    calories: 230,
    protein: 14,
    carbs: 36,
    fat: 4,
    goals: ["Low Calorie", "Balanced Diet"],
    description: "Cooked lentils offering protein, fibre and carbohydrates."
  },
  {
    id: 6,
    name: "Chickpea Salad",
    category: "Salad",
    calories: 280,
    protein: 12,
    carbs: 42,
    fat: 8,
    goals: ["Balanced Diet"],
    description: "Chickpeas and fresh vegetables in a balanced bowl."
  },
  {
    id: 7,
    name: "Oatmeal",
    category: "Breakfast",
    calories: 210,
    protein: 8,
    carbs: 36,
    fat: 4,
    goals: ["Low Calorie", "Balanced Diet"],
    description: "A fibre-rich breakfast with steady carbohydrates."
  },
  {
    id: 8,
    name: "Vegetable Bowl",
    category: "Vegetables",
    calories: 160,
    protein: 6,
    carbs: 28,
    fat: 4,
    goals: ["Low Calorie", "Balanced Diet"],
    description: "A colourful bowl of lightly cooked seasonal vegetables."
  },
  {
    id: 9,
    name: "Brown Rice Bowl",
    category: "Grains",
    calories: 340,
    protein: 9,
    carbs: 68,
    fat: 4,
    goals: ["Balanced Diet"],
    description: "Whole-grain rice served with mixed vegetables."
  },
  {
    id: 10,
    name: "Tofu",
    category: "Protein",
    calories: 180,
    protein: 20,
    carbs: 5,
    fat: 10,
    goals: ["High Protein", "Low Calorie", "Balanced Diet"],
    description: "A versatile plant-based protein with mild flavour."
  },
  {
    id: 11,
    name: "Fruit Yogurt Bowl",
    category: "Breakfast",
    calories: 240,
    protein: 10,
    carbs: 38,
    fat: 6,
    goals: ["Low Calorie", "Balanced Diet"],
    description: "Yogurt and fresh fruit for a refreshing balanced snack."
  },
  {
    id: 12,
    name: "Sprout Salad",
    category: "Salad",
    calories: 140,
    protein: 9,
    carbs: 24,
    fat: 2,
    goals: ["Low Calorie", "Balanced Diet"],
    description: "Crunchy sprouts and vegetables with light seasoning."
  }
];

function recommendFoods(goal, maxCalories, minProtein) {
  return foods
    .filter((food) =>
      food.goals.includes(goal) &&
      food.calories <= Number(maxCalories) &&
      food.protein >= Number(minProtein)
    )
    .sort((a, b) => b.protein - a.protein || a.calories - b.calories);
}

const foodData = { foods, recommendFoods };

if (typeof module !== "undefined") module.exports = foodData;
if (typeof window !== "undefined") window.FoodData = foodData;
