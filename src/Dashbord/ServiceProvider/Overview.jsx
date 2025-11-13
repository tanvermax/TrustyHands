// ServiceOverview.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import useUserData from "../../Hook/useUserData";
import ProviderTransactions from "./ProviderTransactions";

const API_BASE_URL = 'https://trusty-hands-backend.vercel.app'; // Match your backend URL

const ServiceOverview = () => {
  const { profile, loading: isAuthLoading } = useUserData();
  
  const [dashboardData, setDashboardData] = useState({
    totalServices: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalEarnings: '0.00',
    recentOrders: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    // Only attempt to fetch if profile data is loaded and email is available
    if (!profile || !profile.email) {
      setIsLoading(false);
      return; 
    }

    setIsLoading(true);
    setError(null);
    try {
      // The API uses the JWT token for authentication and getting the email
      const response = await axios.get(`${API_BASE_URL}/service-provider/dashboard/${profile.email}`, {
        withCredentials: true
      });

      if (response.data.success) {
        const data = response.data.data;
        setDashboardData({
            totalServices: data.totalServices,
            activeOrders: data.activeOrders,
            completedOrders: data.completedOrders,
            totalEarnings: data.totalEarnings,
            recentOrders: data.recentOrders,
        });
      } else {
        setError("Failed to fetch dashboard data: " + response.data.message);
      }
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError("Failed to load dashboard data. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch when profile is loaded (or reloads)
    if (!isAuthLoading && profile?.email) {
        fetchDashboardData();
    }
  }, [isAuthLoading, profile]);

  if (isAuthLoading || isLoading) {
    return <div className="p-6 text-center text-lg">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg text-red-600">Error: {error}</div>;
  }
  
  const stats = [
    { title: "Total Services", value: dashboardData.totalServices, color: "bg-blue-50" },
    { title: "Active Orders", value: dashboardData.activeOrders, color: "bg-yellow-50" },
    { title: "Completed Orders", value: dashboardData.completedOrders, color: "bg-green-50" },
    { title: "Earnings (USD)", value: `$${dashboardData.totalEarnings}`, color: "bg-indigo-50" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Service Provider Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-6 rounded-xl shadow border border-gray-100 transition duration-200`}
          >
            <h2 className="text-gray-600 font-medium">{stat.title}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Recent Orders Table */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        
        {dashboardData.recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders found.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-4 border-b text-xs font-semibold text-gray-600 uppercase">Service</th>
                            <th className="py-3 px-4 border-b text-xs font-semibold text-gray-600 uppercase">Client Email</th>
                            <th className="py-3 px-4 border-b text-xs font-semibold text-gray-600 uppercase">Date</th>
                            <th className="py-3 px-4 border-b text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="py-3 px-4 border-b text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.recentOrders.map((order, index) => (
                            <tr key={order.orderid || index} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b text-sm font-medium text-gray-900">{order.servicename}</td>
                                <td className="py-3 px-4 border-b text-sm text-gray-600">{order.ordergivenuseremail}</td>
                                <td className="py-3 px-4 border-b text-sm text-gray-600">{order.serviceDate}</td>
                                <td className="py-3 px-4 border-b text-sm">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        order.serviceStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                        order.serviceStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        order.serviceStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {order.serviceStatus}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-b text-sm font-semibold">${order.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
      <div>
        <ProviderTransactions/>
      </div>
    </div>
  );
};

export default ServiceOverview;