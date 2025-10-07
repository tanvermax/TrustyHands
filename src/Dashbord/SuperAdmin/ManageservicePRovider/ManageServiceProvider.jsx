import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData'; // Your existing hook

const ManageServiceProvider = () => {
    // 💡 Assume this hook checks if the logged-in user is a Superadmin
    const { profile, loading: isAuthLoading } = useUserData();
    
    const API_BASE_URL = "https://trusty-hands-backend.vercel.app";

    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [error, setError] = useState(null);
    // State to track actions in progress
    const [actionInProgress, setActionInProgress] = useState({ id: null, type: null });

    // --- Core Data Fetching ---
    const fetchAllUsers = async () => {
        setIsLoadingUsers(true);
        setError(null);
        try {
            // NOTE: Ensure your backend protects this route (e.g., /users/all) 
            // so only Superadmins can access it.
            const response = await axios.get(`${API_BASE_URL}/sprovider`);
            if (response.data) {
                setUsers(response.data);
            } else {
                setError(response.data.message || "Failed to fetch users.");
                setUsers([]);
            }
        } catch (err) {
            console.error("Fetch Users Error:", err);
            setError("Could not connect to the user management API.");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        // Only fetch data if authentication is complete and the user is authorized
        // NOTE: Add a check for profile?.role === 'Superadmin' here in a real app
        if (!isAuthLoading && profile) { 
            fetchAllUsers();
        }
    }, [isAuthLoading, profile]);

    // --- Action Handlers ---

    const handleUpdateStatus = async (userEmail, currentStatus) => {
        const newStatus = !currentStatus;
        const actionType = newStatus ? 'BLOCK' : 'UNBLOCK';
        
        setActionInProgress({ id: userEmail, type: actionType });

        try {
            const response = await axios.put(`${API_BASE_URL}/user/status/${userEmail}`, {
                isBlocked: newStatus
            });

            if (response.data.success) {
                // Update local state: find the user by email and toggle the isBlocked status
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.email === userEmail ? { ...user, isBlocked: newStatus } : user
                    )
                );
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (err) {
            console.error(`${actionType} Error:`, err);
            alert(`Failed to ${actionType.toLowerCase()} user: Server error.`);
        } finally {
            setActionInProgress({ id: null, type: null });
        }
    };

    const handleDeleteUser = async (userEmail) => {
        if (!window.confirm(`Are you absolutely sure you want to permanently delete user: ${userEmail}?`)) {
            return;
        }

        setActionInProgress({ id: userEmail, type: 'DELETE' });

        try {
            const response = await axios.delete(`${API_BASE_URL}/user/delete/${userEmail}`);

            if (response.data.success) {
                // Remove the user from the local state
                setUsers(prevUsers => prevUsers.filter(user => user.email !== userEmail));
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (err) {
            console.error("DELETE Error:", err);
            alert("Failed to delete user: Server error.");
        } finally {
            setActionInProgress({ id: null, type: null });
        }
    };

    // --- Conditional Rendering ---

    if (isAuthLoading || isLoadingUsers) {
        return <div className="text-center p-8 text-xl">Loading service provider Management Data...</div>;
    }
    
    // NOTE: Add logic here to check if the profile has Superadmin role
    // if (profile?.role !== 'Superadmin') { return <div>Access Denied.</div>; }

    if (error) {
        return <div className="text-red-600 p-8 text-center text-xl">Error: {error}</div>;
    }

    if (users.length === 0) {
        return <div className="text-center p-8 text-xl text-gray-500">No users found in the system.</div>;
    }

    // --- Final Render ---

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
                Superadmin Service Provider Management ({users.length} Users)
            </h1>

            <div className="shadow-lg overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
                            const isBlocked = user.isBlocked;
                            const isSelf = profile && profile.email === user.email;
                            const currentAction = actionInProgress.id === user.email ? actionInProgress.type : null;
                            const isActionPending = !!currentAction;
                            
                            return (
                                <tr key={user._id} className={isBlocked ? 'bg-red-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.name || 'N/A'} {isSelf && <span className="text-indigo-600">(You)</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {isBlocked ? 'BLOCKED' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        
                                        {/* Block / Unblock Button */}
                                        <button
                                            onClick={() => handleUpdateStatus(user.email, isBlocked)}
                                            disabled={isActionPending || isSelf}
                                            className={`px-3 py-1 text-white text-xs rounded transition ${
                                                isSelf ? 'bg-gray-400' : (isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-600 hover:bg-yellow-700')
                                            }`}
                                        >
                                            {isActionPending && currentAction.includes('BLOCK') ? 'Updating...' : (isBlocked ? 'Unblock' : 'Block')}
                                        </button>
                                        
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteUser(user.email)}
                                            disabled={isActionPending || isSelf}
                                            className={`px-3 py-1 text-white text-xs rounded transition ${
                                                isSelf ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                        >
                                            {isActionPending && currentAction === 'DELETE' ? 'Deleting...' : 'Delete'}
                                        </button>

                                        {isSelf && <span className="text-red-500 text-xs ml-2">Cannot modify own account</span>}
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

export default ManageServiceProvider;