import { useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import AuthContext from "../../AuthProvider.jsx/AuhtContext";
import UserMenu from "./UserMenu/UserMenu";

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
      <NavLink to="/" className="px-3 font-medium py-1 rounded hover:bg-gray-200">
        HOME
      </NavLink>
      <NavLink to="/allservices" className="px-3 font-medium py-1 rounded hover:bg-gray-200">
        ALL SERVICE
      </NavLink>
      <NavLink to="/aboutus" className="px-3 font-medium py-1 rounded hover:bg-gray-200">
        ABOUT US
      </NavLink>
      <NavLink to="/contactus" className="px-3 font-medium py-1 rounded hover:bg-gray-200">
       CONTACT US
      </NavLink>

   
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-[2px] py-3 shadow-sm transition duration-300 ${
        day ? "bg-white bg-opacity-70" : "bg-white bg-opacity-70"
      }`}
    >
      <div className="navbar container mx-auto py-2 px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Link  to={"/"} className="text-xl font-bold text-black">TrustyHands</Link>
        </div>

        {/* Center: Nav items */}
        <nav className="hidden lg:flex space-x-6" data-aos="fade-down">
          {navItems}
        </nav>

        {/* Right: User menu + theme toggle */}
        <div className="flex items-center space-x-3">
          {User ? (
            <UserMenu logout={logout} User={User} />
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </NavLink>
          )}

          <label className="swap swap-rotate cursor-pointer">
            <input type="checkbox" onChange={togglebutton} checked={day} />
            <svg className="swap-off h-6 w-6 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64 17l-.71.71a1 1 0 0 0..." />
            </svg>
            <svg className="swap-on h-6 w-6 fill-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64 13a1 1 0 0 0..." />
            </svg>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Nabver;




  //  {User 
  //     && (
  //       <>
  //         {/* Service Provider dropdown */}
  //         <ServiceProviderMenu />
  //         <NavLink to="/faq" className="px-3 font-medium py-1 rounded hover:bg-gray-200">
  //           FAQ
  //         </NavLink>
  //       </>
  //     )}