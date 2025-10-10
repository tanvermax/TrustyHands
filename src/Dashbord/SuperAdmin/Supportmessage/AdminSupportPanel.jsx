import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaReply, FaCheckCircle, FaSpinner, FaHistory, FaTimesCircle, FaUserTie } from 'react-icons/fa';

const API_BASE_URL = 'https://trusty-hands-backend.vercel.app'; // Match your backend URL

const AdminSupportPanel = () => {
    // NOTE: In a real app, this component would be protected by Admin routing.

    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // State for the reply/status form
    const [replyState, setReplyState] = useState({
        complaintId: null,
        status: '',
        adminReply: '',
        showModal: false
    });

    // --- 1. Fetch All Complaints ---
    const fetchComplaints = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Uses the new Admin API route. Requires JWT/cookie for 'verify'.
            const response = await axios.get(`${API_BASE_URL}/admin/all-complaints`, {
                withCredentials: true 
            });
            
            if (response.data.success) {
                setComplaints(response.data.data);
            } else {
                setError(response.data.message || "Failed to load complaints.");
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
            // Handle 403 Forbidden specifically if the admin role check fails
            if (err.response && err.response.status === 403) {
                 setError("Authorization Error: You must be an Admin to view this panel.");
            } else {
                 setError("Error connecting to the complaint system.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // --- 2. Action Handlers ---
    
    const openReplyModal = (complaint) => {
        // Find the MongoDB _id string. Checks for both {$oid: "..."} and string format.
        const id = complaint._id?.$oid || complaint._id; 
        
        setReplyState({
            complaintId: id,
            status: complaint.status,
            adminReply: complaint.adminReply || '',
            showModal: true
        });
    };

    const handleReplyChange = (e) => {
        setReplyState({ ...replyState, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        
        const { complaintId, status, adminReply } = replyState;
        
        // Ensure MongoDB ID is a string for the PUT API
        if (!complaintId) {
            alert("Error: Complaint ID is missing.");
            setIsUpdating(false);
            return;
        }

        try {
            // Use the existing PUT /complaint/:id route
            const response = await axios.put(`${API_BASE_URL}/complaint/${complaintId}`, 
                { status, adminReply }, 
                { withCredentials: true }
            );

            if (response.data.success) {
                alert(`Complaint ${complaintId} updated successfully to status: ${status}.`);
                setReplyState({ complaintId: null, status: '', adminReply: '', showModal: false }); // Close modal
                fetchComplaints(); // Refresh data
            } else {
                alert(`Error updating complaint: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update complaint. Network or server error.");
        } finally {
            setIsUpdating(false);
        }
    };
    
    // --- 3. Render Helpers ---
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800 border-green-300';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Pending': 
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    };

    if (isLoading) return <div className="text-center py-10 text-lg flex items-center justify-center"><FaSpinner className="animate-spin mr-2" /> Loading All Complaints...</div>;
    if (error) return <div className="text-center py-10 text-red-600 border border-red-300 bg-red-50 p-4">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
                <FaHistory className="mr-3 text-indigo-600" /> Admin Support Management
            </h1>
            
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase flex items-center"><FaUserTie className="mr-1" /> Provider</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                            <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {complaints.map((complaint) => (
                            <tr key={complaint._id.$oid || complaint._id} className="hover:bg-indigo-50 transition duration-100">
                                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                    {complaint.subject}
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                        {complaint.details}
                                    </p>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-700">
                                    {complaint.providerName}
                                    <p className="text-xs text-gray-500">{complaint.providerEmail}</p>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-500">
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <button 
                                        onClick={() => openReplyModal(complaint)}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-150 flex items-center mx-auto"
                                    >
                                        <FaReply className="mr-1" /> View/Reply
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Reply Modal */}
            {replyState.showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-indigo-600">
                            Reply to Complaint
                        </h3>
                        <form onSubmit={handleUpdateSubmit}>
                            {/* Display Complaint Details */}
                            <div className="mb-4 p-3 bg-gray-100 rounded">
                                <p className="font-semibold text-gray-800">{complaints.find(c => (c._id.$oid || c._id) === replyState.complaintId)?.subject}</p>
                                <p className="text-sm text-gray-600 mt-1">{complaints.find(c => (c._id.$oid || c._id) === replyState.complaintId)?.details}</p>
                            </div>

                            {/* Status Dropdown */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Update Status
                                </label>
                                <select
                                    name="status"
                                    value={replyState.status}
                                    onChange={handleReplyChange}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200"
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Cancelled">Cancelled/Invalid</option>
                                </select>
                            </div>

                            {/* Admin Reply Area */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminReply">
                                    Admin Reply
                                </label>
                                <textarea
                                    id="adminReply"
                                    name="adminReply"
                                    value={replyState.adminReply}
                                    onChange={handleReplyChange}
                                    rows="4"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setReplyState({ ...replyState, showModal: false })}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 flex items-center ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                                    {isUpdating ? 'Updating...' : 'Save & Send Reply'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupportPanel;