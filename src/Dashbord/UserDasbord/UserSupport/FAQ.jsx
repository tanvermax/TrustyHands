import React from "react";
import { HelpCircle, FileText, CreditCard, Wrench, Clock } from "lucide-react";

const FAQ = () => {
  const faqList = [
    {
      icon: HelpCircle,
      q: "What services do you provide?",
      a: "We offer plumbing, electrical repair, AC servicing, appliance repair, cleaning, pest control and other essential home services performed by verified professionals.",
    },
    {
      icon: FileText,
      q: "How do I book a service?",
      a: "Choose your service, select date & time, add address, confirm booking and pay using card or mobile banking.",
    },
    {
      icon: CreditCard,
      q: "What payment methods do you accept?",
      a: "We accept Bkash, Nagad, Visa, Mastercard and Cash on Delivery depending on the service.",
    },
    {
      icon: Wrench,
      q: "What if I am not satisfied with the service?",
      a: "You can request a free re-service within 48 hours after completion.",
    },
    {
      icon: Clock,
      q: "Can I cancel or reschedule my booking?",
      a: "Yes, you can cancel or reschedule up to 2 hours before the scheduled time.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">FAQ & Documentation</h1>
      <p className="text-lg text-gray-600 mb-10">
        Find answers to commonly asked questions about our home services.
      </p>

      <div className="space-y-6">
        {faqList.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-start gap-4">
              <item.icon className="w-8 h-8 text-indigo-600" />

              <div>
                <h2 className="text-xl font-semibold text-gray-800">{item.q}</h2>
                <p className="text-gray-600 mt-2">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-10 text-center">
        Still need help? Contact our support team anytime.
      </p>
    </div>
  );
};

export default FAQ;
