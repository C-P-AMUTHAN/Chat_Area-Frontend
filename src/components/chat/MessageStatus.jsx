// components/chat/MessageStatus.jsx
import React from 'react';

const MessageStatus = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'failed':
        return '✕';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sent':
        return 'text-gray-500';
      case 'delivered':
        return 'text-gray-500';
      case 'read':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <span className={`ml-1 text-xs ${getStatusColor()}`}>
      {getStatusIcon()}
    </span>
  );
};

export default MessageStatus;