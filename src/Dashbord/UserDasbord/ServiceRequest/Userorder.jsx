import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserData from "../../../Hook/useUserData";

export default function UserRequests() {
  const { profile, loading: isProfileLoading } = useUserData();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://trusty-hands-backend.vercel.app/service-requests?${profile.email}";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(API_URL);
        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  console.log(requests)

  if (isProfileLoading || loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!profile?.email) {
    return <div className="text-center p-6 text-red-600">You must be logged in.</div>;
  }

  const userRequests = requests.filter(req => req.ordergivenuseremail === profile.email);

  if (userRequests.length === 0) {
    return <div className="text-center p-6 text-gray-600">No service requests found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Service Requests : {userRequests.length}</h2>

      {userRequests.map((req) => (
        <div key={req._id} className="p-4 bg-white shadow rounded-xl border space-y-1">
          <p><strong>Service:</strong> {req.servicename}</p>
          <p><strong>Instruction:</strong> {req.instruction}</p>
          <p><strong>Area:</strong> {req.area}</p>
          <p><strong>Budget:</strong> {req.budget}</p>
          <p><strong>Posted At:</strong> {new Date(req.postedAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {req.status}</p>

          {req.status === "Accepted" && (
            <div className="pt-2 border-t">
              <p><strong>Accepted At:</strong> {new Date(req.acceptedAt).toLocaleString()}</p>
              <p><strong>Accepted By:</strong> {req.acceptedByEmail}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}