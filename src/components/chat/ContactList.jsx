// components/chat/ContactList.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const ContactList = ({ contacts, selectedContact, onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
              selectedContact?.id === contact.id ? 'bg-gray-100' : ''
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
              {contact.avatar || contact.name[0]}
            </div>

            {/* Contact Info */}
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{contact.name}</span>
                <span className="text-xs text-gray-500">12:30 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 truncate">{contact.lastMessage}</span>
                {contact.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;