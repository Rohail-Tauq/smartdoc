import { useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ExtractedData() {
  const [search, setSearch] = useState("");

  // Dummy extracted data
  const data = [
    { id: 1, vendor: "Amazon", date: "2025-09-01", amount: 120.5, status: "Processed" },
    { id: 2, vendor: "Starbucks", date: "2025-09-02", amount: 15.2, status: "Processed" },
    { id: 3, vendor: "Apple", date: "2025-08-30", amount: 999.99, status: "Pending" },
    { id: 4, vendor: "Walmart", date: "2025-08-28", amount: 45.75, status: "Processed" },
  ];

  // Filtered results
  const filteredData = data.filter((item) =>
    item.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar tag */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header tag */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">Extracted Data</h2>

          {/* Search Bar */}
          <div className="relative w-full md:w-1/3 mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by vendor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-gray-600">Vendor</th>
                  <th className="px-6 py-3 text-gray-600">Date</th>
                  <th className="px-6 py-3 text-gray-600">Amount</th>
                  <th className="px-6 py-3 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition border-b last:border-b-0"
                    >
                      <td className="px-6 py-4 font-medium">{item.vendor}</td>
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6 py-4 text-indigo-600 font-semibold">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === "Processed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
