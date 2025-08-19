import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import useUserData from "../Hook/useUserData";
import { 
  FaHome, FaUser, FaPlusCircle, FaServicestack, FaStar, 
  FaUsers, FaCog, FaHeadset, FaFileContract, FaShoppingCart, 
  FaUsersCog, FaChartLine, FaDatabase, FaEnvelope, FaFileAlt 
} from "react-icons/fa";

const DashboardLayout = () => {
  const { profile } = useUserData();

  if (!profile) {
    return <div className="p-6">Loading profile...</div>;
  }

  // Sidebar links
  const serviceProviderLinks = [
    { name: "Home", to: "/dashboard/serviceproviderhome", icon: <FaHome /> },
    { name: "Profile", to: "/dashboard/profilesetting", icon: <FaUser /> },
    { name: "Add Service", to: "/dashboard/addservice", icon: <FaPlusCircle /> },
    { name: "My Services", to: "/dashboard/myservices", icon: <FaServicestack /> },
    { name: "Reviews", to: "/dashboard/reviews", icon: <FaStar /> },
    { name: "Customers", to: "/dashboard/customers", icon: <FaUsers /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FaCog /> },
    { name: "Support 24/7", to: "/dashboard/support", icon: <FaHeadset /> },
    { name: "Terms and Conditions", to: "/dashboard/terms", icon: <FaFileContract /> },
  ];

  const userLinks = [
    { name: "Home", to: "/dashboard/userHome", icon: <FaHome /> },
    { name: "Profile", to: "/dashboard/profilesetting", icon: <FaUser /> },
    { name: "My Reviews", to: "/dashboard/myreviews", icon: <FaStar /> },
    { name: "My Orders", to: "/dashboard/myorders", icon: <FaShoppingCart /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FaCog /> },
    { name: "Support 24/7", to: "/dashboard/support", icon: <FaHeadset /> },
    { name: "Terms and Conditions", to: "/dashboard/terms", icon: <FaFileContract /> },
  ];

  const superAdminLinks = [
    { name: "Home", to: "/dashboard/superadminhome", icon: <FaHome /> },
    { name: "Manage Users", to: "/dashboard/manage-users", icon: <FaUsersCog /> },
    { name: "Manage Service Providers", to: "/dashboard/manage-service-providers", icon: <FaUsers /> },
    { name: "All Services", to: "/dashboard/all-services", icon: <FaServicestack /> },
    { name: "Orders", to: "/dashboard/orders", icon: <FaShoppingCart /> },
    { name: "Reports", to: "/dashboard/reports", icon: <FaFileAlt /> },
    { name: "Mail / Messages", to: "/dashboard/messages", icon: <FaEnvelope /> },
    { name: "Analytics", to: "/dashboard/analytics", icon: <FaChartLine /> },
    { name: "Database", to: "/dashboard/database", icon: <FaDatabase /> },
    { name: "Settings", to: "/dashboard/settings", icon: <FaCog /> },
    { name: "Support 24/7", to: "/dashboard/support", icon: <FaHeadset /> },
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
      {/* Right Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">
          {profile.role ? profile.role : <span className="loading loading-dots loading-sm"></span>} Dashboard
        </h2>
        <nav className="flex flex-col space-y-3">
          {linksToRender.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""}`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default DashboardLayout;
