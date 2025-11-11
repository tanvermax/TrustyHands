import React, { useState, useEffect } from 'react';
// import useAuth from '../../../Provider/useAuth'; // Not needed here
import useUserData from '../../../Hook/useUserData';
// import axios from 'axios'; // Not needed here
import { format } from 'date-fns';

const UTransactionHistory = () => {
  const { profile, loading: profileLoading } = useUserData();
  // We no longer need local state for transactions, we use the profile data directly.
  const [error, setError] = useState(null); // Keep error state for future logic if needed

  // 🔑 1. Directly access the transactions array from the profile.
  // We reverse it here so the newest transaction (last in array) appears at the top.
  const rawTransactions = profile?.transactions || [];
  const transactions = [...rawTransactions].reverse(); // Create a copy and reverse it

  // 🔑 2. Remove the heavy useEffect block, as data is provided by useUserData

  // --- RENDERING LOGIC ---

  if (profileLoading) {
    return (
      <div className="text-center p-8 text-gray-600">
        <span className="animate-spin inline-block h-6 w-6 border-4 border-t-blue-500 border-gray-200 rounded-full mr-3"></span>
        Loading Transactions...
      </div>
    );
  }
  
  // If profile is loaded but transactions property is missing or not an array
  if (!profile || !Array.isArray(profile.transactions)) {
      // setError is not strictly necessary but shows the reason for the failure
      setError('Could not retrieve transaction data from profile.');
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;
  }
  
  const hasTransactions = transactions.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">💰 Transaction History</h2>
      
      {!hasTransactions && (
        <div className="text-center p-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-lg font-medium">No transaction records found.</p>
          <p className="mt-2 text-sm">Start by recharging your wallet or booking a service!</p>
        </div>
      )}

      {hasTransactions && (
        <div className="space-y-4">
          {transactions.map((tx, index) => {
            const isCredit = tx.amount >= 0;
            // Handle cases where timestamp might be a string (from MongoDB) or a Date object
            const date = new Date(tx.timestamp); 
            
            return (
              <div 
                key={tx._id || index} // Key using index as fallback, as transactions might not have _id
                className={`flex justify-between items-center p-4 rounded-lg transition duration-200 ${
                  isCredit ? 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100' : 'bg-red-50 border-l-4 border-red-500 hover:bg-red-100'
                }`}
              >
                {/* Type & Details */}
                <div className="flex flex-col">
                  <span className={`text-lg font-bold ${isCredit ? 'text-green-700' : 'text-red-700'}`}>
                    {tx.type === 'recharge' ? 'Wallet Recharge' : 
                     tx.type === 'service_deduction' ? 'Service Payment' : 'Other'}
                  </span>
                  <span className="text-sm text-gray-600 mt-1">
                    {tx.type === 'recharge' && `Method: ${tx.method}`}
                    {tx.type === 'service_deduction' && `Service ID: ${tx.serviceId.substring(0, 8)}...`}
                    {tx.type === 'service_payout' && `Payout for Order: ${tx.orderId.substring(0, 8)}...`}
                  </span>
                </div>

                {/* Amount & Date */}
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-extrabold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : ''}৳ {Math.abs(tx.amount).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {format(date, 'MMM dd, yyyy h:mm a')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UTransactionHistory;