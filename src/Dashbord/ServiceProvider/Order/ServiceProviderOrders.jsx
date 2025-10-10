import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData';

const ServiceProviderOrders = () => {
    // Destructure profile and its loading state
    const { profile, loading: isAuthLoading } = useUserData();

    
    const [orders, setOrders] = useState([]);
    // Combine loading states: Use a local state for order fetching
    const [isLoadingOrders, setIsLoadingOrders] = useState(false); 
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://trusty-hands-backend.vercel.app'; // Replace with your live API URL

    // --- 1. Fetch Orders ---
    const fetchOrders = async () => {
        // Prevent fetching if no email is available yet
        if (!profile || !profile.email) {
            return; 
        }

        setIsLoadingOrders(true);
        setError(null);
        try {
            // Use the existing GET /order API with the serviceprovideremail query parameter
            const response = await axios.get(`${API_BASE_URL}/order?email2=${profile.email}`, {
                withCredentials: true // Important for sending the JWT cookie
            });
            
            // Assuming the existing /order API returns an array directly:
            setOrders(response.data); 
            
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Check network and authorization.");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        // Only fetch orders if the profile is NOT loading AND the email is available
        if (!isAuthLoading && profile && profile.email) {
            fetchOrders();
        }
        // Dependency array ensures this runs when profile data becomes available
    }, [isAuthLoading, profile]); 

    // --- 2. Action Handlers (Remaining handlers are correct in logic) ---

    // Handler for 'Take Order' (Pending -> In Progress)
    const handleTakeOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to take this order? Status will change to 'In Progress'.")) {
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/order/take/${orderId}`, {}, {
                withCredentials: true
            });

            if (response.data) {
                alert(response.data);
                fetchOrders(); // Refresh the list
            } else {
                alert(`Error: ${response.data}`);
            }
        } catch (err) {
            console.error("Take order error:", err);
            alert("Failed to update status. Check server connection.");
        }
    };

    // Handler for 'Complete Order' (In Progress -> Completed)
  // Handler for 'Complete Order' (In Progress -> Completed)
const handleCompleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to mark this order as 'Completed'?")) {
        return;
    }
    
    try {
        const orderToUpdate = orders.find(o => o.orderid === orderId);
        
        if (!orderToUpdate) {
            return alert("Order not found in local list.");
        }

        let mongoObjectId;

        // **FIXED LOGIC HERE**
        // 1. Check for the nested {$oid: "..."} format (if your DB returns it this way)
        if (orderToUpdate._id && typeof orderToUpdate._id === 'object' && orderToUpdate._id.$oid) {
            mongoObjectId = orderToUpdate._id.$oid;
        } 
        // 2. Assume it's a simple string ID (the most common format)
        else if (typeof orderToUpdate._id === 'string') {
            mongoObjectId = orderToUpdate._id;
        }
        // 3. Fallback for error
        else {
            console.error("Missing or invalid MongoDB _id format:", orderToUpdate);
            return alert("Order data incomplete. Cannot complete order (Missing ID).");
        }
        
        const response = await axios.put(`${API_BASE_URL}/order/${mongoObjectId}`, { 
            serviceStatus: 'Completed' 
        }, {
            withCredentials: true
        });
        
        if (response.data) {
            alert(`Order ${orderId} marked as Completed!`);
            fetchOrders(); // Refresh the list
        } else {
            alert(`Error: Failed to get successful response data.`);
        }
    } catch (err) {
        console.error("Complete order error:", err);
        alert("Failed to complete order. Check server connection.");
    }
};

    // Handler for 'Cancel Order' (Provider initiated)
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
                fetchOrders(); // Refresh the list
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Cancel order error:", err);
            alert("Failed to cancel order. Check server connection.");
        }
    };

    // --- 3. Render Logic ---
    // Handle the combined loading states
    if (isAuthLoading || isLoadingOrders) {
        return <div className="text-center py-10">Loading orders...</div>;
    }
    
    // Handle case where profile data is loaded but is not valid (e.g., no email)
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.orderid}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.servicename}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.ordergivenuseremail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.serviceDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.serviceStatus === 'Completed' ? 'bg-green-100 text-green-800' :
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
                                            <button 
                                                onClick={() => handleTakeOrder(order.orderid)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-2 border border-indigo-600 px-3 py-1 rounded text-xs"
                                            >
                                                Take Order
                                            </button>
                                        )}
                                        {order.serviceStatus === 'In Progress' && (
                                            <>
                                                <button 
                                                    onClick={() => handleCompleteOrder(order.orderid)}
                                                    className="text-green-600 hover:text-green-900 mr-2 border border-green-600 px-3 py-1 rounded text-xs"
                                                >
                                                    Complete
                                                </button>
                                                <button 
                                                    onClick={() => handleCancelOrder(order.orderid)}
                                                    className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {/* No action buttons for Completed or Cancelled orders */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ServiceProviderOrders;