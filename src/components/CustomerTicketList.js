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
    <div>
      <h3>My Tickets</h3>
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          onClick={() => onTicketClick(ticket)}
          style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}
        >
          <strong>{ticket.subject}</strong><br />
          Status: {ticket.status}<br />
          Priority: {ticket.priority}<br />
          Assigned Agent: {ticket.agent ? ticket.agent.name : 'Not Assigned'}
        </div>
      ))}
    </div>
  );
}
