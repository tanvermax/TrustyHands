import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import AuthContext from "../../AuthProvider.jsx/AuhtContext";

const Nabver = () => {
  const { User, logout, day, togglebutton } = useContext(AuthContext);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    Aos.refresh();
  }, [day]);

  const navItems = (
    <>
      <NavLink to="/" className="px-3 py-1 rounded hover:bg-gray-200">HOME</NavLink>
      <NavLink to="/allservices" className="px-3 py-1 rounded hover:bg-gray-200">ALL SERVICE</NavLink>
      <NavLink to="/aboutus" className="px-3 py-1 rounded hover:bg-gray-200">ABOUT US</NavLink>

      {User && (
        <>
          <div className="relative group inline-block ">
            <span className="cursor-pointer px-3 py-1 rounded hover:bg-gray-200">DASHBOARD</span>
            <div className="absolute hidden group-hover:block bg-white border rounded shadow-md mt-1 min-w-[160px] z-50">
              <NavLink to="/addService" className="block px-4 py-2 hover:bg-gray-100">Add A Service</NavLink>
              <NavLink to="/manageservices" className="block px-4 py-2 hover:bg-gray-100">Manage Services</NavLink>
              <NavLink to="/bookedservice" className="block px-4 py-2 hover:bg-gray-100">Booked Service</NavLink>
              <NavLink to="/servicetodo" className="block px-4 py-2 hover:bg-gray-100">Service To Do</NavLink>
            </div>
          </div>
          <NavLink to="/faq" className="px-3 py-1 rounded hover:bg-gray-200">FAQ</NavLink>
        </>
      )}
    </>
  );

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md py-3 shadow-sm transition duration-300 ${day ? "bg-white bg-opacity-70" : "bg-white bg-opacity-70"}`}>
      <div className="navbar container mx-auto py-2 px-4 flex items-center justify-between">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center space-x-4">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost text-xl">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <ul className="menu menu-sm dropdown-content mt-2 shadow bg-white rounded w-52 z-50">
              {navItems}
            </ul>
          </div>
          <p className={`text-xl font-bold ${day ? "text-black" : "text-black"}`}>TrustyHands</p>
        </div>

        {/* Center: Nav items on lg */}
        <nav className="hidden lg:flex space-x-6" data-aos="fade-down">
          {navItems}
        </nav>

        {/* Right: User info + login/logout + theme toggle */}
        <div className="flex items-center space-x-3">
          {User ? (
            <>
              <img
                className="h-8 w-8 rounded-full border border-gray-300"
                src={User.photoURL}
                alt="User"
              />
              <span className="text-sm truncate max-w-[120px]">{User.displayName || User.email}</span>
              <button onClick={logout} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login
            </NavLink>
          )}

          <label className="swap swap-rotate cursor-pointer">
            <input type="checkbox" onChange={togglebutton} checked={day} />
            <svg className="swap-off h-6 w-6 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64 17l-.71.71a1 1 0 0 0 0 1.41..." />
            </svg>
            <svg className="swap-on h-6 w-6 fill-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64 13a1 1 0 0 0-1.05-.14..." />
            </svg>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Nabver;
