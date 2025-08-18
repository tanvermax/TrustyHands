// ContactUs.jsx
import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="py-12 px-4 md:px-8  bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-gray-600 mb-8 text-center">
          Have questions or feedback? Fill out the form below and we'll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-blue-200"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-blue-200"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            className="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-blue-200 resize-none"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* Optional Contact Info */}
        <div className="mt-8 text-center text-gray-600 space-y-2">
          <p>Email: support@trustyhands.com</p>
          <p>Phone: +880 123 456 789</p>
          <p>Address: 123 Main Street, Dhaka, Bangladesh</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
