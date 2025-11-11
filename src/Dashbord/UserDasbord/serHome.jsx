import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaGift, FaTags, FaStar } from "react-icons/fa";
import UTransactionHistory from "./UTransactionHistory/UTransactionHistory";

const UserHome = ({ userEmail }) => {
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch offers and coupons (dummy endpoints, replace with your API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const offersRes = await axios.get("https://trusty-hands-backend.vercel.app/offers");
        const couponsRes = await axios.get("https://trusty-hands-backend.vercel.app/coupons", {
          params: { email: userEmail },
        });
        setOffers(offersRes.data || []);
        setCoupons(couponsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading your dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard!</h1>

      {/* Offers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaGift className="mr-2" /> Special Offers
        </h2>
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-blue-100 p-4 rounded-lg shadow hover:bg-blue-200 transition"
              >
                <h3 className="font-semibold">{offer.title}</h3>
                <p className="text-sm">{offer.description}</p>
                <p className="text-green-700 font-bold mt-2">{offer.discount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No offers available at the moment.</p>
        )}
      </div>

      {/* Coupons Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTags className="mr-2" /> Your Coupons
        </h2>
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-yellow-100 p-4 rounded-lg shadow hover:bg-yellow-200 transition"
              >
                <h3 className="font-semibold">{coupon.code}</h3>
                <p className="text-sm">{coupon.description}</p>
                <p className="text-red-600 font-bold mt-2">{coupon.discount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You don't have any coupons yet.</p>
        )}
      </div>

      {/* Recommended Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaStar className="mr-2" /> Recommended Services
        </h2>
        <p>Check back soon for personalized recommendations!</p>
      </div>
      <div className=" overflow-auto h-80 ">
        <UTransactionHistory/>
      </div>
    </div>
  );
};

export default UserHome;
