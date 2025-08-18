import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../../AuthProvider.jsx/AuhtContext";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "Cleaning Services",
  "Appliance & Electronics Services",
  "Plumbing Services",
  "Electrical Services",
  "Painting & Renovation",
  "Carpentry Services",
  "Home Shifting & Moving",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Pest & Sanitation Services",
  "Gardening & Outdoor",
  "Security & Smart Home",
];

const Addservices = () => {
  const { User, day } = useContext(AuthContext);
  const navigate = useNavigate();

  const maxChar = 100;
  const [description, setDescription] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddService = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newService = {
      imageUrl: form.imageUrl.value,
      serviceName: form.serviceName.value,
      category: form.category.value, // ✅ Category added
      price: form.price.value,
      serviceArea: form.serviceArea.value,
      description,
      provideremail: User.email,
      providerphoto: User.photoURL,
      providername: User.displayName,
    };

    try {
      const res = await axios.post(
        "https://trusty-hands-backend.vercel.app/addservice",
        newService
      );
      console.log(res.data);
      toast.success("Service Added Successfully!");

      navigate("/allservices");
      form.reset();
      setDescription("");
      setCharCount(0);
    } catch (err) {
      console.error("Error adding service:", err);
      toast.error("Failed to add service");
    }
  };

  const handleDescriptionChange = (e) => {
    const input = e.target.value;
    if (input.length <= maxChar) {
      setDescription(input);
      setCharCount(input.length);
      setErrorMessage("");
    } else {
      setErrorMessage(`Max ${maxChar} characters allowed.`);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${
        day ? "bg-black" : "bg-gray-100"
      }`}
    >
      <Helmet>
        <title>Add Service - Service Sharing</title>
      </Helmet>

      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-md ${
          day ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add New Service</h2>

        <form onSubmit={handleAddService} className="space-y-4">
          {[
            {
              name: "imageUrl",
              label: "Image URL",
              type: "text",
              placeholder: "https://...",
            },
            {
              name: "serviceName",
              label: "Service Name",
              type: "text",
              placeholder: "e.g. AC Repair",
            },
            {
              name: "price",
              label: "Price",
              type: "number",
              placeholder: "e.g. 100",
            },
            {
              name: "serviceArea",
              label: "Service Area",
              type: "text",
              placeholder: "e.g. Dhanmondi, Dhaka",
            },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  day
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>
          ))}

          {/* ✅ Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                day
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Brief service description"
              required
              className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary ${
                day
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            ></textarea>
            <div className="flex justify-between text-sm mt-1">
              <span>
                {charCount}/{maxChar}
              </span>
              {errorMessage && (
                <span className="text-red-500">{errorMessage}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={description.length > maxChar}
            className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 ${
              day
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addservices;
