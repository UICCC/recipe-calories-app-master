import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function About() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    if (!searchQuery.trim()) return;

    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": "fMEymAjDbHjAa4glZYO/KA==xRLpQeLsHsiywaiG",
        },
      }
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      setError("No valid recipe found. Try something else.");
      setRecipes([]);
      return;
    }

    const round = (items, key) =>
      items?.reduce((sum, item) => sum + (item[key] || 0), 0).toFixed(1) || "N/A";

    const totalCalories = round(data.items, "calories");
    const totalServingSize = round(data.items, "serving_size_g");
    const totalProtein = round(data.items, "protein_g");

    const imageResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`,
      {
        headers: {
          Authorization: "9Pa8e94e3oZr2BU4h4N0UkoOIz4npWv7MnTgMqmOBU6686ombLuGWZRs",
        },
      }
    );
    const imageData = await imageResponse.json();
    const imageUrl =
      imageData.photos.length > 0
        ? imageData.photos[0].src.medium
        : "https://via.placeholder.com/100";

    setRecipes([
      {
        title: searchQuery,
        totalCalories: `${totalCalories} Calories`,
        totalServingSize: `${totalServingSize}g Serving`,
        totalProtein: `${totalProtein}g Protein`,
        img: imageUrl,
      },
    ]);
    setError("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError("");
    fetchRecipes();
  };

  return (
    <div className="h-screen w-screen overflow-hidden fixed top-0 left-0 font-sans bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-[#111]">
      {/* Navbar at the top */}
      <div className="z-50 w-full">
        <Navbar />
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side */}
        <div className="w-full md:w-1/2 px-10 py-6 flex flex-col justify-center bg-white">
          <h2 className="text-xs uppercase text-gray-500 mb-1 tracking-wide">Featured</h2>
          <h1 className="text-3xl font-extrabold mb-4">
            {recipes.length > 0 ? recipes[0].title : "Search a Recipe"}
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a recipe..."
              className="px-4 py-2 w-full border rounded-md text-black"
            />
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {recipes.length > 0 && (
            <div className="grid grid-cols-3 gap-2 text-[20px]">
              {[ 
                { label: 'Size', value: recipes[0].totalServingSize },
                { label: 'Calories', value: recipes[0].totalCalories },
                { label: 'Protein', value: recipes[0].totalProtein },
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
          )}
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden relative">
          {recipes.length > 0 && (
            <>
              <img
                src={recipes[0].img}
                alt={recipes[0].title}
                className="rounded-xl shadow-lg w-[70%] aspect-square object-cover"
              />
              <button
                onClick={() => alert("View Recipe clicked!")}
                className="absolute top-3/4 left-1/2 transform -translate-x-1/2 px-6 py-2 text-sm bg-black text-white rounded-full hover:bg-[#00cfff] hover:text-black transition-colors duration-300"
              >
                View Recipe
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
