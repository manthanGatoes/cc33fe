import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function ChatWindow({ ticket, onClose }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!ticket) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/messages/ticket/${ticket.id}`);
        setMessages(res.data);
      } catch (err) {
        alert('Failed to load messages');
      }
    };

    fetchMessages();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        stompClient.subscribe(`/topic/tickets/${ticket.id}`, (msg) => {
          const newMessage = JSON.parse(msg.body);
          setMessages(prev => [...prev, newMessage]);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [ticket]);

  const sendMessage = async () => {
    try {
      await api.post('/api/messages', {
        ticketId: ticket.id,
        content,
      });
      setContent('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  if (!ticket) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <strong>Live Chat - {ticket.subject}</strong>
          <button onClick={onClose} style={styles.closeBtn}>✖</button>
        </div>
        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div key={idx} style={styles.messageBubble}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{msg.sender.role}</div>
              <div>{msg.content}</div>
            </div>
          ))}
        </div>
        <div style={styles.inputArea}>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    width: '600px',
    height: '500px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    position: 'relative',
  },
  header: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 12,
    padding: '8px',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  messageBubble: {
    backgroundColor: '#e4e4e4',
    padding: '10px',
    borderRadius: 6,
    marginBottom: 8,
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
};
