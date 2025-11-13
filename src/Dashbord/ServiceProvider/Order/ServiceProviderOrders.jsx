import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData';

const ServiceProviderOrders = () => {
    const { profile, loading: isAuthLoading } = useUserData();
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://trusty-hands-backend.vercel.app';

    // Function to check if service time has expired
    const isServiceTimeExpired = (serviceDate) => {
        const now = new Date();
        const serviceDateTime = new Date(serviceDate);
        return now > serviceDateTime;
    };

    // Function to check if service time is within valid range (between bookedAt and serviceDate)
    const isTakeOrderAvailable = (bookedAt, serviceDate) => {
        const now = new Date();
        const bookedTime = new Date(bookedAt);
        const serviceTime = new Date(serviceDate);
        
        // Allow taking order from booking time until service time
        return now >= bookedTime && now <= serviceTime;
    };

    // Function to get time remaining until service
    const getTimeRemaining = (serviceDate) => {
        const now = new Date();
        const serviceTime = new Date(serviceDate);
        const timeDiff = serviceTime - now;
        
        if (timeDiff <= 0) return "Time Expired";
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m remaining`;
    };

    const fetchOrders = async () => {
        if (!profile || !profile.email) {
            return;
        }

        setIsLoadingOrders(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/order?email2=${profile.email}`, {
                withCredentials: true
            });
            setOrders(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Check network and authorization.");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (!isAuthLoading && profile && profile.email) {
            fetchOrders();
        }
    }, [isAuthLoading, profile]);

    // --- Action Handlers (unchanged) ---
    const handleTakeOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to take this order? Status will change to 'In Progress'.")) {
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/order/take/${orderId}`, {}, {
                withCredentials: true
            });

            if (response.data) {
                console.log(response)
                alert(response.data.message);
                fetchOrders();
            } else {
                alert(`Error: ${response.data}`);
            }
        } catch (err) {
            console.error("Take order error:", err);
            alert("Failed to update status. Check server connection.");
        }
    };

    const handleCompleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to mark this order as 'Completed'?")) {
            return;
        }

        try {
            const orderToUpdate = orders.find(o => o._id === orderId);

            if (!orderToUpdate) {
                return alert("Order not found in local list.");
            }

            let mongoObjectId;

            if (orderToUpdate._id && typeof orderToUpdate._id === 'object' && orderToUpdate._id.$oid) {
                mongoObjectId = orderToUpdate._id.$oid;
            }
            else if (typeof orderToUpdate._id === 'string') {
                mongoObjectId = orderToUpdate._id;
            }
            else {
                console.error("Missing or invalid MongoDB _id format:", orderToUpdate);
                return alert("Order data incomplete. Cannot complete order (Missing ID).");
            }

            const response = await axios.put(`${API_BASE_URL}/order/complete/provider/${mongoObjectId}`, {
                serviceStatus: 'Completed'
            }, {
                withCredentials: true
            });

            if (response.data) {
                alert(`Order ${orderId} marked as Completed!`);
                fetchOrders();
            } else {
                alert(`Error: Failed to get successful response data.`);
            }
        } catch (err) {
            console.error("Complete order error:", err);
            alert("Failed to complete order. Check server connection.");
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("WARNING: Are you sure you want to CANCEL this order?")) {
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/order/cancel-provider/${orderId}`, {}, {
                withCredentials: true
            });

            if (response.data.success) {
                alert(response.data.message);
                fetchOrders();
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Cancel order error:", err);
            alert("Failed to cancel order. Check server connection.");
        }
    };

    // --- Render Logic ---
    if (isAuthLoading || isLoadingOrders) {
        return <div className="text-center py-10">Loading orders...</div>;
    }

    if (!profile || !profile.email) {
        return <div className="text-center py-10 text-red-600">User profile not found or not authenticated.</div>;
    }

    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Your Service Orders</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">You have no orders assigned yet.</p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => {
                                const canTakeOrder = isTakeOrderAvailable(order.bookedAt, order.serviceDate);
                                const isExpired = isServiceTimeExpired(order.serviceDate);
                                const timeRemaining = getTimeRemaining(order.serviceDate);
                                
                                return (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {new Date(order.bookedAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(order.bookedAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.servicename}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.ordergivenuseremail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.serviceDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.serviceDate).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit',
                                                hour12: true 
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${
                                                isExpired ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {timeRemaining}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.cost}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.serviceStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    order.serviceStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        order.serviceStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.serviceStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {/* Conditionally render action buttons */}
                                            {order.serviceStatus === 'Pending' && (
                                                <>
                                                    {canTakeOrder ? (
                                                        <button
                                                            onClick={() => handleTakeOrder(order._id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-2 border border-indigo-600 px-3 py-1 rounded text-xs"
                                                        >
                                                            Take Order
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">
                                                            {isExpired ? 'Time Expired' : 'Not available yet'}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {order.serviceStatus === 'In Progress' && (
                                                <>
                                                    <button
                                                        onClick={() => handleCompleteOrder(order._id)}
                                                        className="text-green-600 hover:text-green-900 mr-2 border border-green-600 px-3 py-1 rounded text-xs"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ServiceProviderOrders;