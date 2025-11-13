
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import useUserData from "../../Hook/useUserData";

const ProviderTransactions = () => {
  const { profile, loading: isAuthLoading } = useUserData();
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://trusty-hands-backend.vercel.app";

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!profile?.email) {
        setError("Unable to fetch data: user not authenticated.");
        return;
      }

      // Fetch full provider info (wallet + transactions)
      const response = await axios.get(
        `${API_BASE_URL}/user/${profile.email}`
      );

      if (response.data) {
        setTransactions(response.data.transactions || []);
        setWallet(response.data.wallet || 0);
      } else {
        setError("Failed to fetch provider data.");
      }
    } catch (err) {
      console.error("Fetch Transactions Error:", err);
      setError("Could not connect to the provider transaction API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && profile?.email) {
      fetchTransactions();
    }
  }, [isAuthLoading, profile]);

  const getTransactionStyle = (type) => {
    switch (type) {
      case "service_payout":
        return "text-green-600 bg-green-50 border-green-200";
      case "service_deduction":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="text-center p-8 text-xl">Loading transactions...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-6 text-lg">{error}</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-2">
        My Wallet Transactions
      </h1>

      {/* Wallet Summary */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wallet className="w-8 h-8 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Current Wallet Balance</p>
            <h2 className="text-2xl font-bold text-indigo-700">${wallet}</h2>
          </div>
        </div>
        <button
          onClick={fetchTransactions}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Transaction Table */}
      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No transactions found.
        </div>
      ) : (
        <div className="shadow-md border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Service ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions
                .slice()
                .reverse() // show latest first
                .map((tx, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium ${getTransactionStyle(
                          tx.type
                        )}`}
                      >
                        {tx.type === "service_payout" ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {tx.type.replace("_", " ")}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      ${tx.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {tx.serviceId || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {tx.timestamp
                        ? new Date(tx.timestamp).toLocaleString()
                        : "Unknown"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProviderTransactions;
