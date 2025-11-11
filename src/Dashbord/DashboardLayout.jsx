import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import useUserData from "../Hook/useUserData";
// Import the new hook
import useNotifications from '../Hook/useNotifications';
// ... (Your icon imports)
import { FaCartPlus, FaOpencart } from "react-icons/fa6";

import { MdOutlineStarRate } from "react-icons/md";

import {

  FaHome, FaUser, FaPlusCircle, FaServicestack, FaStar,

  FaUsers, FaCog, FaHeadset, FaFileContract, FaShoppingCart,

  FaUsersCog, FaChartLine, FaEnvelope, FaFileAlt

} from "react-icons/fa";
import { GiWallet } from "react-icons/gi";

const DashboardLayout = () => {
  const { profile } = useUserData();

  // --- INTEGRATE THE NEW HOOK ---
  const { counts, isNotificationLoading } = useNotifications(profile?.role, profile?.email);
  // ------------------------------
console.log(counts)
  if (!profile) {
    return <div className="p-6">Loading profile...</div>;
  }

  // Helper function to extract the path key (e.g., '/dashboard/orders' -> 'orders')
  const getPathKey = (to) => to.split('/').pop();

  // Sidebar links (same as before)
  const serviceProviderLinks = [
    { name: "Home", to: "/dashboard/serviceproviderhome", icon: <FaHome /> },
    { name: "Profile", to: "/dashboard/profilesetting", icon: <FaUser /> },
    { name: "Add Service", to: "/dashboard/addservice", icon: <FaPlusCircle /> },
    { name: "My Services", to: "/dashboard/myservices", icon: <FaServicestack /> },
    // Key matches 'orders' in provider notifications API
    { name: "Order", to: "/dashboard/orders", icon: <FaOpencart /> },
    { name: "Reviews", to: "/dashboard/reviews", icon: <MdOutlineStarRate /> },
    { name: "Customers", to: "/dashboard/customers", icon: <FaUsers /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FaCog /> },
    // Key matches 'providersupport' in provider notifications API
    { name: "Support 24/7", to: "/dashboard/providersupport", icon: <FaHeadset /> },
    { name: "Terms and Conditions", to: "/dashboard/terms", icon: <FaFileContract /> },
  ];

  const userLinks = [
    { name: "Home", to: "/dashboard/userHome", icon: <FaHome /> },
    { name: "Profile", to: "/dashboard/profilesetting", icon: <FaUser /> },
    // Key matches 'postrequest' in user notifications API
    { name: "Post for Service", to: "/dashboard/postrequest", icon: <FaCartPlus /> },
    { name: "My Reviews", to: "/dashboard/myreviews", icon: <FaStar /> },
    // Key matches 'myorders' in user notifications API
    { name: "My Orders", to: "/dashboard/myorders", icon: <FaShoppingCart /> },
    { name: "Wallet", to: "/dashboard/wallet", icon: <GiWallet /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FaCog /> },
    { name: "Support 24/7", to: "/dashboard/support", icon: <FaHeadset /> },
    { name: "Terms and Conditions", to: "/dashboard/terms", icon: <FaFileContract /> },
  ];

  const superAdminLinks = [
    { name: "Home", to: "/dashboard/superadminhome", icon: <FaHome /> },
    // Key matches 'manageusers' in admin notifications API
    { name: "Manage Users", to: "/dashboard/manageusers", icon: <FaUsersCog /> },
    { name: "Manage Service Providers", to: "/dashboard/manage-service-providers", icon: <FaUsers /> },
    { name: "All Services", to: "/dashboard/all-services", icon: <FaServicestack /> },
    // Key matches 'ordersMange' in admin notifications API
    { name: "Orders", to: "/dashboard/ordersMange", icon: <FaShoppingCart /> },
    { name: "Reports", to: "/dashboard/reports", icon: <FaFileAlt /> },
    { name: "Mail / Messages", to: "/dashboard/messages", icon: <FaEnvelope /> },
    { name: "Analytics", to: "/dashboard/analytics", icon: <FaChartLine /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FaCog /> },
    // Key matches 'adminsupport' in admin notifications API
    { name: "Support 24/7", to: "/dashboard/adminsupport", icon: <FaHeadset /> },
    { name: "Terms and Conditions", to: "/dashboard/terms", icon: <FaFileContract /> },
  ];

  const linksToRender =
    profile.role === "serviceProvider"
      ? serviceProviderLinks
      : profile.role === "superadmin"
        ? superAdminLinks
        : userLinks;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-2xl p-6 flex flex-col z-10">
        <h2 className="text-xl font-bold mb-8 text-indigo-700">
          {profile.role ? profile.role.toUpperCase() : <span className="loading loading-dots loading-sm"></span>} DASHBOARD
        </h2>
        <nav className="flex flex-col space-y-3 flex-grow">
          {linksToRender.map((link) => {
            const pathKey = getPathKey(link.to);
            const count = counts[pathKey] || 0;
            const hasNotification = count > 0;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end
                // Outer className function (for the main container classes)
                className={({ isActive }) => {
                  const activeClass = isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600";

                  const notificationClass = hasNotification && !isActive
                    ? "border-r-4 border-red-500"
                    : "";

                  return `flex items-center justify-between px-4 py-3 rounded-xl transition duration-150 ease-in-out ${activeClass} ${notificationClass}`;
                }}
              >
                {/*
          *** CRITICAL FIX HERE ***
          Change NavLink's children to a function that receives { isActive }
          The content inside the NavLink will use this function's argument.
        */}
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <span className={`text-xl ${isActive ? 'text-white' : 'text-indigo-500'}`}>{link.icon}</span>
                      <span className="font-medium">{link.name}</span>
                    </span>

                    {/* Notification Badge (can remain the same) */}
                    {isNotificationLoading ? (
                      <span className="loading loading-dots loading-xs text-gray-400"></span>
                    ) : hasNotification ? (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                        {count > 99 ? '99+' : count}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        {/* Footer/Logout area can go here */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;