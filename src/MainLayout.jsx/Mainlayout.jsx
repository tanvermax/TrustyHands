import { Outlet } from "react-router-dom";
import Nabver from "../Component/Navber/Nabver";

import Fotter from "../Component/Fotter/Fotter";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../AuthProvider.jsx/AuthPovider";


const Mainlayout = () => {
  const { day } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a data fetch
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const url = window.location.href;

  return (
    <div className="items-center text-center ">
      {loading ? (
        <span className="loading loading-bars mt-32 loading-3xl mx-auto w-20 "></span>
      ) : (
        <div className={`${day ? "bg-black" : "bg-white"}`}>
          <Nabver></Nabver>
          <ToastContainer />

          <div className=" min-h-[calc(100vh-300px)]  ">
            <Outlet></Outlet>
          </div>
          {
            url.includes("dashboard") ? " " : <Fotter></Fotter>
          }

        </div>
      )}
    </div>
  );
};

export default Mainlayout;
