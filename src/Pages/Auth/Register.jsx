import  { useContext, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "aos/dist/aos.css";
import Aos from "aos";
import { toast } from "react-toastify";
import { AuthContext } from "../../AuthProvider.jsx/AuthPovider";

const Register = () => {
  const { registerwihtgmail, day, googlelogin, setUser, updateUser } =
    useContext(AuthContext);

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const navigate = useNavigate();

  const handleregisteruser = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photoURL = form.photourl.value;
    const role = form.role.value || "user";

    const user = { name, email, password, photoURL, role };

    registerwihtgmail(email, password)
      .then((result) => {
        setUser(result.user);
        updateUser({ displayName: name, photoURL: photoURL });
        fetch("https://trusty-hands-backend.vercel.app/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.insertedId) {
              toast.success("Account created successfully 🎉");
              navigate("/");
            }
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div
        data-aos="fade-up"
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join us today and unlock premium features
        </p>

        {/* Form */}
        <form onSubmit={handleregisteruser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="photourl"
              placeholder="Photo URL"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              name="role"
              defaultValue="user"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="user">User</option>
              <option value="serviceProvider">Service Provider</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={googlelogin}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-2xl" /> Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
