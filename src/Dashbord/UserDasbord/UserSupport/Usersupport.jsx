import React from 'react';
import { Mail, MessageSquare, BookOpen, Search } from 'lucide-react'; // Assuming you use lucide-react or similar icons

// Define the structure for quick links
const supportLinks = [
  {
    icon: BookOpen,
    title: "FAQ & Documentation",
    description: "Find instant answers to common questions and service instructions.",
    buttonText: "Browse Articles",
    link: "/help/faq" // Link to your internal FAQ page
  },
  {
    icon: Search,
    title: "Track an Existing Issue",
    description: "Check the status of a previous support ticket or order problem.",
    buttonText: "Check Status",
    link: "/help/status" // Link to your ticket tracking page
  },
];

const Support = () => {
    // State to toggle the contact form visibility (optional, for SPA feeling)
    const [showContactForm, setShowContactForm] = React.useState(false);

    // Simple handler to simulate form submission (since no backend is used)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you soon.");
        setShowContactForm(false);
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 border-b pb-2">
                Need Help?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                We're here to assist with your plumbing and service inquiries. Choose an option below.
            </p>

            {/* --- 1. Quick Self-Service Links --- */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
                {supportLinks.map((item, index) => (
                    <div 
                        key={index} 
                        className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                    >
                        <item.icon className="w-8 h-8 text-indigo-600 mb-3" />
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                        <a 
                            href={item.link} 
                            className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                        >
                            {item.buttonText}
                        </a>
                    </div>
                ))}
            </div>
            
            <hr className="my-8 border-gray-300" />

            {/* --- 2. Direct Contact Options --- */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us Directly</h2>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Contact Form Button/Toggle */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <Mail className="w-7 h-7 text-green-600 mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-4 text-sm">Send us a detailed message. We aim to respond within 24 hours.</p>
                    <button 
                        onClick={() => setShowContactForm(!showContactForm)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    >
                        {showContactForm ? 'Close Form' : 'Open Contact Form'}
                    </button>
                </div>

                {/* Live Chat Option */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <MessageSquare className="w-7 h-7 text-pink-600 mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Live Chat (External)</h3>
                    <p className="text-gray-600 mb-4 text-sm">Chat with a representative for immediate assistance (Available 9 AM - 5 PM).</p>
                    <a 
                        href="javascript:void(0)" // Placeholder for external chat integration (e.g., Tidio, Intercom)
                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition"
                    >
                        Start Chat
                    </a>
                </div>
            </div>

            {/* --- 3. Contact Form (Conditional) --- */}
            {showContactForm && (
                <div className="mt-10 p-8 bg-white border border-gray-300 rounded-xl shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Submit Your Inquiry</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input type="text" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="issue" className="block text-sm font-medium text-gray-700">Briefly Describe Your Issue</label>
                            <select id="issue" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                <option value="">Select a topic</option>
                                <option value="order">Order/Billing Issue</option>
                                <option value="technical">Technical Support</option>
                                <option value="service">General Service Inquiry</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Detailed Message</label>
                            <textarea id="message" rows="4" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            )}

            {/* --- 4. Additional Info --- */}
            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>For urgent service requests, please call us directly at 📞 (555) 123-4567.</p>
            </div>
        </div>
    );
};

export default Support;