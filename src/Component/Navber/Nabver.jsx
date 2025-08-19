import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import UserMenu from "./UserMenu/UserMenu";
import useAuth from "../../Provider/useAuth";

const Navbar = () => {
  const { User, logout, day, togglebutton } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    Aos.refresh();
  }, [day]);

  const navItems = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-3 py-2 font-medium rounded hover:bg-gray-200 transition ${
            isActive ? "text-blue-600" : "text-gray-800"
          }`
        }
      >
        HOME
      </NavLink>
      <NavLink
        to="/allservices"
        className={({ isActive }) =>
          `px-3 py-2 font-medium rounded hover:bg-gray-200 transition ${
            isActive ? "text-blue-600" : "text-gray-800"
          }`
        }
      >
        ALL SERVICES
      </NavLink>
      <NavLink
        to="/aboutus"
        className={({ isActive }) =>
          `px-3 py-2 font-medium rounded hover:bg-gray-200 transition ${
            isActive ? "text-blue-600" : "text-gray-800"
          }`
        }
      >
        ABOUT US
      </NavLink>
      <NavLink
        to="/contactus"
        className={({ isActive }) =>
          `px-3 py-2 font-medium rounded hover:bg-gray-200 transition ${
            isActive ? "text-blue-600" : "text-gray-800"
          }`
        }
      >
        CONTACT US
      </NavLink>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md py-3 transition duration-300 ${
        day ? "bg-white bg-opacity-90" : "bg-gray-50 bg-opacity-90"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
          TrustyHands
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-4">{navItems}</nav>

        {/* Right Side: User & Theme */}
        <div className="flex items-center space-x-3">
          {User ? (
            <UserMenu logout={logout} User={User} />
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login
            </NavLink>
          )}

          {/* Theme Toggle */}
          <label className="swap swap-rotate cursor-pointer">
            <input type="checkbox" onChange={togglebutton} checked={day} />
            <svg
              className="swap-off h-6 w-6 fill-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64 17l-.71.71a1 1 0 0 0..." />
            </svg>
            <svg
              className="swap-on h-6 w-6 fill-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64 13a1 1 0 0 0..." />
            </svg>
          </label>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden ml-2 p-2 rounded-md hover:bg-gray-200 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="h-6 w-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 bg-white rounded-md shadow-md mx-4 py-3 flex flex-col space-y-2 animate-slide-down">
          {navItems}
          {User ? <UserMenu logout={logout} User={User} mobile /> : null}
        </div>
      )}
    </header>
  );
};

export default Navbar;
