import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function AgentTicketList({ onTicketClick }) {
  const [tickets, setTickets] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    fetchAssigned();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://35.154.32.48:8080/ws'),
      onConnect: () => {
        stompClient.subscribe('/topic/agentTicket', () => {
          fetchAssigned();
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const fetchAssigned = async () => {
    try {
      const res = await api.get('/api/tickets/assigned');
      setTickets(res.data);
    } catch (err) {
      alert('Failed to load assigned tickets');
    }
  };

  const updateStatus = async (ticketId, newStatus) => {
    try {
      await api.put(`/api/tickets/${ticketId}/status`, { status: newStatus });
      fetchAssigned();
    } catch (err) {
      alert('Failed to update ticket status');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Assigned Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets assigned to you.</p>
      ) : (
        tickets.map(ticket => (
          <div
            key={ticket.id}
            style={styles.card}
            onClick={() => onTicketClick(ticket)}
          >
            <div style={styles.subject}>{ticket.subject}</div>
            <div><strong>Status:</strong> {ticket.status}</div>

            <div style={styles.dropdownWrapper}>
              <label htmlFor={`status-${ticket.id}`} style={styles.label}>
                Update Status:
              </label>
              <select
                id={`status-${ticket.id}`}
                value={ticket.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateStatus(ticket.id, e.target.value)}
                style={styles.select}
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '0.5rem',
  },
  card: {
    background: '#fdfdfd',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  subject: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  dropdownWrapper: {
    marginTop: '0.75rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #aaa',
    fontSize: '0.95rem',
    marginTop: '0.3rem',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
  },
};
