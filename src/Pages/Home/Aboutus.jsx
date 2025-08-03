import React, { useContext } from "react";
import AuthContext from "../../AuthProvider.jsx/AuhtContext";

const Aboutus = () => {
  const { day } = useContext(AuthContext);

  return (
    <div className="w-11/12 mx-auto space-y-20 py-10 lg:py-20">
      {/* Company Intro */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className={`text-5xl font-bold mb-4 ${day ? "text-white" : "text-gray-900"}`}>
            TrustyHands
          </h1>
          <p className="lg:text-lg text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            TrustyHands is your all-in-one virtual marketplace for household and office services.
            From skilled technicians to independent freelancers, we connect you with trusted professionals
            for your everyday needs. Enjoy transparent pricing, secure payments, and hassle-free bookings.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Bathroom sanitization and deep cleaning</li>
            <li>Pre-agreed, no-bargain pricing</li>
            <li>Eco-friendly, biodegradable chemicals used</li>
          </ul>
          <p className="mt-4 text-sm text-gray-400">
            Trade License: <span className="text-gray-600">TRAD/DNCC/062213/2022</span>
          </p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1615856210162-9ae33390b1a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D"
            alt="TrustyHands Service"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Become Provider */}
      <section className="grid lg:grid-cols-2 gap-10 items-center bg-yellow-100 dark:bg-yellow-200/20 rounded-xl p-10">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            Start as a Service Provider
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Join our growing network of professionals and offer your services to thousands of users across the region.
            Set your schedule, control your rates, and grow your career through TrustyHands.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-md font-semibold transition">
            Become a Service Provider
          </button>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1686178827149-6d55c72d81df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBzZXJ2aWNlfGVufDB8fDB8fHww"
            alt="Become a Service Provider"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Aboutus;
