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
      onCreated && onCreated(); // callback to refresh list
      setSubject('');
      setDescription('');
      setPriority('LOW');
    } catch (err) {
      alert('Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Create New Ticket</h3>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      /><br /><br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      /><br /><br />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select><br /><br />
      <button type="submit">Submit</button>
    </form>
  );
}
