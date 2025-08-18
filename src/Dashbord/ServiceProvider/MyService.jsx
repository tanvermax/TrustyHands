// MyServices.jsx
import React, { useState } from "react";

const MyServices = () => {
  // Example data - replace with API data later
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Web Design",
      description: "Professional website design services",
      price: 300,
      status: "Active",
    },
    {
      id: 2,
      title: "Logo Design",
      description: "Creative logo design for your brand",
      price: 100,
      status: "Active",
    },
    {
      id: 3,
      title: "SEO Optimization",
      description: "Improve your website ranking on Google",
      price: 200,
      status: "Inactive",
    },
  ]);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this service?");
    if (confirmed) {
      setServices(services.filter((service) => service.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for service ID: ${id} goes here`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-gray-500 mt-2">{service.description}</p>
            <p className="mt-2 font-bold">Price: ${service.price}</p>
            <p
              className={`mt-1 font-medium ${
                service.status === "Active" ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {service.status}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(service.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyServices;
