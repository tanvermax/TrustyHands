import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData'; // Assuming you use this for admin check

const ServiceManagement = () => {
    // 💡 Use your hook to determine if the user is an Admin
    const { profile, loading: isAuthLoading } = useUserData();
    
    const API_BASE_URL = "https://trusty-hands-backend.vercel.app";

    const [services, setServices] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [error, setError] = useState(null);
    // State to track deletion progress
    const [isDeletingId, setIsDeletingId] = useState(null);

    // --- Core Data Fetching ---
    const fetchAllServices = async () => {
        setIsLoadingServices(true);
        setError(null);
        try {
            // NOTE: This route should be protected on the backend for Admin access only.
            const response = await axios.get(`${API_BASE_URL}/services/all`); 
            
            if (response.data.success) {
                // Assuming services are returned in response.data.data
                setServices(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch services.");
                setServices([]);
            }
        } catch (err) {
            console.error("Fetch Services Error:", err);
            setError("Could not connect to the service management API.");
        } finally {
            setIsLoadingServices(false);
        }
    };

    useEffect(() => {
        // Only fetch data once authentication is resolved and user is logged in
        if (!isAuthLoading && profile) { 
            // 💡 In a real app, add check: if (profile.role === 'Admin')
            fetchAllServices();
        }
    }, [isAuthLoading, profile]);

    // --- Action Handler: Delete Service ---
    const handleDeleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to permanently delete this service? All associated data may be lost.")) {
            return;
        }

        setIsDeletingId(serviceId);

        try {
            // Assuming your service documents use a MongoDB '_id' or a custom 'serviceId' field.
            // If the backend uses Mongo's primary '_id', the route is often /service/:_id
            const response = await axios.delete(`${API_BASE_URL}/addservice/${serviceId}`);

            if (response.data) {
                // Remove the service from the local state
                setServices(prevServices => prevServices.filter(service => service._id !== serviceId));
            } else {
                alert(`Error: ${response.data}`);
            }
        } catch (err) {
            console.error("DELETE Service Error:", err);
            alert("Failed to delete service: Server error.");
        } finally {
            setIsDeletingId(null);
        }
    };

    // --- Conditional Rendering ---
    if (isAuthLoading || isLoadingServices) {
        return <div className="text-center p-8 text-xl">Loading Service Management Data...</div>;
    }
    
    // NOTE: Add logic here to check if the profile has Admin role
    // if (profile?.role !== 'Admin') { return <div>Access Denied.</div>; }

    if (error) {
        return <div className="text-red-600 p-8 text-center text-xl">Error: {error}</div>;
    }

    if (services.length === 0) {
        return <div className="text-center p-8 text-xl text-gray-500">No services found in the system.</div>;
    }

    // --- Final Render ---
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
                Admin Service Management ({services.length} Services)
            </h1>

            <div className="shadow-lg overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map((service) => {
                            // Use MongoDB _id or a unique service field for the key and deletion ID
                            const serviceId = service._id || service.serviceId; 
                            const isDeleting = isDeletingId === serviceId;
                            
                            return (
                                <tr key={serviceId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {service.serviceName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category || 'General'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {service.price ? `$${service.price}` : 'TBD'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteService(serviceId)}
                                            disabled={isDeleting}
                                            className={`px-3 py-1 text-white text-xs rounded transition ${
                                                isDeleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete Service'}
                                        </button>
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

export default ServiceManagement;