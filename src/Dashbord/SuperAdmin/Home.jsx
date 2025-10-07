import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaShoppingCart, FaServicestack } from "react-icons/fa";

const SuperAdminHome= () => {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    orders: [],
    services: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("https://trusty-hands-backend.vercel.app/dashboard-data", { withCredentials: true });
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  
  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading dashboard data...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Welcome to SuperAdmin Dashboard Overview</h1>
      <hr />
      <br />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center">
          <FaUsers className="text-4xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-2xl">{dashboardData.users.length}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center">
          <FaShoppingCart className="text-4xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-2xl">{dashboardData.orders.length}</p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center">
          <FaServicestack className="text-4xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Services</h2>
            <p className="text-2xl">{dashboardData.services.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHome;
