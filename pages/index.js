import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export default function Home() {
  const [randomizedRecipes, setRandomizedRecipes] = useState([]);

  const predefinedRecipes = [
    "Creamy Meatballs & Pasta",
    "Sweet And Spicy Barbecue Wings",
    "Fresh Pesto Pasta With Peas",
    "Grilled Garlic Chicken & Veggies",
    "Shrimp Salad With Lettuce Corn",
    "Stir-Fried Egg With Thai Basil And Chilli",
    "Chicken Alfredo Pasta",
    "Beef Stir-Fry With Vegetables",
    "Vegetable Tacos",
    "Mushroom Risotto",
    "BBQ Chicken Pizza",
    "Salmon With Lemon and Dill",
    "Baked Ziti",
    "Pork Tenderloin With Roasted Veggies",
    "Vegetable Lasagna",
    "Chicken Caesar Salad",
    "Quinoa Salad With Roasted Vegetables",
    "Grilled Shrimp Skewers",
    "Eggplant Parmesan",
  ];

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5).slice(0, 9);
  };

  useEffect(() => {
    const fetchRecipeData = async () => {
      const recipePromises = shuffle(predefinedRecipes).map(async (recipe) => {
        const response = await fetch(
          `https://api.calorieninjas.com/v1/nutrition?query=${recipe}`,
          {
            method: "GET",
            headers: {
              "X-Api-Key": "fMEymAjDbHjAa4glZYO/KA==xRLpQeLsHsiywaiG",
            },
          }
        );
        const data = await response.json();

const round = (items, key) =>
  items?.reduce((sum, item) => sum + (item[key] || 0), 0).toFixed(1) || "N/A";

const totalCalories = round(data.items, "calories");
const totalServingSize = round(data.items, "serving_size_g");
const totalProtein = round(data.items, "protein_g");

        return {
          title: recipe,
          totalCalories: `${totalCalories} Calories`,
          totalServingSize: `${totalServingSize}g Serving`,
          totalProtein: `${totalProtein}g Protein`,
          img: "https://via.placeholder.com/100",
        };
      });

      const recipesData = await Promise.all(recipePromises);
      setRandomizedRecipes(recipesData);
    };

    fetchRecipeData();
  }, []);

  return (
    <div className={playfairDisplay.variable}>
      <div className="min-h-screen bg-gray-100 py-10 px-5 text-center">
        <h1 className="text-6xl font-bold text-black">
          Healthy Cooking Recipes <br /> and the right Nutrition.
        </h1>
        <p className="text-gray-600 mt-3">Browse Through Over 100,000+ Tasty Recipes.</p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium mt-5 hover:bg-green-700">
          MORE RECIPES
        </button>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {randomizedRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 recipe-card"
            >
              <img
                src={recipe.img}
                alt={recipe.title}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="text-left">
              <h2 className="text-lg font-bold text-red-500">{recipe.title}</h2>
                <p className="text-sm text-yellow-500">🍽 {recipe.totalServingSize}</p>
                <p className="text-sm font-semibold text-green-600">🔥 {recipe.totalCalories}</p>
                <p className="text-sm font-semibold text-blue-600">💪 {recipe.totalProtein}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
