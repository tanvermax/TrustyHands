import React, { useEffect, useState } from "react";
import useAuth from "../../Provider/useAuth";
import axios from "axios";
import MyServiceCard from "./MyserviceCard/MyServiceCard";

const MyServices = () => {
  const { User } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (User?.email) {
      axios
        .get(`https://trusty-hands-backend.vercel.app/addservice?email=${User.email}`)
        .then((response) => setData(response.data))
        .catch((err) => console.error(err));
    }
  }, [User]);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (confirmed) {
      setData(data.filter((service) => service._id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for service ID: ${id} goes here`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((service) => (
          <MyServiceCard
            key={service._id}
            service={service}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyServices;
