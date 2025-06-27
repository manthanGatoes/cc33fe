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
      alert('Status updated!');
      fetchAssigned();
    } catch (err) {
      alert('Failed to update ticket status');
    }
  };

  return (
    <div>
      <h3>Assigned Tickets</h3>
      {tickets.map(ticket => (
        <div key={ticket.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}
        onClick={() => onTicketClick(ticket)}
        >
          <strong>{ticket.subject}</strong><br />
          Status: {ticket.status}<br />
          <label>Update Status:</label>
          <select
            value={ticket.status}
            onChange={(e) => updateStatus(ticket.id, e.target.value)}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      ))}
    </div>
  );
}
