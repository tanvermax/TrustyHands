import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "aos/dist/aos.css";
import Aos from "aos";
import { toast } from "react-toastify";
import { AuthContext } from "../../AuthProvider.jsx/AuthPovider";
import SocialLogin from "./SocialLogin";
import { MdOutlineSecurity, MdEmail, MdPerson, MdCameraAlt, MdLocationOn } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";

const Register = () => {
  // Removed unused imports: FcGoogle, googlelogin, day
  const { registerwihtgmail, setUser, updateUser } = useContext(AuthContext);

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
    const area = form.area.value;
    const role = form.role.value || "user";

    // --- Client-Side Validation for better UX ---
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      return toast.error("Password must contain at least one capital letter.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return toast.error("Password must contain at least one special character (!@#$%^&*).");
    }
    // --- End Validation ---

    const user = { name, email, password, photoURL, area, role };

    registerwihtgmail(email, password)
      .then((result) => {
        // Update user profile immediately after successful creation
        updateUser({ displayName: name, photoURL: photoURL })
          .then(() => {
            // Set user state with updated profile information
            setUser({ ...result.user, displayName: name, photoURL: photoURL });

            // Post user data to backend
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
              })
              .catch(() => toast.error("Failed to save user data to database."));
          })
          .catch((error) => {
            console.error("Profile Update Error:", error);
            toast.error("Account created, but failed to update profile name/photo.");
            navigate("/"); // Navigate home even if profile update failed
          });
      })
      .catch((error) => {
        // Display Firebase specific error messages
        const errorMessage = error.message.includes('email-already-in-use')
          ? "This email is already registered."
          : "Registration failed. Please check your credentials.";
        console.log(error.message);
        toast.error(errorMessage);
      });
  };

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
          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
        />
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Helmet>
        <title>Register | Trusty Hands</title>
      </Helmet>

      <div
        data-aos="fade-up"
        className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 transform hover:shadow-3xl transition duration-500"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight">
            Join Trusty Hands
          </h1>
          <p className="text-gray-500 text-lg">
            Create your account in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleregisteruser} className="space-y-5">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            placeholder="Your full name"
            icon={MdPerson}
          />
          <InputField
            label="Profile Image URL"
            name="photourl"
            type="text"
            placeholder="Link to your profile picture"
            icon={MdCameraAlt}
          />
          <InputField
            label="Your City or Nearest Area"
            name="area"
            type="text"
            placeholder="e.g., Dhaka, New York, or a specific neighborhood"
            icon={MdLocationOn}
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={MdEmail}
            required
          />
          <InputField
            label="Password (min 6 chars, 1 capital, 1 special)"
            name="password"
            type="password"
            placeholder="Secure password"
            icon={MdOutlineSecurity}
            required
          />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <HiUserGroup className="mr-2 text-blue-500" /> Select Role
            </label>
            <select
              name="role"
              defaultValue="user"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300 appearance-none"
            >
              <option value="user">User (I need services)</option>
              <option value="serviceProvider">Service Provider (I offer services)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300 transform hover:scale-[1.01]"
          >
            Create My Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <hr className="flex-grow border-t-2 border-gray-200" />
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <hr className="flex-grow border-t-2 border-gray-200" />
        </div>

        {/* Social Login */}
        <SocialLogin />

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-extrabold hover:text-blue-800 transition duration-200 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;