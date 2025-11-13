import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BsMic } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../AuthProvider.jsx/AuthPovider";
import { ServiceCard } from "./Servicecrad";
import axios from "axios";
import useUserData from "../../Hook/useUserData";

// ❌ Removed the hardcoded 'categories' array

const AllService = () => {
  const { day } = useContext(AuthContext);
 

  const { profile } = useUserData();

  const data = useLoaderData(); // Initial service data (likely all services)
  console.log(profile)
  // State for the main service data
  const [loadeDAta, setData] = useState(data);
  // State for the list of unique categories fetched from the backend
  const [serviceCategories, setServiceCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 1. Fetch Service Category Names from the Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        // Use your specific backend URL here (replace with your Vercel URL if deployed)
        const response = await axios.get("https://trusty-hands-backend.vercel.app/services/names");

        // Assuming the backend returns an array of strings: ['Plumbing Services', 'Electrical Services', ...]
        setServiceCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch service categories:", error);
        // Optionally, set an error state here
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Run only once on mount

  // 2. Filtered and Sorted Services Logic (Unchanged and working well)
  const filteredServices = [...loadeDAta]
    .sort((a, b) => a.price - b.price) // Sort by price
    .filter((card) =>
      // Search filter
      search === ""
        ? true
        : card.serviceName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((card) =>
      // Category filter
      selectedCategory === "All" ? true : card.serviceName === selectedCategory
    );

  return (
    <div className="w-11/12 mx-auto max-w-7xl py-8">
      <Helmet>
        <title>All Services - Service Sharing</title>
      </Helmet>

      {/* Title + Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        <h1
          className={`text-2xl lg:text-3xl font-bold ${day ? "text-white" : "text-gray-900"
            } mb-4 lg:mb-0`}
        >
          All Services
        </h1>

        <div className="relative flex items-center w-full lg:w-auto">
          <CiSearch className="absolute left-3 text-xl text-gray-500" />
          <input
            placeholder="Search services..."
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full lg:w-80 pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${day
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
              }`}
            type="search"
          />
          <BsMic className="absolute right-3 text-blue-500" />
        </div>
      </div>

      <hr className="mb-6" />

      {/* ✅ Dynamic Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-lg font-medium transition ${selectedCategory === "All"
            ? "bg-blue-600 text-white" // Used blue-600 as a placeholder for 'primary'
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          All Categories
        </button>

        {loadingCategories ? (
          <p className="px-4 py-2 text-gray-500">Loading categories...</p>
        ) : (
          serviceCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${selectedCategory === cat
                ? "bg-blue-600 text-white" // Used blue-600 as a placeholder for 'primary'
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {cat}
            </button>
          ))
        )}
      </div>

      <hr className="mb-6" />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((card) => (
          <ServiceCard userArea={profile?.area} key={card._id} card={card} day={day} />
        ))}
      </div>

      {/* If no service */}
      {filteredServices.length === 0 && (
        <p className="text-center text-xl font-medium text-gray-500 mt-10">
          No services found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default AllService;