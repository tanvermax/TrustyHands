import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

const UserMenu = ({ logout, User }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div className="relative" ref={menuRef}>
      {/* Button (Profile Pic or Name) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-200"
      >
        <img
          src={User.photoURL}
          alt="User"
          className="h-8 w-8 rounded-full border"
        />
       <div className="flex flex-col items-start hidden md:flex text-xs">
         <span className="hidden md:inline font-medium">{User.displayName || "Profile"}</span>
        <span className="hidden md:inline font-medium">{User.email || "Profile"}</span>
       </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
         
          <NavLink
            to="/dashboard"
            className="block px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>
         
          <button
            onClick={logout}
            className="w-full text-left  px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
