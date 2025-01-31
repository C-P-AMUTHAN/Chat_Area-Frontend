import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { BanIcon, ChevronDownIcon, EditIcon, SearchIcon, Mic, Send } from "lucide-react"; // Imported icons

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const SearchBar = styled.input`
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
`;

const ContactList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e9f5ff" : "#ffffff")};
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #f5f5f5;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: #4caf50;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 16px;
    margin-right: 10px;
  }

  .contact-details {
    flex: 1;

    .contact-name {
      font-weight: bold;
      font-size: 14px;
    }

    .last-message {
      font-size: 12px;
      color: #888;
    }
  }

  .timestamp {
    font-size: 12px;
    color: #bbb;
  }
`;

const ChatArea = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-details {
    width:full;
    margin-left: 10px;
    display:flex;
    


    .avatar-header {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    
    .headavatar{
      width: 40px;
      height: 40px;
    }

    .chat-name {
      font-size: 16px;
      font-weight: bold;
    }

    .status {
      font-size: 12px;
    }
    
    
  }
`;

const Messages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #e5ddd5;

  .message {
    max-width: 60%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
    font-size: 14px;
  }

  .sent {
    margin-left: auto;
    background: #dcf8c6;
  }

  .received {
    margin-right: auto;
    background: #ffffff;
    border: 1px solid #ddd;
  }

  .timestamp {
    font-size: 10px;
    color: #888;
    text-align: right;
  }
`;

const MessageInput = styled.div`
  padding: 10px;
  background: white;
  display: flex;

  .input-field {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 14px;
  }

  .send-button {
    margin-left: 10px;
    padding: 10px;
    border: none;
    background: #4caf50;
    color: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ChatProfile = styled.div`
  width: 450px;
  background: #ffffff;
  border-left: 1px solid #ddd;
  overflow-y: auto;
`;

/* Profile Container */
const ProfileContainer = styled.div`
  padding: 16px;
`;

/* Profile Header */
const ProfileHeader = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .profile-header-content{
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .profile-info{
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .avatar{
   width: 64px;
    height: 64px;
    background-color: #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    font-weight: bold;
  }
  .contact-name{
  font-size: 1.125rem;
  font-weight: 700;
  }
  .contact-phone{
  color: #6b7280;
  font-size: 0.875rem;
  }
  .block-button{
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dc2626;
  }
  }

`;


const Tabs = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.div`
  width: 50%;
  padding: 12px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

/* Order Summary */
const OrderSummary = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const OrderSummaryCard = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderSummaryTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const OrderSummaryValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const WalletHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const EditButton = styled.div`
  padding: 4px;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

/* Last Order */
const LastOrder = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LastOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const LastOrderId = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
`;

const SearchButton = styled.div`
  padding: 4px;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

const LastOrderStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatusTag = styled.div`
  background-color: #10b981;
  color: #064e3b;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
`;

const OrderDate = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const LastOrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OrderTotal = styled.div`
  font-weight: 700;
`;

const DetailsButton = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

/* WooCommerce Notes */
const WooCommerceNotes = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NotesTabs = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
`;

const NotesTab = styled.div`
  width: 50%;
  padding: 12px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const NotesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Note = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NoteLabel = styled.div`
  font-weight: 500;
`;

const NoteInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NoteValue = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const EditNote = styled.div`
  padding: 4px;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

const ChatApp = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contacts")
      .then((response) => setContacts(response.data))
      .catch(() => toast.error("Failed to load contacts"));
  }, []);

  useEffect(() => {
    if (selectedContact) {
      axios
        .get(`http://localhost:5000/api/contacts/${selectedContact.phone_number}`)
        .then((response) => setMessages(response.data))
        .catch(() => toast.error("Failed to load messages"));
    }
  }, [selectedContact]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("receive_message", (message) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.tempId === message.tempId);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) {
      toast.error("Please select a contact and type a message");
      return;
    }

    const tempId = Date.now();
    const messageData = {
      to: selectedContact.phone_number,
      text: newMessage.trim(),
      tempId,
    };

    setMessages((prev) => [
      ...prev,
      {
        text: newMessage.trim(),
        sent: true,
        timestamp: new Date(),
        tempId,
      },
    ]);
    setNewMessage("");

    axios
      .post("http://localhost:5000/api/messages/send", messageData)
      .catch(() => toast.error("Failed to send message"));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container>
  <Sidebar>
    <SearchBar placeholder="Search or start new chat" />
    <ContactList>
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          selected={selectedContact?.id === contact.id}
          onClick={() => setSelectedContact(contact)}
        >
          <div className="avatar">
            {contact.name?.[0]?.toUpperCase() || contact.phone_number?.[0]}
          </div>
          <div className="contact-details">
            <div className="contact-name">{contact.name}</div>
            <div className="last-message">{contact.lastMessage}</div>
          </div>
          <div className="timestamp">
            {dayjs(contact.timestamp).format("hh:mm A")}
          </div>
        </ContactItem>
      ))}
    </ContactList>
  </Sidebar>

  <ChatArea>
    {selectedContact ? (
      <>
        <ChatHeader>
          <div className="header-details">
            <div className="avatar-header">
              <div className="avatar headavatar ">
                {selectedContact.name?.[0]?.toUpperCase() || selectedContact.phone_number?.[0]}
              </div>
              <div>
                <div className="chat-name">{selectedContact.name}</div>
                <div className="status">Online</div>
              </div>
            </div>
          </div>
          <div className="search">
            <div className="search-chat" >
              <SearchIcon className="icon" onClick={() => { /* handle search click */ }} width={20} />
            </div>
          </div>
        </ChatHeader>
        <Messages>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sent ? "sent" : "received"}`}>
              {msg.text}
              <div className="timestamp">
                {dayjs(msg.timestamp).format("hh:mm A")}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Messages>
        <MessageInput>
          <input className="input-field" placeholder="Type a message"
           value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === "Enter" && newMessage.trim()) {
          handleSendMessage();
          }
          }}
          />
          <button className="send-button" onClick={handleSendMessage}>
            {newMessage.trim() ? <Send size={15}/> : <Mic size={15} />}
          </button>
        </MessageInput>
      </>
    ) : (
      <div style={{ margin: "auto", color: "#666" }}>
        Select a contact to start chatting
      </div>
    )}
  </ChatArea>

  {selectedContact && (
    <ChatProfile>
    <ProfileContainer>
      {/* Profile Header and Information */}
      <ProfileHeader >
        <div className="flex justify-between mb-6 ">
          <div className="profile-info">
            {/* Avatar: Display first letter of the contact's name */}
            <div className="avatar">
              {selectedContact ? selectedContact.name?.[0]?.toUpperCase() : ''}
            </div>
            <div>
              {/* Contact Name */}
              <h2 className="contact-name">
                {selectedContact ? selectedContact.name : 'Select a contact'}
              </h2>
              {/* Contact Phone Number */}
              <p className="contact-phone">
                {selectedContact ? selectedContact.phone_number : ''}
              </p>
            </div>
          </div>
          {/* Block Button */}
          <div className="flex items-center h-fit py-2 px-4 text-sm font-medium text-white bg-red-500 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-red-600">
            <BanIcon className="icon" />
            Block
          </div>
        </div>
  
        <div className="tabs">
          <button className="tab">Profile</button>
          <button className="tab">Assisted Sales</button>
        </div>
      </ProfileHeader>
  
      {/* Order Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="order-summary-card">
          <h3 className="order-summary-title">Orders Count</h3>
          <p className="order-summary-value">3</p>
        </div>
  
        <div className="order-summary-card">
          <h3 className="order-summary-title">Total Order Value</h3>
          <p className="order-summary-value">₹2.58k</p>
        </div>
  
        <div className="order-summary-card">
          <div className="wallet-header">
            <h3 className="order-summary-title">Wallet</h3>
            <button className="edit-button">
              <EditIcon className="icon" />
            </button>
          </div>
          <p className="order-summary-value">₹0</p>
        </div>
      </div>
  
      {/* Last Order */}
      <div className="last-order">
        <div className="last-order-header">
          <h3 className="last-order-id">88574</h3>
          <button className="search-button">
            <SearchIcon className="icon" />
          </button>
        </div>
        <div className="last-order-status">
          <span className="status-tag">FULFILLED</span>
          <span className="order-date">Ordered at Jul 30, 2024, 11:16:59 PM</span>
        </div>
        <div className="last-order-footer">
          <span className="order-total">₹911.00</span>
          <button className="details-button">
            Details
            <ChevronDownIcon className="icon" />
          </button>
        </div>
      </div>
  
      {/* WooCommerce Notes */}
      <div className="woocommerce-notes">
        <div className="notes-tabs">
          <button className="notes-tab">Address</button>
          <button className="notes-tab">Note</button>
        </div>
        <div className="notes-content">
          <div className="note">
            <span className="note-label">Email Address</span>
            <div className="note-info">
              <span className="note-value">mjperso15@gmail.com</span>
              <button className="edit-note">Edit</button>
            </div>
          </div>
          <div className="note">
            <span className="note-label">Address</span>
            <div className="note-info">
              <span className="note-value">No address provided</span>
              <button className="edit-note">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </ProfileContainer>
  </ChatProfile>
  
  )}
</Container>

  );
};

export default ChatApp;
