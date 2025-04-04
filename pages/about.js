import { useState, useEffect } from "react";

export default function About() {
  const [nutritionData, setNutritionData] = useState({});
  const [recipeName, setRecipeName] = useState("Ham & Cheese Sandwich");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNutritionData = async (recipe) => {
    if (!recipe) return;

    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${recipe}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": "fMEymAjDbHjAa4glZYO/KA==xRLpQeLsHsiywaiG", // Replace with your actual API key
        },
      }
    );
    const data = await response.json();

    const round = (items, key) =>
      items?.reduce((sum, item) => sum + (item[key] || 0), 0).toFixed(1) || "N/A";

    const totalCalories = round(data.items, "calories");
    const totalServingSize = round(data.items, "serving_size_g");
    const totalProtein = round(data.items, "protein_g");

    setNutritionData({
      totalCalories: `${totalCalories} Calories`,
      totalServingSize: `${totalServingSize}g Serving`,
      totalProtein: `${totalProtein}g Protein`,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setRecipeName(searchQuery);
    fetchNutritionData(searchQuery); // Fetch the data for the searched recipe
    setSearchQuery(""); // Clear the search field after submit
  };

  useEffect(() => {
    fetchNutritionData(recipeName); // Initial load for default recipe
  }, [recipeName]);

  const handleViewRecipeClick = () => {
    alert("View Recipe clicked!");
  };

  return (
    <div className="h-screen overflow-hidden font-sans bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-[#111]">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side */}
        <div className="w-full md:w-1/2 px-10 py-6 flex flex-col justify-center bg-white">
          <h2 className="text-xs uppercase text-gray-500 mb-1 tracking-wide">Featured</h2>
          <h1 className="text-3xl font-extrabold mb-4">{recipeName}</h1>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a recipe..."
              className="px-4 py-2 w-full border rounded-md text-black"
            />
            <button type="submit" className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              Search
            </button>
          </form>

          <div className="flex gap-6 text-xs mb-4">
            <div><span className="font-bold block">Yields</span>2 Servings</div>
            <div><span className="font-bold block">Prep</span>5 mins</div>
            <div><span className="font-bold block">Cook</span>15 mins</div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-[10px]">
            {[
              { label: 'Size', value: nutritionData.totalServingSize || 'N/A' },
              { label: 'Calories', value: nutritionData.totalCalories || 'N/A' },
              { label: 'Fat', value: '10 g' },
              { label: 'Sat. Fat', value: '5 g' },
              { label: 'Chol.', value: '30 mg' },
              { label: 'Sodium', value: '550 mg' },
              { label: 'Carbs', value: '26 g' },
              { label: 'Fiber', value: '2 g' },
              { label: 'Sugar', value: '4 g' },
              { label: 'Protein', value: nutritionData.totalProtein || 'N/A' }
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-md aspect-square flex flex-col justify-center items-center bg-white hover:bg-[#00cfff] hover:text-white transition-colors"
              >
                <div className="font-medium">{item.label}</div>
                <div className="font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1551183053-bf91a1d81141"
            alt={recipeName}
            className="rounded-xl shadow-lg w-[70%] aspect-square object-cover"
          />
          <button
            onClick={handleViewRecipeClick}
            className="absolute top-3/4 left-1/2 transform -translate-x-1/2 px-6 py-2 text-sm bg-black text-white rounded-full hover:bg-[#00cfff] hover:text-black transition-colors duration-300"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
