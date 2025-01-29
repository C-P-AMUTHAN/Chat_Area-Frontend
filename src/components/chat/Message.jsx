// components/chat/Message.jsx
import React from 'react';
import MessageStatus from './MessageStatus';

const Message = ({ message }) => {
  return (
    <div className={`flex ${message.sent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
        message.sent ? 'bg-green-500 text-white' : 'bg-white'
      }`}>
        <p>{message.text}</p>
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs opacity-75">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.sent && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default Message;