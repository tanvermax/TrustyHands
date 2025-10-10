import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData'; // For profile and JWT
import { FaPaperPlane, FaHistory, FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const API_BASE_URL = 'https://trusty-hands-backend.vercel.app'; // Match your backend URL

const ProviderSupport = () => {
    const { profile, loading: isAuthLoading } = useUserData();

    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ subject: '', details: '' });
    const [error, setError] = useState(null);

    // --- 1. Fetch Complaints ---
    const fetchComplaints = async () => {
        // Only fetch if profile data is loaded and available
        if (isAuthLoading || !profile?.email) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            // This API uses the JWT token for authorization
            const response = await axios.get(`${API_BASE_URL}/provider-complaints/${profile.email}`, {
                withCredentials: true 
            });
            
            if (response.data.success) {
                setComplaints(response.data.data);
            } else {
                setError("Failed to load complaints.");
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Error connecting to the support system.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthLoading && profile?.email) {
            fetchComplaints();
        }
    }, [isAuthLoading, profile?.email]);

    // --- 2. Submission Handlers ---
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.subject.trim() || !formData.details.trim()) {
            return alert("Please fill in both the subject and details fields.");
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/provider-complaint/${profile.email}`, formData, {
                withCredentials: true 
            });

            if (response.data.success) {
                alert("Complaint successfully submitted! Status: Pending review.");
                setFormData({ subject: '', details: '' }); // Clear form
                fetchComplaints(); // Refresh the history
            } else {
                setError(response.data.message || "Submission failed.");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError("Failed to submit complaint. Network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to determine status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending': 
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (isAuthLoading) return <div className="text-center py-10">Loading authentication data...</div>;
    if (!profile?.email) return <div className="text-center py-10 text-red-600">Please log in as a Service Provider to access support.</div>;
    
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Service Provider Support Center</h1>
            
            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded border border-red-200">{error}</div>}

            {/* Complaint Submission Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600">
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-indigo-600">
                    <FaPaperPlane className="mr-2" /> Submit a New Complaint
                </h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                            Subject (Brief summary of the issue)
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
                            Details (Explain the issue clearly)
                        </label>
                        <textarea
                            id="details"
                            name="details"
                            value={formData.details}
                            onChange={handleFormChange}
                            rows="4"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Complaint History */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-gray-400">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-700">
                    <FaHistory className="mr-2" /> Complaint History
                </h2>
                
                {isLoading ? (
                    <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" /> Loading history...
                    </div>
                ) : complaints.length === 0 ? (
                    <p className="text-gray-500">You have no complaint history yet.</p>
                ) : (
                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <div key={complaint._id.$oid || complaint._id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-800">{complaint.subject}</h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    **Submitted:** {new Date(complaint.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-700 mb-3">{complaint.details}</p>

                                {/* Admin Reply Section */}
                                {complaint.adminReply && (
                                    <div className="mt-3 p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded">
                                        <p className="font-semibold text-indigo-700 flex items-center">
                                            <FaCheckCircle className="mr-2" /> Admin Reply:
                                        </p>
                                        <p className="text-indigo-800 text-sm mt-1">{complaint.adminReply}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderSupport;