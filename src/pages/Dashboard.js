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

  const renderContent = () => {
    switch (role) {
      case 'CUSTOMER':
        return (
          <>
            <h3>Create Ticket</h3>
            <CreateTicketForm onCreated={() => {}} />
            <h3>My Tickets</h3>
            <CustomerTicketList onTicketClick={handleTicketClick} />
          </>
        );
      case 'AGENT':
        return (
          <>
            <h3>Assigned Tickets</h3>
            <AgentTicketList onTicketClick={handleTicketClick} />
          </>
        );
      case 'ADMIN':
        return (
          <>
            <h3>All Tickets (Admin)</h3>
            <AdminTicketAssignment onTicketClick={handleTicketClick} />
          </>
        );
      default:
        return <p>Invalid role or not logged in.</p>;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard <span style={styles.roleTag}>({role})</span></h2>
      <div style={selectedTicket ? styles.splitView : {}}>
        <div style={styles.leftPane}>
          {renderContent()}
        </div>
        {selectedTicket && (
          <div style={styles.chatPane}>
            <ChatWindow ticket={selectedTicket} onClose={handleChatClose} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '0.5rem',
  },
  roleTag: {
    fontSize: '1rem',
    color: '#555',
    marginLeft: '0.5rem',
  },
  splitView: {
    display: 'flex',
    gap: '1rem',
  },
  leftPane: {
    flex: 2,
  },
  chatPane: {
    flex: 1,
    borderLeft: '1px solid #ddd',
    paddingLeft: '1rem',
  },
};
