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
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
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
    const res = await api.get('/api/tickets/all');
    setTickets(res.data);
  };

  const fetchAgents = async () => {
    const res = await api.get('/api/users?role=AGENT');
    setAgents(res.data.content); // assuming paginated API
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
    <div>
      <h3>Admin Ticket Assignment</h3>
      {tickets.map(ticket => (
        <div key={ticket.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}
        onClick={() => onTicketClick(ticket)}
        >
            
          <strong>{ticket.subject}</strong><br />
          Assigned to: {ticket.agent ? ticket.agent.email : 'None'}<br />
          Status: {ticket.status}<br />
          Customer Name: {ticket.customer.name}<br />
          Customer email: {ticket.customer.email}<br />
          <select
            defaultValue=""
            onChange={(e) => assignAgent(ticket.id, e.target.value)}
          >
            <option value="" disabled>Assign to...</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.email}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
