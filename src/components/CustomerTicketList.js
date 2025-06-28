import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function CustomerTicketList({ onTicketClick }) {
  const [tickets, setTickets] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    fetchMyTickets();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://35.154.32.48:8080/ws'),
      onConnect: () => {
        stompClient.subscribe('/topic/tickets', () => {
          fetchMyTickets();
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const fetchMyTickets = async () => {
    try {
      const res = await api.get('/api/tickets/my');
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch my tickets');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>My Tickets</h3>
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          onClick={() => onTicketClick(ticket)}
          style={styles.ticketCard}
        >
          <div style={styles.subject}>{ticket.subject}</div>
          <div style={styles.detail}>
            <strong>Status:</strong> {ticket.status}
          </div>
          <div style={styles.detail}>
            <strong>Priority:</strong> {ticket.priority}
          </div>
          <div style={styles.detail}>
            <strong>Assigned Agent:</strong>{' '}
            {ticket.agent ? ticket.agent.name : 'Not Assigned'}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '0.5rem',
  },
  ticketCard: {
    background: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  subject: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  detail: {
    fontSize: '0.95rem',
    marginBottom: '0.25rem',
  },
};
