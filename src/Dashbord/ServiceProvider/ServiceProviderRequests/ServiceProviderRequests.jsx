import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, DollarSign, MapPin, CheckCircle, Mail, User } from 'lucide-react';
import useUserData from '../../../Hook/useUserData';
import { toast } from 'react-toastify';

const ServiceProviderRequests = () => {
    // Replace with your actual backend base URL
    // const API_BASE_URL = 'https://trusty-hands-backend.vercel.app';

    const { profile, loading: isAuthLoading } = useUserData();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [acceptedRequestId, setAcceptedRequestId] = useState(null); // Tracks the ID of the request whose contact info is revealed

    // console.log(profile)
    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Assuming your backend has an endpoint to fetch 'Open' requests
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/service-requests?status=Open`, {
                withCredentials: true
            });

            // Normalize data: ensure all IDs are easily accessible
            const normalizedData = response.data.map(req => ({
                ...req,
                // Extract the unique MongoDB ID string
                uniqueId: req._id?.$oid || req._id
            }));

            setRequests(normalizedData);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to load requests. Please check the network.");
        } finally {
            setIsLoading(false);
        }
    };
    console.log(requests)

    useEffect(() => {
        if (!isAuthLoading && profile) {
            fetchRequests();
        }
    }, [isAuthLoading, profile]);


    const handleAcceptRequest = async (request) => {
        const uniqueId = request.uniqueId;
        console.log(uniqueId)

        if (!window.confirm(`Are you sure you want to accept the request for '${request.servicename}'?`)) {
            return;
        }

        if (!profile || !profile.email) return console.error("Provider profile missing");

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/request/accept/${uniqueId}`, {
                serviceProviderId: profile._id,
                serviceProviderEmail: profile.email
            });


            if (response.data) {
                console.log(response)
                toast.success("Request accepted! Contact info revealed.");
                setAcceptedRequestId(uniqueId);
                //  const serviceDateTime = `${form.serviceDate.value}T${form.serviceTime.value}`;

                // const orderDetails = {
                //     orderid: requests._id,
                //     servicename: requests.servicename,
                //     instruction: requests.instruction,
                //     serviceprovider: profile.name,
                //     serviceprovideremail: profile.email,
                //     cost: Number(requests.budget),
                //     serviceStatus: "Pending",
                //     ordergivenusername: requests.ordergivenusername,
                //     ordergivenuseremail: requests.ordergivenuseremail,
                //     serviceDate: requests.postedAt,
                //     userId: requests.servicename,
                //     escrowStatus: "DeductedFromUser"
                // };
                const orderDetails = {
                    orderid: request.uniqueId,
                    servicename: request.servicename,
                    instruction: request.instruction,
                    serviceprovider: profile.name,
                    serviceprovideremail: profile.email,
                    cost: Number(request.budget),
                    serviceStatus: "Pending",
                    ordergivenusername: request.ordergivenusername,
                    ordergivenuseremail: request.ordergivenuseremail,
                    serviceDate: request.serviceDate,
                    userId: request.userid,
                    escrowStatus: "DeductedFromUser"
                };

                console.log(orderDetails)
                try {
                    const res = await axios.post("https://trusty-hands-backend.vercel.app/order", orderDetails)
                    console.log(res)
                    if (res.data) {
                        console.log(res.data);
                        toast.success("Service booked successfully!");
                    } else {
                        toast.error("Booking failed. Please try again.");
                    }
                } catch (err) {
                    console.error("Booking error:", err);
                    alert("An error occurred during booking. Check console.");
                }

                // Update the request in state with the returned contact info
                setRequests((prev) =>
                    prev.map(req =>
                        req.uniqueId === uniqueId
                            ? { ...req, contactInfo: response.data.contactInfo }
                            : req
                    )
                );

            } else {
                alert(response.data.message);
            }

        } catch (err) {
            console.error("Accept request error:", err);
            alert("Could not accept request. Try again later.");
        }
    };


    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isAuthLoading) {
        return <div className="p-8 text-center text-lg text-indigo-600">Authenticating provider...</div>;
    }

    if (!profile) {
        return <div className="p-8 text-center text-lg text-red-500">You must be logged in as a service provider to view requests.</div>;
    }
    // console.log(profile)
    if (!profile.phone) {
        return <div className="p-8 text-center text-lg text-red-500">please provide you phone number.</div>;
    }


    if (isLoading) {
        return <div className="p-8 text-center text-lg text-gray-500">Loading open requests...</div>;
    }

    if (error) return <div className="p-8 text-center text-red-600 font-medium">{error}</div>;

    const openRequests = requests.filter(req => req.status === 'Open');

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div id="messageBox" className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm transition-all duration-300"></div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
                Open Service Requests
            </h2>

            <p className="mb-6 text-gray-600">
                You currently have **{openRequests.length}** open opportunities. Click 'Accept' to claim a request and view the customer's contact details.
            </p>

            {openRequests.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-md text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-xl font-semibold text-gray-700">No open service requests right now. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {openRequests.map((request) => (
                        <div
                            key={request.uniqueId}
                            className={`bg-white rounded-xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.02] ${acceptedRequestId === request.uniqueId ? 'border-4 border-indigo-500' : 'border border-gray-100'}`}
                        >
                            {/* Service Details Section */}
                            <div className="mb-4 pb-4 border-b">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{request.servicename}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                    Posted: {formatDate(request.postedAt?.$date)}
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center text-gray-700">
                                    <MapPin className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
                                    <span className="font-medium">Area:</span> {request.area}
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <MapPin className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
                                    <span className="font-medium">serviceDate :</span> {request.serviceDate}
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <DollarSign className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                                    <span className="font-medium">Budget:</span> ${request.budget}
                                </div>

                                <p className="text-gray-600 pt-2 border-t mt-3 text-sm">
                                    <span className="font-semibold text-gray-800 block mb-1">Instructions:</span>
                                    {request.instruction}
                                </p>
                            </div>

                            {/* Action and Contact Section */}
                            <div className="pt-4 border-t mt-4">
                                {acceptedRequestId === request.uniqueId && request.contactInfo ? (
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h4 className="font-bold text-indigo-700 mb-2 flex items-center">
                                            <CheckCircle className="w-5 h-5 mr-2" /> Request Accepted!
                                        </h4>
                                        <p className="text-sm text-indigo-600 font-semibold mb-1 flex items-center">
                                            <User className="w-4 h-4 mr-2" /> {request.contactInfo.name}
                                        </p>
                                        
                                        <p className="text-sm text-indigo-600 flex items-center">
                                            <Mail className="w-4 h-4 mr-2" /> {request.contactInfo.email}
                                        </p>
                                        <p className="text-sm text-indigo-600 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" /> {request.contactInfo.phone}
                                        </p>
                                        <p className="text-xs text-indigo-500 mt-2">Contact the user immediately to confirm service details.</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleAcceptRequest(request)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                    >
                                        Accept Request
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServiceProviderRequests;