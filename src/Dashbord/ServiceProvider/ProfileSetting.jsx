import React, { useState } from "react";
import useUserData from "../../Hook/useUserData";

const ServiceProviderProfile = () => {
  const { profile, setProfile, loading, error, updateProfile } = useUserData();
  console.log(profile)
  const [warning, setWarning] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  // Check if any required fields are missing
  const checkIncompleteFields = (data) => {
    const requiredFields = [
      "name",
      "phone",
      "photoURL",
      "address",
      "accountRecoveryEmail",
      "shopAddress",
      "totalWorkers",
      "shopName",
      "TINNumber",
      "password", // make sure password is set
    ];
    const hasMissing = requiredFields.some(
      (field) => !data[field] || data[field] === ""
    );
    setWarning(hasMissing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    checkIncompleteFields(updatedProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profile);
    if (result.success) alert("Profile updated successfully!");
    else alert("Failed to update profile");
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className=" bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile Settings</h1>
      <p>ID : {profile._id}</p>
      {warning && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-6">
          ⚠️ Please complete all required information to fully set up your account.
        </div>
      )}

      <div className="bg-white p-8 rounded-lg max-w-7xl mx-auto shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full border object-cover"
              />
              <input
                type="text"
                name="photoURL"
                value={profile.photoURL}
                onChange={handleChange}
                placeholder="Profile Image URL"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            {/* Basic Info */}
            <div>
              <label className="font-medium mb-1 block">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>
            {/* <div>
              <label className="font-medium mb-1 block">Id</label>
              <input
                type="number"
                name="id"
                defaultValue={profile._id}
                value={profile._id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div> */}

            {/* Account Recovery Email */}
            <div>
              <label className="font-medium mb-1 block">Account Recovery Email</label>
              <input
                type="email"
                name="accountRecoveryEmail"
                value={profile.accountRecoveryEmail || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            {/* Password Reset */}
            <div>
              <label className="font-medium mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={profile.password || ""}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-medium mb-1 block">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Shop/Service Name</label>
              <input
                type="text"
                name="shopName"
                value={profile.shopName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Shop Address</label>
              <input
                type="text"
                name="shopAddress"
                value={profile.shopAddress || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Total Workers</label>
              <input
                type="number"
                name="totalWorkers"
                value={profile.totalWorkers || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">TIN Number</label>
              <input
                type="text"
                name="TINNumber"
                value={profile.TINNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Additional Details</label>
              <textarea
                name="additionalDetails"
                value={profile.additionalDetails || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 resize-none"
              />
            </div>
          </div>

          {/* Submit Button Full Width */}
          <div className="md:col-span-2 text-right mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
