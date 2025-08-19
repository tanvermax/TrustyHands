import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../Provider/useAuth";

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
  const { User, day } = useAuth();
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
      category: form.category.value,
      price: form.price.value,
      serviceArea: form.serviceArea.value,
      description,
      provideremail: User.email,
      providerphoto: User.photoURL,
      providername: User.displayName,
    };

    try {
      await axios.post("https://trusty-hands-backend.vercel.app/addservice", newService);
      toast.success("Service Added Successfully!");
      form.reset();
      setDescription("");
      setCharCount(0);
      navigate("/allservices");
    } catch (err) {
      console.error(err);
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
    <div className={` flex items-start justify-center py-10 px-6 ${day ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <Helmet>
        <title>Add Service - Service Sharing</title>
      </Helmet>

      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Service</h2>

        <form onSubmit={handleAddService} className="space-y-5 w-full">
          {[
            { name: "imageUrl", label: "Image URL", type: "text", placeholder: "https://..." },
            { name: "serviceName", label: "Service Name", type: "text", placeholder: "e.g. AC Repair" },
            { name: "price", label: "Price ($)", type: "number", placeholder: "e.g. 100" },
            { name: "serviceArea", label: "Service Area", type: "text", placeholder: "e.g. Dhanmondi, Dhaka" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col w-full">
              <label className="mb-1 font-medium">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                required
                className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  day ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>
          ))}

          {/* Category */}
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium">Category</label>
            <select
              name="category"
              required
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                day ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium">Description</label>
            <textarea
              name="description"
              rows="4"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Brief service description"
              required
              className={`w-full px-4 py-2 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                day ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
              }`}
            ></textarea>
            <div className="flex justify-between mt-1 text-sm">
              <span>{charCount}/{maxChar}</span>
              {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={description.length > maxChar}
            className={`w-full py-3 rounded-md font-semibold text-lg transition-colors duration-200 ${
              day ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-700 hover:bg-indigo-800 text-white"
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
