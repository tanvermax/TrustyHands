import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useUserData from "../../../Hook/useUserData";

const UserMenu = ({ logout, User }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { profile } = useUserData();

  // Determine the profile photo URL (using profile.photoURL if available, otherwise fallback to User.photoURL or a default)
  const userPhoto = profile?.photoURL || User?.photoURL || 'https://via.placeholder.com/150/0000FF/FFFFFF?text=User';
  const userName = profile?.name || User?.displayName || 'Guest User';
  const userEmail = profile?.email || User?.email || 'N/A';
  const userRole = profile?.role || 'user';
  // Safely display wallet balance, defaulting to 0.00
  const walletBalance = profile?.wallet?.toFixed(2) || '0.00';


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Determine dashboard path using the same logic as before, but with better variable access
  const getDashboardPath = () => {
    switch (userRole) {
      case "serviceProvider":
        return "/dashboard/serviceproviderhome";
      case "superadmin":
        return "/dashboard/superadminhome";
      case "user":
        return "/dashboard/userhome";
      default:
        return "/dashboard/userhome"; // Default fallback
    }
  };


  return (
    <div className="relative" ref={menuRef}>
      {/* 💳 Button (Avatar and Wallet/Name) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-3 p-1 rounded-full bg-white shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {/* Profile Picture */}
        <img
          src={userPhoto}
          alt={userName}
          className="h-10 w-10 rounded-full border-2 border-indigo-400 object-cover"
        />
        
        {/* Wallet and Name (Visible on large screens) */}
        <div className="hidden lg:flex flex-col items-end pr-2">
            <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                {userName}
            </span>
            <span className="text-sm font-bold text-green-600">
                ৳ {walletBalance}
            </span>
        </div>
        
        {/* Dropdown Arrow Indicator */}
        <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 hidden md:inline-block ${open ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>

      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-fade-in-down transform origin-top-right">
            
          {/* Menu Header: User Info & Role */}
          <div className="p-4 border-b border-gray-100 bg-indigo-50 rounded-t-xl">
              <p className="text-base font-bold text-gray-800 truncate">{userName}</p>
              <p className="text-sm text-gray-500 truncate">{userEmail}</p>
              <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
          </div>
            
          {/* Wallet Balance Card */}
          <div className="px-4 py-3 bg-white border-b">
              <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-extrabold text-green-700 mt-0.5">
                  ৳ {walletBalance}
              </p>
              <NavLink 
                to="/recharge"
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-1 block"
                onClick={() => setOpen(false)}
              >
                Recharge Now &rarr;
              </NavLink>
          </div>

          {/* Menu Items */}
          <div className="p-1">
              <NavLink
                  to={getDashboardPath()}
                  className="block px-3 py-2 text-gray-700 rounded-lg font-medium hover:bg-indigo-50 transition duration-150"
                  onClick={() => setOpen(false)}
              >
                  🏠 Dashboard
              </NavLink>

              <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-600 rounded-lg font-medium hover:bg-red-50 transition duration-150 mt-1"
              >
                  🚪 Logout
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;