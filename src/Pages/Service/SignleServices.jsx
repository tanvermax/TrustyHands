import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import useAuth from "../../Provider/useAuth";
import useUserData from "../../Hook/useUserData";
import { toast } from "react-toastify";

const SignleServices = () => {
  const { User, day } = useAuth();
  const loadData = useLoaderData();
  const { profile } = useUserData();
  const normalize = (text) =>
    text
      ?.toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];

  const serviceAreas = normalize(loadData.serviceArea);
  const userAreas = normalize(profile?.area); 
  
  const isAvailable = userAreas.some((ua) =>
    serviceAreas.some((sa) => sa.includes(ua) || ua.includes(sa))
  );

  const [availabilityMessage, setAvailabilityMessage] = useState('');

  
  useEffect(() => {
   
    if (profile && loadData.serviceArea && profile.area) {
        if (!isAvailable) {
          
            setAvailabilityMessage(`❌ This service is not available in your registered area (${profile.area}). Service is limited to: ${loadData.serviceArea}.`);
        } else {
            setAvailabilityMessage('');
        }
    }
  }, [profile, loadData.serviceArea, isAvailable]);
  
  
  const handleService = async (e) => {
    e.preventDefault();
 
    if (!isAvailable) {
        alert("Booking failed: This service is not available in your area.");
        return;
    }
    
    const form = e.target;

    // Combine date and time
    const serviceDateTime = `${form.serviceDate.value}T${form.serviceTime.value}`;

    const orderDetails = {
      orderid: form.orderid.value,
      servicename: form.servicename.value,
      instruction: form.instruction.value,
      serviceprovider: form.serviceprovider.value,
      serviceprovideremail: form.serviceprovideremail.value,
      cost: Number(form.cost.value),
      serviceStatus: "Pending",
      ordergivenusername: profile.name,
      ordergivenuseremail: profile.email,
      serviceDate: serviceDateTime, // Now includes both date and time
      userId: profile._id,
      escrowStatus: "DeductedFromUser"
    };
console.log(orderDetails)
    try {
      const res = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      // console.log(res)
      const data = await res.json();
      if (data.insertedId) {
        console.log(data)
        toast.success("Service booked successfully!")
        // alert("Service booked successfully!");
        document.getElementById("my_modal_5").close();
      } else {
        toast.error("Booking failed. Please try again.")
        //  alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred during booking. Check console.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <div className={`rounded-lg overflow-hidden shadow-md ${day ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        {/* Service Details Display */}
        <img src={loadData.imageUrl} alt="Service" className="w-full h-72 object-cover" />

        <div className="p-6">
          {/* ... (rest of service details) ... */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-3xl font-bold">{loadData.serviceName}</h2>
            <span className="text-lg font-semibold">{loadData.price}$</span>
          </div>

          <p className="text-sm md:text-base mb-2">
            {loadData.description}
          </p>
          <p className="text-sm text-gray-500">
            Service Area: <strong>{loadData.serviceArea}</strong>
          </p>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm font-medium">{loadData.providername}</div>
            <img src={loadData.providerphoto} alt="Provider" className="h-12 w-12 rounded-full border-2" />
          </div>
        </div>
      </div>
      
      {/* Availability Message Display */}
      {availabilityMessage && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
            {availabilityMessage}
        </div>
      )}

      {/* Book Now Button */}
      <div className="text-center mt-6">
        <button
          className={`py-2 px-5 rounded font-semibold transition duration-200 
            ${isAvailable // ⬅️ Changed to use 'isAvailable'
                ? (day ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-700 hover:bg-blue-800 text-white") 
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          // Disable the button if the service is NOT available
          disabled={!isAvailable} // ⬅️ Changed to use 'isAvailable'
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          {isAvailable ? "Book Now" : "Unavailable in Your Area"} 
        </button>
      </div>

      {/* Booking Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black">
          <h3 className="font-bold text-lg mb-4">Complete Your Booking</h3>
          <form onSubmit={handleService} className="space-y-4">
            {/* ... form fields remain the same ... */}
            {[
              { label: "Service ID", name: "orderid", value: loadData._id },
              { label: "Service Name", name: "servicename", value: loadData.serviceName },
              { label: "Provider Name", name: "serviceprovider", value: loadData.providername },
              { label: "Provider Email", name: "serviceprovideremail", value: loadData.provideremail },
              { label: "User Name", value: User.displayName },
              { label: "User Email", value: User.email },
              { label: "Cost ($)", name: "cost", value: loadData.price },
            ].map(({ label, name, value }) => (
              <div key={name || label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  defaultValue={value}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            ))}

            {/* Date and Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Date</label>
                <input
                  type="date"
                  name="serviceDate"
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Service Time</label>
                <input
                  type="time"
                  name="serviceTime"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Special Instructions</label>
              <textarea
                name="instruction"
                defaultValue="Address, area, customized service plan"
                rows="3"
                className="w-full px-3 py-2 border rounded-md"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => document.getElementById("my_modal_5").close()}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default SignleServices;