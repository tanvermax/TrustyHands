import React, { useState } from 'react';
import useUserData from '../../../Hook/useUserData';
import axios from 'axios';
// Assuming useUserData provides the current profile and potentially a function to simulate a wallet update
// import useUserData from '../../Hook/useUserData'; 

const WalletRecharge = () => {

    // Dummy state for demonstration
    const { profile } = useUserData();


    const [currentBalance, setCurrentBalance] = useState(profile?.wallet || 0);

    // Other state variables remain the same
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [message, setMessage] = useState(''); // Use this hook when integrated
    console.log(profile)
    const paymentMethods = [
        { name: 'bKash', icon: '🇧🇩', color: 'bg-pink-600', description: 'Mobile Financial Service (MFS)' },
        { name: 'Nagad', icon: '💰', color: 'bg-orange-500', description: 'Mobile Financial Service (MFS)' },
        { name: 'Visa/Mastercard', icon: '💳', color: 'bg-blue-600', description: 'Credit/Debit Card' },
    ];

    const handleRecharge = async (e) => {
        e.preventDefault();
        setMessage('');

        const amount = parseFloat(rechargeAmount);

        if (!amount || amount <= 0) {
            setMessage('Please enter a valid amount.');
            return;
        }

        if (!selectedMethod) {
            setMessage('Please select a payment method.');
            return;
        }

        // 🔑 DUMMY SUCCESS SIMULATION
        // In a real application, you would:
        // 1. Call a backend API endpoint (e.g., /api/recharge)
        // 2. The API initiates payment with the chosen method.
        // 3. Upon successful payment callback, the backend updates the user's wallet.

        try {
            setMessage('⏳ Processing recharge... Please wait.');

            // Axios automatically handles JSON stringification for the body
            const response = await axios.post('http://localhost:5000/recharge', {
                amount: amount,
                userId: profile?._id,
                method: selectedMethod,
                // You should use the actual user ID from your profile object
                userId: profile._id,
            });

            // Axios puts the response body directly on response.data
            const data = response.data;
            // console.log(data)
            // 1. Update local state
            const newBalance = data.newBalance;
            setCurrentBalance(newBalance);

            // 2. Trigger global state update (if applicable)
            // updateWallet(newBalance); 

            setMessage(`✅ Success! Taka ${amount.toFixed(2)} added via ${selectedMethod}. New balance: Taka ${newBalance.toFixed(2)}`);
            setRechargeAmount('');
            setSelectedMethod('');

        } catch (error) {
            // Axios wraps error responses (4xx, 5xx) in error.response
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            console.error('Recharge Error:', error);
            setMessage(`❌ Error: ${errorMessage}`);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">💳 Wallet Recharge</h2>

            {/* Current Balance Display */}
            <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mb-6 rounded-lg">
                <p className="font-bold">Current Wallet Balance:</p>
                <p className="text-2xl font-mono">Taka :{currentBalance.toFixed(2)}</p>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`p-3 rounded mb-4 ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleRecharge}>
                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="amount">
                        Recharge Amount (USD)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="1"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        placeholder="Enter amount (e.g., 50.00)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                        required
                    />
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-3">
                        Select Payment Method
                    </label>
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.name}
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${selectedMethod === method.name
                                    ? `${method.color} text-white border-4 border-black`
                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-300'}`
                                }
                                onClick={() => setSelectedMethod(method.name)}
                            >
                                <span className="text-3xl mr-3">{method.icon}</span>
                                <div>
                                    <p className="font-bold text-lg">{method.name}</p>
                                    <p className="text-sm">{method.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                    disabled={!rechargeAmount || !selectedMethod}
                >
                    Recharge Wallet
                </button>
            </form>
        </div>
    );
};

export default WalletRecharge;