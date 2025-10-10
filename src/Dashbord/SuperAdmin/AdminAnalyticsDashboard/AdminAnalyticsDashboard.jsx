import React, { useState, useEffect } from 'react';
// Assuming you have an instance of axios configured to handle cookies and base URL
import axios from 'axios'; 
import { FaUsers, FaTools, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUserTie } from 'react-icons/fa';

const AdminAnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch data from the new API
    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Replace with your actual backend URL
            const response = await axios.get('https://trusty-hands-backend.vercel.app/analytics/summary'); 
            if (response.data.success) {
                setAnalyticsData(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch data.');
            }
        } catch (err) {
            console.error(err);
            // Handle specific errors like 401 Unauthorized for JWT
            setError('Error connecting to the API or unauthorized access.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    if (loading) return <div className="text-center py-10">Loading Analytics...</div>;
    if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
    if (!analyticsData) return <div className="text-center py-10">No analytics data available.</div>;

    // Destructure data for easier use
    const { 
        totalUsers, totalServices, totalOrders, totalServiceRequests,
        openOrders, completedOrders, cancelledOrders,
        serviceProviders, regularUsers 
    } = analyticsData;

    // Array of metrics for easy rendering (using Tailwind CSS classes conceptually)
    const metrics = [
        { icon: FaUsers, label: "Total Users", value: totalUsers, color: "bg-blue-100 text-blue-800" },
        { icon: FaUserTie, label: "Service Providers", value: serviceProviders, color: "bg-purple-100 text-purple-800" },
        { icon: FaTools, label: "Total Services", value: totalServices, color: "bg-green-100 text-green-800" },
        { icon: FaHourglassHalf, label: "Open Orders", value: openOrders, color: "bg-yellow-100 text-yellow-800" },
        { icon: FaCheckCircle, label: "Completed Orders", value: completedOrders, color: "bg-teal-100 text-teal-800" },
        { icon: FaTimesCircle, label: "Cancelled Orders", value: cancelledOrders, color: "bg-red-100 text-red-800" },
        { icon: FaTools, label: "Total Requests", value: totalServiceRequests, color: "bg-indigo-100 text-indigo-800" },
        { icon: FaUsers, label: "Regular Users", value: regularUsers, color: "bg-gray-100 text-gray-800" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>
            
            {/* Add sections for charts here, e.g., a simple bar chart showing order status distribution */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Order Status Distribution</h2>
                {/* Placeholder for a Chart component (e.g., using Chart.js or Recharts) */}
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                    [Chart Component Placeholder: Open vs Completed vs Cancelled Orders]
                </div>
            </div>
        </div>
    );
};

// Simple reusable card component for better structure
const MetricCard = ({ icon: Icon, label, value, color }) => (
    <div className={`p-5 rounded-xl shadow-lg flex items-center justify-between ${color}`}>
        <div>
            <div className="text-sm font-medium opacity-80">{label}</div>
            <div className="text-4xl font-extrabold">{value}</div>
        </div>
        <Icon className="text-5xl opacity-50" />
    </div>
);

export default AdminAnalyticsDashboard;