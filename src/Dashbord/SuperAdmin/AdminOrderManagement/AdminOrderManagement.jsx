import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import useUserData from '../../../Hook/useUserData';

// Adjusted path to resolve compile error

const AdminOrderManagement = () => {
    // 💡 Assume this hook checks if the logged-in user is an Admin/Superadmin
    const { profile, loading: isAuthLoading } = useUserData();
    
    // NOTE: Always use https for production environments
    const API_BASE_URL = "https://trusty-hands-backend.vercel.app";

    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // Custom message state for success/error

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
                setError("Failed to fetch orders.");
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


    // --- New Action Handler: Pay Service Provider ---
    const handlePayToProvider = async (order) => {
        const orderId = order._id?.$oid || order._id;
        
        if (!orderId) {
            setMessage({ type: 'error', text: 'Error: Order ID not found.' });
            return;
        }

        const confirmation = window.confirm(
            `CONFIRM PAYOUT: Are you sure you want to release $${order.cost} (Gross) to the provider ${order.serviceprovideremail}?`
        );

        if (!confirmation) return;

        try {
            // This PATCH route will calculate the fee and update the escrow status
            const response = await axios.patch(`${API_BASE_URL}/order/pay/${orderId}`, {}, {
                withCredentials: true 
            });

            if (response.data.success) {
                setMessage({ type: 'success',
                     text: response.data.message });
                fetchAllOrders(); // Refresh the data
            } else {
                console.log(response)
                setMessage({ type: 'error', text:
                     response  });
            }
        } catch (err) {
            console.error("Payout Error:", err);
            setMessage({ type: 'error', 
                text: `Failed to process payment. Check server connection.` });
        }
    };

console.log("orders",orders)
    // Helper function for status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper function for escrow status styling
    const getEscrowStyle = (status) => {
        if (status === 'PaidToProvider') {
            return 'bg-teal-100 text-teal-800 border-teal-500';
        }
        if (status === 'HeldByPlatform') {
            return 'bg-orange-100 text-orange-800 border-orange-500';
        }
        return 'bg-gray-100 text-gray-800 border-gray-500';
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

            {/* Custom Message Box */}
            {message && (
                <div className={`flex items-center p-4 mb-4 rounded-lg shadow-md ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <XCircle className="w-5 h-5 mr-3" />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}
            
            <div className="shadow-lg overflow-x-auto border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escrow</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => {
                            const uniqueId = order._id?.$oid || order._id;
                            const isPayable = order.serviceStatus === 'Completed' && order.escrowStatus === 'HeldByPlatform';

                            return (
                                <tr key={uniqueId}>
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
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-md border ${getEscrowStyle(order.escrowStatus)}`}>
                                            {order.escrowStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {isPayable ? (
                                            <button 
                                                onClick={() => handlePayToProvider(order)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs font-medium shadow transition-colors"
                                            >
                                                Pay Provider
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">
                                                {order.serviceStatus === 'Completed' ? 'Paid' : 'Awaiting Completion'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderManagement;