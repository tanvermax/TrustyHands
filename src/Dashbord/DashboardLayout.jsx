// DashboardLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}


      {/* Right Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/dashboard/addservice"
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""}`
            }
          >
            Add Service
          </NavLink>

          <NavLink
            to="/dashboard/myservices"
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""}`
            }
          >
            My Services
          </NavLink>

          <NavLink
            to="/dashboard/profilesetting"
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""}`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>
    </div>
  );
};

export default DashboardLayout;
