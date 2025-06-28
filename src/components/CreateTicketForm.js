import React, { useState } from 'react';
import api from '../api/axios';

export default function CreateTicketForm({ onCreated }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('LOW');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tickets', {
        subject,
        description,
        priority,
      });
      alert('Ticket created!');
      onCreated && onCreated(); // refresh callback
      setSubject('');
      setDescription('');
      setPriority('LOW');
    } catch (err) {
      alert('Failed to create ticket');
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>Create New Ticket</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={styles.input}
          placeholder="Enter subject"
        />

        <label style={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
          placeholder="Describe your issue"
        />

        <label style={styles.label}>Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <button type="submit" style={styles.button}>Submit Ticket</button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '2rem auto',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.2rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    height: '100px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  select: {
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
