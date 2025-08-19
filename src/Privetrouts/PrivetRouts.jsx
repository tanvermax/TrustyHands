import { Children, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Provider/useAuth";

const PrivetRouts = ({ children }) => {
  const { User, loading } = useAuth()
  const location = useLocation();

  // console.log("User:", User);

  if (loading) {
    return <span className="loading loading-infinity loading-lg"></span>;
  }

  return User ? (
    children
  ) : (
    <Navigate to={"/login"} state={location.pathname} replace></Navigate>
  );
};

export default PrivetRouts;
