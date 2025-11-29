import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData';

const Order = () => {
    const { 
        profile, 
        loading: isProfileLoading, 
        error: profileError        
    } = useUserData();

    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [orderError, setOrderError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(null); 
    const [isDeleting, setIsDeleting] = useState(null); // NEW: State for deletion

    // --- EFFECT: Fetch Orders (Unchanged) ---
    useEffect(() => {
        if (profile && profile.email) {
            const fetchOrders = async () => {
                // ... (Order fetching logic remains the same)
                try {
                    setIsLoadingOrders(true);
                    setOrderError(null);
                    const userEmail = profile.email;
                    const response = await axios.get(`https://trusty-hands-backend.vercel.app/order/${userEmail}`); 
                    
                    if (response.data.success) {
                        setOrders(response.data.data);
                    } else {
                        setOrders([]);
                    }
                } catch (err) {
                    console.error("Error fetching orders:", err);
                    setOrderError("Failed to load user orders.");
                    setOrders([]);
                } finally {
                    setIsLoadingOrders(false);
                }
            };
            fetchOrders();
        } else if (!isProfileLoading) {
            setIsLoadingOrders(false);
        }
    }, [profile, isProfileLoading]); 

    // --- Handle Cancel Order Function (from previous answer) ---
   const handleCancelOrder = async (orderId) => {
    setIsUpdating(orderId);
    try {
        const response = await axios.put(
            `https://trusty-hands-backend.vercel.app/order/cancel/${orderId}`
        );

        if (response.data.success) {
            setOrders(prev =>
                prev.map(o =>
                    o._id === orderId
                        ? { ...o, serviceStatus: "Cancelled" }
                        : o
                )
            );
        }
    } catch (err) {
        console.error(err);
        alert("Cancel failed!");
    } finally {
        setIsUpdating(null);
    }
};

    
    // --- NEW: Handle Delete Order Function ---
   const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    setIsDeleting(orderId);

    try {
        const response = await axios.delete(`https://trusty-hands-backend.vercel.app/order/delete/${orderId}`);

        if (response.data.success) {
            setOrders(prev => prev.filter(order => order._id !== orderId));
        }
    } catch (error) {
        console.error("Deletion error:", error);
        alert("Failed to delete order.");
    } finally {
        setIsDeleting(null);
    }
};


    // --- RENDER LOGIC (Unchanged checks) ---
    if (isProfileLoading) { return <div className="text-center p-8">Loading user profile...</div>; }
    if (profileError) { return <div className="text-red-600 p-8">Error loading profile: {profileError.message || 'Check connection.'}</div>; }
    if (!profile || !profile.email) { return <div className="text-center p-8">User profile data is unavailable. Please log in.</div>; }
    if (isLoadingOrders) { return <div className="text-center p-8">Loading user orders...</div>; }
    if (orderError) { return <div className="text-red-600 p-8">Error loading orders: {orderError}</div>; }
    
    // --- Final Render ---
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Orders for: {profile.email}</h1>
            
            {orders.length === 0 ? (
                <p className="text-gray-500">You have no orders yet.</p>
            ) : (
                <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => {
                        const isCancellable = order.serviceStatus === 'Pending';
                        const isCurrentOrderUpdating = isUpdating === order.orderid;
                        const isCurrentOrderDeleting = isDeleting === order.orderid;
                        // Allow delete if Pending or Cancelled (adjust as your policy requires)
                        const isDeletable = order.serviceStatus === 'Pending' || order.serviceStatus === 'Cancelled'; 

                        return (
                            <div key={order._id} className="border p-4 rounded shadow-md bg-white">
                                <h2 className="text-xl font-semibold text-indigo-600">{order.servicename}</h2>
                                <p className="text-sm text-gray-700">Status: <span className={`font-medium ${order.serviceStatus === 'Cancelled' ? 'text-red-500' : 'text-green-600'}`}>{order.serviceStatus}</span></p>
                                <p className="text-lg font-normal mt-1">serviceprovideremail: {order.serviceprovideremail}</p>
                                <p className="text-lg font-bold mt-1">Cost: ${order.cost}</p>
                                <p className="text-lg text-red-500 mt-1">deadline: {order.serviceDate}</p>

                                <div className=" mt-4 pt-4 border-t flex space-x-3">
                                    {/* CANCEL Button */}
                                    {isCancellable && (
                                        <button 
                                            onClick={() => handleCancelOrder(order._id)}
                                            disabled={isCurrentOrderUpdating}
                                            className={`py-2 px-4 rounded font-semibold transition duration-300 ${
                                                isCurrentOrderUpdating 
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                            }`}
                                        >
                                            {isCurrentOrderUpdating ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    )}
                                    
                                    {/* DELETE Button (NEW) */}
                                    {isDeletable && (
                                        <button 
                                            onClick={() => handleDeleteOrder(order._id)}
                                            disabled={isCurrentOrderDeleting}
                                            className={`py-2 px-4 rounded font-semibold transition duration-300 ${
                                                isCurrentOrderDeleting 
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                            }`}
                                        >
                                            {isCurrentOrderDeleting ? 'Deleting...' : 'Delete Order'}
                                        </button>
                                    )}

                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default Order;