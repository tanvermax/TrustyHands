import { useState } from "react";
import useUserData from "../../Hook/useUserData";
import axios from "axios";

const Settings = () => {
  const {
    profile,
  } = useUserData();

  const [showModal, setShowModal] = useState(false);

 const handleDeleteAccount = async () => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/user/delete/${profile._id}`,
      {
        withCredentials: true, // sends cookies if needed
      }
    );

    const data = res.data;

    if (data.success) {
      alert("Account deleted successfully!");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Error deleting account.");
  }
};

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">⚙️ Settings</h1>

        {/* Account Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Account</h2>

          <div className="p-5 rounded-xl border border-red-300 bg-red-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
              <p className="text-sm text-red-600">
                Once deleted, your account and all data cannot be recovered.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
