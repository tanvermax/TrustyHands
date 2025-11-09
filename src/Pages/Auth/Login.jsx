import React, { useContext, useEffect } from "react";
import 'aos/dist/aos.css';
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Aos from "aos";
import { toast } from "react-toastify";
import { AuthContext } from "../../AuthProvider.jsx/AuthPovider";
import SocialLogin from "./SocialLogin";
import useAuth from "../../Provider/useAuth";
import { MdEmail, MdOutlineSecurity } from "react-icons/md"; // Import icons

const Login = () => {

  // Destructure login function
  const { loginwihtpass } = useContext(AuthContext);
  

  const { user: currentUser } = useAuth(); 
  const navigate = useNavigate();

  
  useEffect(() => {
    if (currentUser) {
     
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handlelogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    loginwihtpass(email, password)
      .then((result) => {
        console.log(result.user);
        toast.success("Welcome back! Login successful 🎉");
        navigate("/");
      })
      .catch((error) => {
        console.error(error.message);
        // Display a general error for failed login
        toast.error("Login failed. Please check your email and password.");
      });
  };
  
  // Reusable Input Field Component with Icon
  const InputField = ({ label, name, type, placeholder, icon: Icon, required = false }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
        <Icon className="mr-2 text-blue-500" /> {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
        />
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );

  // Removed unused 'day' prop logic for a clean, consistent white/gray theme
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Helmet>
        <title>Login | Trusty Hands</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-12">
        
        {/* === Left Side: Marketing/Greeting Content === */}
        <div data-aos="fade-up" className="text-center lg:text-left lg:w-1/2 p-6">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-4 tracking-tight">
            Welcome Back!
          </h1>
         
          <img 
            src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" // Placeholder image for a login illustration
            alt="Login Illustration"
            className="hidden lg:block w-full max-w-sm mt-8 mx-auto lg:mx-0 rounded-lg shadow-lg"
            data-aos="fade-right"
            data-aos-delay="300"
          />
        </div>

        {/* === Right Side: Login Form Card === */}
        <div
          data-aos="fade-left"
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 transform hover:shadow-3xl transition duration-500 lg:w-1/2"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Sign In to Your Account
          </h2>

          <form onSubmit={handlelogin} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={MdEmail}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={MdOutlineSecurity}
              required
            />
            
            <div className="flex justify-between items-center pt-2">
              {/* This checkbox is often included for better UX */}
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2" />
                Keep me logged in
              </label>
              <Link
                to="/forgot-password" // Assuming you have a forgot password route
                className="text-sm text-blue-600 font-medium hover:text-blue-800 hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300 transform hover:scale-[1.01]"
            >
              Secure Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t-2 border-gray-200" />
            <span className="mx-4 text-gray-500 font-medium text-sm">OR SIGN IN WITH</span>
            <hr className="flex-grow border-t-2 border-gray-200" />
          </div>

          <SocialLogin />
          
          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600 text-base">
            New to Trusty Hands?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-extrabold hover:text-blue-800 transition duration-200 hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;