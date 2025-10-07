import React, { useState } from 'react';
import { Mail, User, Briefcase, ChevronRight, MessageSquare, Clock } from 'lucide-react';

// --- MOCK DATA ---
// In a real application, this data would be fetched from a backend API call.
const mockMessages = [
    {
        id: 'MSG-001',
        sender: 'john@gmail.com',
        senderType: 'Client',
        subject: 'Follow-up on Plumber Appointment',
        status: 'Unread',
        date: '2025-10-06 10:30 AM',
        content: "Just checking if the plumber, Tanver, received my updated address for the service scheduled tomorrow morning."
    },
    {
        id: 'MSG-002',
        sender: 'fixit@gmail.com',
        senderType: 'Provider',
        subject: 'Request for Profile Update',
        status: 'Unread',
        date: '2025-10-06 09:15 AM',
        content: "I need to update my service area to include the North District. Could an admin please assist with this change?"
    },
    {
        id: 'MSG-003',
        sender: 'alice@gmail.com',
        senderType: 'Client',
        subject: 'Complaint about Service Quality (Ref: 456)',
        status: 'Read',
        date: '2025-10-05 03:00 PM',
        content: "The electrical wiring service completed yesterday failed inspection. I require a full refund or a different provider to fix the issue."
    },
    {
        id: 'MSG-004',
        sender: 'tanver@gmail.com',
        senderType: 'Provider',
        subject: 'Question regarding new payment system',
        status: 'Read',
        date: '2025-10-04 11:45 AM',
        content: "When should I expect the payment for the services completed last week? I haven't seen the deposit yet."
    },
];

const AdminMessageInbox = () => {
    const [messages, setMessages] = useState(mockMessages);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [selectedMessage, setSelectedMessage] = useState(null);

    // --- Filtering Logic ---
    const filteredMessages = messages.filter(message => {
        const statusMatch = filterStatus === 'All' || message.status === filterStatus;
        const typeMatch = filterType === 'All' || message.senderType === filterType;
        return statusMatch && typeMatch;
    });

    // --- Action Handlers (Frontend Mock) ---
    const handleMarkAsRead = (id) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === id ? { ...msg, status: 'Read' } : msg
            )
        );
    };

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        if (message.status === 'Unread') {
            handleMarkAsRead(message.id);
        }
    };

    // Helper for Status Styling
    const getStatusStyle = (status) => {
        return status === 'Unread' ? 'bg-indigo-500' : 'bg-gray-500';
    };

    return (
        <div className="p-6 md:p-10 https://trusty-hands-backend.vercel.app mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Message Inbox</h1>
            <p className="text-gray-600 mb-6 border-b pb-3">Central hub for all communication from clients and service providers.</p>

            <div className="flex space-x-6">
                
                {/* --- Message List (70% Width) --- */}
                <div className="w-2/3">
                    {/* Filters */}
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-4 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="p-1 border border-gray-300 rounded-md bg-white text-sm"
                            >
                                <option value="All">All</option>
                                <option value="Unread">Unread</option>
                                <option value="Read">Read</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Source:</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="p-1 border border-gray-300 rounded-md bg-white text-sm"
                            >
                                <option value="All">All</option>
                                <option value="Client">Clients</option>
                                <option value="Provider">Providers</option>
                            </select>
                        </div>
                    </div>

                    {/* List of Messages */}
                    <div className="space-y-2">
                        {filteredMessages.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 border rounded-lg bg-white">No messages match the current filters.</div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition duration-150 ${msg.status === 'Unread' ? 'bg-white border-indigo-200 shadow-md hover:bg-indigo-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    onClick={() => handleViewMessage(msg)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {/* Sender Icon */}
                                            {msg.senderType === 'Client' ? <User size={20} className="text-indigo-600" /> : <Briefcase size={20} className="text-pink-600" />}
                                            
                                            {/* Status Dot */}
                                            <span className={`w-3 h-3 rounded-full ${getStatusStyle(msg.status)}`} title={msg.status}></span>

                                            <p className={`font-semibold ${msg.status === 'Unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {msg.subject}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Clock size={16} />
                                            <span>{msg.date.split(' ')[0]}</span>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                    <p className="ml-8 text-sm text-gray-500 truncate">{msg.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- Message Detail Panel (30% Width) --- */}
                <div className="w-1/3 p-4 border rounded-lg shadow-xl bg-white sticky top-4 self-start">
                    <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800 flex items-center space-x-2">
                        <MessageSquare size={20} />
                        <span>Message Details</span>
                    </h2>
                    
                    {selectedMessage ? (
                        <div className="space-y-4">
                            <p className="text-sm">
                                <span className="font-medium">From:</span> {selectedMessage.sender} 
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedMessage.senderType === 'Client' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
                                    {selectedMessage.senderType}
                                </span>
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Date:</span> {selectedMessage.date}
                            </p>
                            
                            <div className="p-3 bg-gray-50 rounded-md border">
                                <h3 className="text-md font-bold mb-2">{selectedMessage.subject}</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                            </div>

                            <button
                                onClick={() => alert(`Simulating Reply to ${selectedMessage.sender}`)}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition"
                            >
                                Reply (Simulated)
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            Select a message from the left to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessageInbox;