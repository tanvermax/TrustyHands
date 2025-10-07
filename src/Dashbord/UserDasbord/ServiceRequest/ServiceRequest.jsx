import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useUserData from '../../../Hook/useUserData'; // Your custom hook
import { toast } from 'react-toastify';

const PostRequest = () => {
    const { profile, loading: isProfileLoading } = useUserData();
    const API_BASE_URL = "https://trusty-hands-backend.vercel.app";

    const [formData, setFormData] = useState({
        servicename: '',
        instruction: '',
        area: '',
        budget: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    // 💡 Renamed to uniqueCategories for clarity; stores only unique names
    const [uniqueCategories, setUniqueCategories] = useState([]); 

// category
    useEffect(() => {
         const fetchCategories = async () => {
            try {
                // Fetching from the Vercel backend as specified in your code
                const response = await axios.get(`https://trusty-hands-backend.vercel.app/addservice`); 
                
                if (response.data && Array.isArray(response.data)) {
                    // 1. Map the array to get only the category names
                    const allCategories = response.data.map(service => service.category);
                    
                    // 2. Use a Set to extract only the unique values
                    const uniqueNames = [...new Set(allCategories)];
                    
                    // 3. Update the state with the unique names
                    setUniqueCategories(uniqueNames);
                } else {
                    setUniqueCategories([]);
                }
            } catch (error) {
                 console.error("Error fetching categories:", error);
                 setUniqueCategories([]); // Set empty array on error
            }
        };
        fetchCategories();
    }, []); // Empty dependency array ensures it runs only once on mount


    // Note: Logging the state inside the component body is fine for debugging, 
    // but the console will show multiple updates (null, then the data).
    // console.log("Unique Categories:", uniqueCategories); 
    
    // ... (rest of the component logic)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (submission logic remains the same)
        if (isProfileLoading || !profile || !profile.email) {
            setMessage({ type: 'error', text: 'Please log in to post a request.' });
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const requestPayload = {
            ...formData,
            ordergivenusername: profile.name || 'User',
            ordergivenuseremail: profile.email,
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/servicerequest`, requestPayload);

            if (response.data.success) {
                toast.success("Service Request posted succesfully")
                setMessage({ type: 'success', text: 'Service request posted successfully! Service providers will review it shortly.' });
                setFormData({
                    servicename: '',
                    instruction: '',
                    area: '',
                    budget: '',
                });
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to post request. Try again.' });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setMessage({ type: 'error', text: 'Network error or server connection failed.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isProfileLoading) {
        return <div className="text-center p-8">Loading user profile...</div>;
    }

    if (!profile || !profile.email) {
        return <div className="text-center p-8 text-red-600">You must be logged in to post a service request.</div>;
    }

    return (
        <div className="p-6 md:p-10 max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
                Post a Service Request
            </h1>
            <p className="text-gray-600 mb-6">
                Tell us what you need done. Your request will be visible to our registered service providers.
            </p>

            {message && (
                <div className={`p-3 mb-4 rounded-md text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* User Info (Read-only) */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Posting As: {profile.name || 'User'}</p>
                    <p className="text-xs text-gray-500">Email: {profile.email}</p>
                </div>

                {/* Service Name */}
                <div>
                    <label htmlFor="servicename" className="block text-sm font-medium text-gray-700">
                        Type of Service Needed <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="servicename"
                        name="servicename"
                        value={formData.servicename}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        <option value="">-- Select a Service --</option>
                        {/* 💡 CORRECTION: Map over the uniqueCategories array of strings */}
                        {uniqueCategories.map(categoryName => (
                            <option key={categoryName} value={categoryName}>{categoryName}</option>
                        ))}
                        <option value="Other">Other (Specify in instructions)</option>
                    </select>
                </div>

                {/* Instructions */}
                <div>
                    <label htmlFor="instruction" className="block text-sm font-medium text-gray-700">
                        Detailed Instructions / Problem Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="instruction"
                        name="instruction"
                        rows="4"
                        value={formData.instruction}
                        onChange={handleChange}
                        required
                        placeholder="Describe the problem, location details, and any special requirements."
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>

                {/* Area */}
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Service Location / Area
                    </label>
                    <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="e.g., Downtown, Apartment 3A, Near Main Street"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Budget (Optional) */}
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                        Estimated Budget (Optional)
                    </label>
                    <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g., 200"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-md text-white text-lg font-semibold transition duration-300 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    {isSubmitting ? 'Submitting Request...' : 'Post Service Request'}
                </button>
            </form>
        </div>
    );
};

export default PostRequest;