import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto bg-white min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 border-b pb-2">
                Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Last Updated: October 7, 2025
            </p>

            {/* --- 1. Agreement to Terms --- */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                1. Acceptance of Terms
            </h2>
            <p className="mb-4 text-gray-700 text-base">
                By accessing or using the services provided by **[Your Company Name]** ("the Company," "we," "us," or "our") through our website or mobile application (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with all of these Terms, you are expressly prohibited from using the Service.
            </p>
            
            <hr className="my-6 border-gray-200" />

            {/* --- 2. Service Description --- */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                2. Description of Service
            </h2>
            <p className="mb-2 text-gray-700 text-base">
                The Service provides an online platform connecting users ("Clients") seeking home services (e.g., plumbing, electrical, cleaning) with independent, vetted service providers ("Professionals").
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 text-sm">
                <li>The Company acts solely as a **platform** to facilitate bookings.</li>
                <li>The Company **does not** employ the Professionals. Professionals are independent contractors.</li>
                <li>The Company is not responsible for the quality of the service provided by the Professional, though we maintain quality assurance standards.</li>
            </ul>

            <hr className="my-6 border-gray-200" />

            {/* --- 3. User Obligations and Responsibilities --- */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                3. Booking, Payment, and Cancellation
            </h2>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">3.1. Pricing and Payment</h3>
                <p className="text-gray-700 text-base">
                    All prices are displayed on the Service. You agree to pay all fees and charges incurred in connection with your bookings, including applicable taxes, at the rates in effect when the charges were incurred. Payment is generally processed upon **completion of the service**.
                </p>

                <h3 className="text-xl font-semibold text-gray-800">3.2. Cancellation Policy</h3>
                <p className="text-gray-700 text-base">
                    You may cancel a booking through the Service. Cancellations made **less than 24 hours** before the scheduled service time may incur a cancellation fee, as outlined in our Cancellation Policy documentation. Repeated cancellations may lead to account suspension.
                </p>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* --- 4. User Conduct and Content --- */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                4. Intellectual Property and Liability
            </h2>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">4.1. Liability Disclaimer</h3>
                <p className="text-gray-700 text-base">
                    The Service is provided on an "as-is" and "as-available" basis. The Company makes no representations or warranties regarding the Professionals' work or suitability. Your use of the Service is at your sole risk.
                </p>

                <h3 className="text-xl font-semibold text-gray-800">4.2. Dispute Resolution</h3>
                <p className="text-gray-700 text-base">
                    Any dispute between you and a Professional must first be attempted to be resolved between the two parties. The Company may offer **mediation assistance** but is under no obligation to resolve disputes. For financial disputes, the Company's decision on chargebacks is final.
                </p>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* --- 5. Governing Law --- */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                5. Governing Law
            </h2>
            <p className="mb-4 text-gray-700 text-base">
                These Terms are governed by and construed in accordance with the laws of the jurisdiction where **[Your Company Name]** is registered, without regard to its conflict of law principles.
            </p>

            <div className="mt-12 text-center text-gray-500 text-sm p-4 border-t border-gray-200">
                <p>For questions or comments regarding these Terms, please contact us at: **legal@[yourdomain].com**</p>
            </div>
        </div>
    );
};

export default TermsAndConditions;