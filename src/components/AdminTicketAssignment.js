import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function AdminTicketAssignment({ onTicketClick }) {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    fetchTickets();
    fetchAgents();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://35.154.32.48:8080/ws'),
      onConnect: () => {
        stompClient.subscribe('/topic/tickets', () => {
          fetchTickets();
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/api/tickets/all');
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('/api/users?role=AGENT');
      setAgents(res.data.content);
    } catch (err) {
      console.error('Failed to fetch agents');
    }
  };

  const assignAgent = async (ticketId, assigneeId) => {
    try {
      await api.put(`/api/tickets/${ticketId}/assign`, { assigneeId });
      alert('Assigned successfully');
      fetchTickets();
    } catch (err) {
      alert('Assignment failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Ticket Assignment</h2>
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          style={styles.card}
          onClick={() => onTicketClick(ticket)}
        >
          <div style={styles.subject}>{ticket.subject}</div>
          <div><strong>Status:</strong> {ticket.status}</div>
          <div><strong>Assigned to:</strong> {ticket.agent ? ticket.agent.email : 'None'}</div>
          <div><strong>Customer:</strong> {ticket.customer.name} ({ticket.customer.email})</div>

          <div style={styles.dropdownWrapper}>
            <select
              defaultValue=""
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => assignAgent(ticket.id, e.target.value)}
              style={styles.select}
            >
              <option value="" disabled>Assign to agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
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
  },
};
