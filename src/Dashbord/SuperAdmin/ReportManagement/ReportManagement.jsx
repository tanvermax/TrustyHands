import React, { useState } from 'react';
import { Mail, Briefcase, AlertTriangle, CheckCircle } from 'lucide-react';

// --- MOCK DATA ---
// In a real application, this data would come from a backend API call.
const mockReports = [
    {
        id: 'RPT-001',
        type: 'User Report',
        source: 'john@gmail.com',
        subject: 'Service Provider No-Show (ID: S-101)',
        status: 'Open',
        date: '2025-09-01',
        priority: 'High',
        details: "The assigned plumber failed to show up for the 9 AM appointment and is unreachable."
    },
    {
        id: 'RPT-002',
        type: 'Provider Report',
        source: 'tanver@gmail.com',
        subject: 'Client provided wrong address',
        status: 'Open',
        date: '2025-09-02',
        priority: 'Medium',
        details: "Arrived at the location specified but the client claimed it was incorrect and refused to pay for travel time."
    },
    {
        id: 'RPT-003',
        type: 'User Report',
        source: 'alice@gmail.com',
        subject: 'Billing discrepancy on order X-456',
        status: 'Closed',
        date: '2025-08-28',
        priority: 'Low',
        details: "The final cost was $20 higher than the quote. Need clarification on the extra charge."
    },
    {
        id: 'RPT-004',
        type: 'Provider Report',
        source: 'fixit@gmail.com',
        subject: 'Technical issue with booking platform',
        status: 'Open',
        date: '2025-09-05',
        priority: 'Medium',
        details: "The 'Accept' button is greyed out for new requests."
    },
];

const ReportManagement = () => {
    const [reports, setReports] = useState(mockReports);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');

    // --- Filtering Logic ---
    const filteredReports = reports.filter(report => {
        const statusMatch = filterStatus === 'All' || report.status === filterStatus;
        const typeMatch = filterType === 'All' || report.type === filterType;
        return statusMatch && typeMatch;
    });

    // --- Action Handlers (Frontend Mock) ---
    const handleUpdateStatus = (id, newStatus) => {
        setReports(prevReports =>
            prevReports.map(report =>
                report.id === id ? { ...report, status: newStatus } : report
            )
        );
    };

    // Helper for Status Styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Closed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management Dashboard</h1>
            <p className="text-gray-600 mb-6 border-b pb-3">Review and manage reports submitted by clients and service providers.</p>

            {/* --- Filters and Summary --- */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 shadow-md">
                
                {/* Status Filter */}
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <label className="text-sm font-medium text-gray-700">Filter Status:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md bg-white text-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Pending">Pending Review</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Type Filter */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Filter By Source:</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md bg-white text-sm"
                    >
                        <option value="All">All Sources</option>
                        <option value="User Report">Client Reports</option>
                        <option value="Provider Report">Provider Reports</option>
                    </select>
                </div>
            </div>

            {/* --- Report Table --- */}
            <div className="shadow-lg overflow-x-auto border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source / Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject / Details</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-10 text-center text-gray-500">No reports match the current filters.</td>
                            </tr>
                        ) : (
                            filteredReports.map((report) => (
                                <tr key={report.id} className={report.priority === 'High' ? 'bg-red-50' : ''}>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <div className="font-semibold text-gray-800">{report.id}</div>
                                        <div className="text-xs">{report.date}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <div className="font-medium text-gray-900">{report.source}</div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.type === 'User Report' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
                                            {report.type === 'User Report' ? <Mail size={12} className="inline mr-1" /> : <Briefcase size={12} className="inline mr-1" />}
                                            {report.type.replace(' Report', '')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <div className="font-semibold">{report.subject}</div>
                                        <div className="text-gray-500 text-xs truncate w-64">{report.details}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium space-x-2 whitespace-nowrap">
                                        {report.status !== 'Closed' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(report.id, 'Pending')}
                                                    className="text-xs py-1 px-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                                                    disabled={report.status === 'Pending'}
                                                >
                                                    {report.status === 'Pending' ? 'Pending' : 'Set Pending'}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(report.id, 'Closed')}
                                                    className="text-xs py-1 px-2 bg-green-600 hover:bg-green-700 text-white rounded"
                                                >
                                                    <CheckCircle size={14} className="inline mr-1" />
                                                    Close
                                                </button>
                                            </>
                                        )}
                                        {report.status === 'Closed' && (
                                            <span className="text-gray-500 text-xs">Action Complete</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 text-sm text-gray-500">
                Total Reports Displayed: {filteredReports.length}
            </div>
        </div>
    );
};

export default ReportManagement;