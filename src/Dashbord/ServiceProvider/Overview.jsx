// ServiceOverview.jsx
import React from "react";

const ServiceOverview = () => {
  // Example data, you can fetch from API later
  const stats = [
    { title: "Total Services", value: 12 },
    { title: "Active Orders", value: 8 },
    { title: "Completed Orders", value: 25 },
    { title: "Earnings (USD)", value: "$3,450" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Service Provider Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <h2 className="text-gray-500 font-medium">{stat.title}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Optional: Recent Orders Table */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Order ID</th>
              <th className="border-b py-2">Client</th>
              <th className="border-b py-2">Service</th>
              <th className="border-b py-2">Status</th>
              <th className="border-b py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 border-b">#001</td>
              <td className="py-2 border-b">John Doe</td>
              <td className="py-2 border-b">Web Design</td>
              <td className="py-2 border-b text-green-600">Completed</td>
              <td className="py-2 border-b">$250</td>
            </tr>
            <tr>
              <td className="py-2 border-b">#002</td>
              <td className="py-2 border-b">Jane Smith</td>
              <td className="py-2 border-b">Logo Design</td>
              <td className="py-2 border-b text-yellow-600">In Progress</td>
              <td className="py-2 border-b">$100</td>
            </tr>
            <tr>
              <td className="py-2 border-b">#003</td>
              <td className="py-2 border-b">Alice Brown</td>
              <td className="py-2 border-b">SEO Service</td>
              <td className="py-2 border-b text-red-600">Pending</td>
              <td className="py-2 border-b">$180</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceOverview;
