import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData'; // For Admin check

const AdminOrderManagement = () => {
    // 💡 Assume this hook checks if the logged-in user is an Admin/Superadmin
    const { profile, loading: isAuthLoading } = useUserData();
    
    const API_BASE_URL = "https://trusty-hands-backend.vercel.app";

    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [error, setError] = useState(null);

    // --- Core Data Fetching ---
    const fetchAllOrders = async () => {
        setIsLoadingOrders(true);
        setError(null);
        try {
            // NOTE: This route should be protected on the backend for Admin access only.
            const response = await axios.get(`${API_BASE_URL}/order`);
            
            if (response.data) {
                setOrders(response.data);
            } else {
                setError(response.data || "Failed to fetch orders.");
                setOrders([]);
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
            setError("Could not connect to the order management API.");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        // Only fetch data if authentication is complete and the user is authorized
        if (!isAuthLoading && profile) { 
            // 💡 In a real app, add check: if (profile.role === 'Admin')
            fetchAllOrders();
        }
    }, [isAuthLoading, profile]);


    // Helper function for status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    // --- Conditional Rendering ---
    if (isAuthLoading || isLoadingOrders) {
        return <div className="text-center p-8 text-xl">Loading Order Management Data...</div>;
    }
    
    if (error) {
        return <div className="text-red-600 p-8 text-center text-xl">Error: {error}</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center p-8 text-xl text-gray-500">No orders found in the system.</div>;
    }

    // --- Final Render ---
    return (
        <div className="p-6 md:p-10 max-w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
                All Customer Orders ({orders.length})
            </h1>

            <div className="shadow-lg overflow-x-auto border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.orderid}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.servicename}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.ordergivenuseremail}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.serviceprovideremail || 'Unassigned'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                                    ${order.cost}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.serviceStatus)}`}>
                                        {order.serviceStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.serviceDate}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <button 
                                        onClick={() => alert(`Instructions: ${order.instruction}`)}
                                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                                    >
                                        View Instructions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderManagement;