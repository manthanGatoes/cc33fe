import React, { useEffect, useState } from 'react';
import CreateTicketForm from '../components/CreateTicketForm';
import AgentTicketList from '../components/AgentTicketList';
import AdminTicketAssignment from '../components/AdminTicketAssignment';
import CustomerTicketList from '../components/CustomerTicketList';
import ChatWindow from '../components/ChatWindow';

export default function Dashboard() {
  const [role, setRole] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);


  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    
  }, []);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleChatClose = () => {
    setSelectedTicket(null);
  };

  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard - Role: {role}</h2>

      {role === 'CUSTOMER' && (
        <>
          <CreateTicketForm onCreated={() => {}} />
          <CustomerTicketList onTicketClick={handleTicketClick} />
        </>
      )}

      {role === 'AGENT' && (
        <AgentTicketList onTicketClick={handleTicketClick} />
      )}

      {role === 'ADMIN' && (
        <AdminTicketAssignment onTicketClick={handleTicketClick} />
      )}

      {selectedTicket && (
        <ChatWindow
          ticket={selectedTicket}
          onClose={handleChatClose}
        />
      )}
    </div>
  );
}

  