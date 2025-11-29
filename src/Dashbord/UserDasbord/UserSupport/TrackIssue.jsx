import  { useEffect, useState } from "react";
import { Search, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import useUserData from "../../../Hook/useUserData";

const TrackIssue = () => {
  const { profile } = useUserData(); // logged-in user info
  const [ticketId, setTicketId] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaint, setFilteredComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch all complaints of logged-in user
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/complaints?email=${profile?.email}`);
        if (res.data.success) {
          setComplaints(res.data.data); // all complaints of this user
        }
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setFetching(false);
      }
    };

    if (profile?.email) fetchComplaints();
  }, [profile?.email]);
// console.log(complaints)
  const handleTrack = () => {
    setLoading(true);
    setFilteredComplaint(null);

    setTimeout(() => {
      const found = complaints.find(c => c._id === ticketId); // match by _id
      setFilteredComplaint(found || "not-found");
      setLoading(false);
    }, 800); // simulate loading
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Track an Existing Issue</h1>
      <p className="text-gray-600 mb-8">
        Enter your Ticket ID to check the status of your complaint, refund, or service issue.
      </p>

      {fetching ? (
        <div className="text-indigo-600 flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" /> Loading your complaints...
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g., 650f1b...)" // MongoDB _id
              className="w-full border border-gray-300 rounded-lg p-3"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
            <button
              onClick={handleTrack}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Status Result */}
          <div className="mt-6">
            {loading && (
              <div className="flex items-center gap-2 text-indigo-600">
                <Loader2 className="animate-spin w-5 h-5" />
                Checking ticket status...
              </div>
            )}

            {filteredComplaint === "not-found" && (
              <div className="flex items-start gap-3 text-red-600 mt-4 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
                <p>Ticket ID not found. Please check again or contact support.</p>
              </div>
            )}

            {filteredComplaint && filteredComplaint !== "not-found" && (
              <div className="mt-4 p-5 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">{filteredComplaint.subject}</h2>
                </div>
                <p className="mt-2 text-gray-700">
                  <span className="font-semibold">Status:</span> {filteredComplaint.status}
                </p>
                <p className="text-gray-600 mt-1">{filteredComplaint.details}</p>
              </div>
            )}
          </div>

          {/* Show all complaints table */}
          {complaints.length > 0 && (
            <div className="mt-8 overflow-x-auto">
              <h3 className="text-2xl font-bold mb-4">All Your Complaints</h3>
              <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Ticket ID</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Admin Reply</th>
                    <th className="p-3 text-left">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id} className="border-b border-gray-200">
                      <td className="p-3">{c._id}</td>
                      <td className="p-3">{c.subject}</td>
                      <td className="p-3">{c.status}</td>
                      <td className="p-3">{c.adminReply}</td>
                      <td className="p-3">{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-gray-500 text-sm mt-8">
        For urgent issues, call us directly at 📞 555-123-4567
      </p>
    </div>
  );
};

export default TrackIssue;
