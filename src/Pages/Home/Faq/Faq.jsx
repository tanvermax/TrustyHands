import React from "react";

const faqs = [
  {
    question: "What is TrustyHands?",
    answer:
      "TrustyHands is your one-stop platform for personal and professional services. From electricians, cleaners, plumbers to drivers and freelancers — find, book, and hire trusted service providers easily through our website or app.",
  },
  {
    question: "How does TrustyHands work?",
    answer:
      "Simply enter your location and desired service on our website or app. We connect you with nearby providers, allowing you to choose based on ratings and fixed charges. You can book and schedule services, and our team monitors the job till completion.",
  },
  {
    question: "What are your services?",
    answer:
      "We offer over 100 services, including drivers, electricians, plumbers, photographers, writers, and more. Visit our website for the complete list.",
  },
];

const Faq = () => {
  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <details className="group">
              <summary className="cursor-pointer bg-orange-100 px-5 py-4 text-lg font-medium group-open:bg-orange-200 transition">
                {faq.question}
              </summary>
              <div className="px-5 py-4 text-gray-700 bg-white">
                {faq.answer}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
