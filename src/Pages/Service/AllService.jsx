import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BsMic } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { Link, useLoaderData } from "react-router-dom";
import AuthContext from "../../AuthProvider.jsx/AuhtContext";

export const ServiceCard = ({ card, day }) => {
  return (
    <div className="bg-gradient-to-br from-[#fafafa] to-[#5f615f44] rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-xl">
        <img
          className="w-full h-60 object-cover rounded-xl border border-gray-700"
          src={card.imageUrl}
          alt={card.serviceName}
        />
        <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {card.serviceArea}
        </div>
        <div className="absolute top-3 right-3 bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full">
          ${card.price}
        </div>
      </div>

      <div className="mt-4 px-1">
        <h3 className="text-lg font-bold text-white truncate">{card.serviceName}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{card.description}</p>

        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full border-2 border-primary"
              src={card.providerphoto}
              alt={card.providername}
            />
            <span className="text-sm text-gray-300">{card.providername}</span>
          </div>
        </div>

        <Link to={`/addservice/${card._id}`}>
          <button className="w-full mt-5 bg-primary text-white py-2 rounded-xl font-semibold hover:bg-primary-dark transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};


const AllService = () => {
  const { day } = useContext(AuthContext);
  const data = useLoaderData();
  const [loadeDAta, setData] = useState(data);
  const [search, setSearch] = useState("");

  return (
    <div className="w-11/12 mx-auto max-w-7xl py-8">
      <Helmet>
        <title>All Services - Service Sharing</title>
      </Helmet>

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
            className={`w-full lg:w-80 pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${day ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
              }`}
            type="search"
          />
          <BsMic className="absolute right-3 text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...loadeDAta]
          .sort((a, b) => a.price - b.price)
          .filter((card) =>
            search === ""
              ? true
              : card.serviceName.toLowerCase().includes(search.toLowerCase())
          )
          .map((card) => (
            <ServiceCard key={card._id} card={card} day={day} />
          ))}
      </div>
    </div>
  );
};

export default AllService;