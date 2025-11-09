import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Provider/useAuth"; // Assuming this hook provides all social logins

const SocialLogin = () => {
  // Destructure all expected login methods from your custom hook
  const { googlelogin, facebookLogin, twitterLogin, githubLogin } = useAuth();
  const navigate = useNavigate();

  const handleSocialLogin = async (loginMethod, providerName) => {
    try {
      const result = await loginMethod();
      const user = result.user;

      // Ensure the name is not null/undefined for backend storage
      const userName = user.displayName || `${providerName} User`;

      // Save user in backend with default role "user"
      await axios.post("https://trusty-hands-backend.vercel.app/user", {
        name: userName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
      });

      toast.success(`Welcome, ${userName}!`);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(`Login with ${providerName} failed. Please try again.`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* The buttons use consistent padding, rounded corners, and a subtle
        shadow on hover for a modern, tactile feel.
      */}

      {/* Google Login - Distinctive look with the icon */}
      <button
        onClick={() => handleSocialLogin(googlelogin, "Google")}
        className="flex items-center justify-center w-full px-4 py-2.5 
                   text-gray-700 bg-white border border-gray-300 rounded-lg 
                   shadow-sm hover:bg-gray-50 transition duration-300 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="text-2xl mr-3" />
        <span className="font-semibold text-base">Continue with Google</span>
      </button>

      {/* GitHub Login - Dark, professional theme */}
      <button
        onClick={() => handleSocialLogin(githubLogin, "GitHub")}
        // Check if githubLogin is available before showing
        disabled={!githubLogin} 
        className={`flex items-center justify-center w-full px-4 py-2.5 
                   rounded-lg shadow-sm transition duration-300 ease-in-out
                   ${!githubLogin 
                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                     : 'bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800'}`
                  }
      >
        <FaGithub className="text-xl mr-3" />
        <span className="font-semibold text-base">Continue with GitHub</span>
      </button>

      {/* Facebook Login - Brand Colors */}
      <button
        onClick={() => handleSocialLogin(facebookLogin, "Facebook")}
        disabled={!facebookLogin}
        className={`flex items-center justify-center w-full px-4 py-2.5 
                   rounded-lg shadow-sm transition duration-300 ease-in-out
                   ${!facebookLogin 
                     ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                     : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600'}`
                  }
      >
        <FaFacebookF className="text-xl mr-3" />
        <span className="font-semibold text-base">Continue with Facebook</span>
      </button>

      {/* Twitter Login - Brand Colors */}
      <button
        onClick={() => handleSocialLogin(twitterLogin, "Twitter")}
        disabled={!twitterLogin}
        className={`flex items-center justify-center w-full px-4 py-2.5 
                   rounded-lg shadow-sm transition duration-300 ease-in-out
                   ${!twitterLogin 
                     ? 'bg-sky-100 text-sky-400 cursor-not-allowed' 
                     : 'bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'}`
                  }
      >
        <FaTwitter className="text-xl mr-3" />
        <span className="font-semibold text-base">Continue with X (Twitter)</span>
      </button>

      {/* Note: I've added checks to disable buttons if the login method isn't available from useAuth, 
          which is a good practice for incomplete implementations. */}
    </div>
  );
};

export default SocialLogin;