// ServiceProviderProfile.jsx
import React, { useState } from "react";

const ServiceProviderProfile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "0123456789",
    photoURL: "https://i.pravatar.cc/150?img=3",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    // Here you can call your API to save profile changes
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="max-w-3xl bg-white p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-6">
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
              className="flex-1 input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full input input-bordered"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full input input-bordered"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full input input-bordered"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
