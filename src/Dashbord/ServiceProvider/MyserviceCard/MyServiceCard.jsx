import React from "react";

const MyServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-105">
      {/* Category Badge */}
      <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium z-10">
        {service.category}
      </div>

      {/* Service Image */}
      <img
        src={service.imageUrl}
        alt={service.serviceName}
        className="w-full h-48 object-cover"
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Service Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          {service.serviceName}
        </h2>

        {/* Description */}
        <p className="text-gray-500 line-clamp-3">{service.description}</p>

        {/* Price & Area */}
        <div>
          <p className="text-lg font-bold text-indigo-600">${service.price}</p>
          <p className="text-sm text-gray-600">📍 {service.serviceArea}</p>
        </div>

        {/* Provider Info */}
        <div className="flex items-center gap-3">
          <img
            src={service.providerphoto}
            alt={service.providername}
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="text-sm font-medium">{service.providername}</p>
            <p className="text-xs text-gray-500">{service.provideremail}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onEdit(service._id)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyServiceCard;
