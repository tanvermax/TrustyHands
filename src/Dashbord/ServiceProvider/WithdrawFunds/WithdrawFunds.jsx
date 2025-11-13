import React, { useState } from 'react';
import { Wallet, CreditCard, DollarSign, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import useUserData from '../../../Hook/useUserData';
import axios from 'axios';

const API_BASE_URL = "https://trusty-hands-backend.vercel.app"; // backend URL

const paymentMethods = [
  { name: 'Bkash', type: 'bkash', icon: (props) => <DollarSign {...props} />, placeholder: 'Bkash Account Number' },
  { name: 'Bank Transfer', type: 'bank', icon: (props) => <CreditCard {...props} />, placeholder: 'Bank Account Number' },
];

const WithdrawFunds = () => {
  const { profile, loading: isAuthLoading } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    method: paymentMethods[0].type,
    accountNumber: '',
  });

  const walletBalance = profile?.wallet?.toFixed(2) || '0.00';

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawalData.amount);
    const { method, accountNumber } = withdrawalData;

    if (amount <= 0 || isNaN(amount)) return showNotification('error', 'Enter a valid amount.');
    if (amount > profile.wallet) return showNotification('error', 'Insufficient balance.');
    if (!accountNumber.trim()) return showNotification('error', 'Enter your account number.');

    setIsLoading(true);
    setNotification(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/withdraw`, {
        providerEmail: profile.email,
        amount,
        method,
        accountNumber,
      });

      if (response.data?.success) {
        showNotification('success', response.data.message || 'Withdrawal successful.');
        setWithdrawalData({ ...withdrawalData, amount: '', accountNumber: '' });
      } else {
        showNotification('error', response.data?.message || 'Withdrawal failed.');
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      showNotification('error', 'Network error. Could not submit request.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <div className="text-center p-8 text-lg text-gray-600 flex items-center justify-center">Loading user data...</div>;
  }

  if (!profile?.email) {
    return <div className="text-center p-8 text-lg text-red-600">Please log in to manage your funds.</div>;
  }

  const currentMethod = paymentMethods.find(m => m.type === withdrawalData.method) || paymentMethods[0];

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <Wallet className="w-8 h-8 mr-3 text-indigo-600" />
        Withdraw Funds
      </h2>

      {notification && (
        <div className={`p-3 mb-4 rounded-lg flex items-center text-sm ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
          {notification.message}
        </div>
      )}

      {/* Wallet Balance */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border-t-4 border-indigo-600">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Current Balance</span>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          ) : (
            <h3 className="text-4xl font-bold text-gray-900">${walletBalance}</h3>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">Available for withdrawal.</p>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleSubmitWithdrawal} className="bg-white shadow-xl rounded-xl p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">New Withdrawal Request</h3>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount (USD)</label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={withdrawalData.amount}
              onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-lg p-3 transition duration-150"
              placeholder="0.00"
              step="0.01"
              min="0.01"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.type}
                type="button"
                onClick={() => setWithdrawalData({ ...withdrawalData, method: method.type })}
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition duration-200 ${
                  withdrawalData.method === method.type
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-500 hover:bg-gray-50'
                }`}
              >
                {method.icon({ className: 'w-5 h-5 mr-2' })}
                <span className="text-sm font-medium">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
            {currentMethod.placeholder}
          </label>
          <input
            type="text"
            id="accountNumber"
            value={withdrawalData.accountNumber}
            onChange={(e) => setWithdrawalData({ ...withdrawalData, accountNumber: e.target.value })}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 transition duration-150"
            placeholder={currentMethod.placeholder}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || withdrawalData.amount <= 0 || withdrawalData.amount > profile.wallet}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg
           font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit Withdrawal Request'
          )}
        </button>
      </form>
    </div>
  );
};

export default WithdrawFunds;
