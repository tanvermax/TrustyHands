import { useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx/AuthPovider";


const useAuth = () => {

    const auth = useContext(AuthContext);
    return auth;
}

export default useAuth;