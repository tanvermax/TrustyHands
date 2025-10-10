// Hook/useNotifications.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from './useUserData';

const API_BASE_URL = 'https://trusty-hands-backend.vercel.app'; 

// Function to determine the correct notification endpoint based on role
const getEndpoint = (role,email) => {

    if (role === 'superadmin') return `${API_BASE_URL}/notifications/admin`;
    if (role === 'serviceProvider') return `${API_BASE_URL}/notifications/provider/${email}`;
    if (role === 'user') return `${API_BASE_URL}/notifications/user/${email}`;
    return null;
};

const useNotifications = (role, email) => {

    const { profile, loading: isAuthLoading } = useUserData();

    const [counts, setCounts] = useState({});
    const [isNotificationLoading, setIsNotificationLoading] = useState(true);

    const fetchCounts = async () => {
        const endpoint = getEndpoint(role,profile?.email);
        if (!endpoint || !email) {
            setIsNotificationLoading(false);
            return;
        }

        setIsNotificationLoading(true);
        try {
            const response = await axios.get(endpoint, {
                withCredentials: true,
            });
            
            if (response.data.success) {
                // The key of the count should match the 'to' path component (e.g., 'orders' for '/dashboard/orders')
                setCounts(response.data.counts);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setCounts({}); // Clear counts on error
        } finally {
            setIsNotificationLoading(false);
        }
    };

    useEffect(() => {
        if (role && email) {
            fetchCounts();
            
            // Optional: Refresh counts every 60 seconds (or use WebSockets for real-time)
            const interval = setInterval(fetchCounts, 60000); 
            return () => clearInterval(interval);
        }
    }, [role, email]);

    return { counts, isNotificationLoading, refreshCounts: fetchCounts };
};

export default useNotifications;