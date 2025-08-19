import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Provider/useAuth";

const SocialLogin = () => {
  const { googlelogin } = useAuth();
  const navigate = useNavigate();

  const handleSocialLogin = async (loginMethod) => {
    try {
      const result = await loginMethod(); // loginMethod is a function from AuthContext
      const user = result.user;

      // Save user in backend with default role "user"
      await axios.post("http://localhost:5000/user", {
        name: user.displayName || "No Name",
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
      });

      toast.success(`Logged in as ${user.displayName || user.email}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Social login failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => handleSocialLogin(googlelogin)}
        className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
      >
        <FcGoogle className="text-2xl" /> Login with Google
      </button>

      <button
        onClick={() => handleSocialLogin(facebookLogin)}
        className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-blue-100 transition text-blue-600"
      >
        <FaFacebookF className="text-2xl" /> Login with Facebook
      </button>

      <button
        onClick={() => handleSocialLogin(twitterLogin)}
        className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-blue-100 transition text-blue-500"
      >
        <FaTwitter className="text-2xl" /> Login with Twitter
      </button>

      <button
        onClick={() => handleSocialLogin(githubLogin)}
        className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
      >
        <FaGithub className="text-2xl" /> Login with GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
