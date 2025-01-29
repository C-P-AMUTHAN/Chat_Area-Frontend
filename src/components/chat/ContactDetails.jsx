// components/chat/ContactDetails.jsx
import React from 'react';

const ContactDetails = ({ contact }) => {
  return (
    <div className="w-80 bg-white border-l">
      <div className="p-4">
        {/* Contact Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-2 flex items-center justify-center text-green-600 text-2xl font-medium">
            {contact.avatar || contact.name[0]}
          </div>
          <div className="font-medium">{contact.name}</div>
          <div className="text-sm text-gray-500">{contact.phone}</div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg p-4 mb-4 border">
          <h3 className="font-medium mb-3">Orders</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-medium">{contact.orders.count}</div>
              <div className="text-xs text-gray-500">Count</div>
            </div>
            <div>
              <div className="font-medium">₹{contact.orders.value}</div>
              <div className="text-xs text-gray-500">Value</div>
            </div>
            <div>
              <div className="font-medium">₹{contact.orders.wallet}</div>
              <div className="text-xs text-gray-500">Wallet</div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-medium mb-3">Address</h3>
          <p className="text-sm text-gray-600">{contact.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;