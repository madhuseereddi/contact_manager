import React, { useState, useEffect } from 'react';
import './index.css';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentContact, setCurrentContact] = useState({ id: null, name: '', email: '', phone: '' });

  // Fetch contacts from the API on initial render
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch('https://contact-manager-backend-ad0w.onrender.com/contacts');
    const data = await response.json();
    setContacts(data);
  };

  // Handle form submission for adding/updating contact
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (currentContact.id) {
      // Update existing contact
      await fetch(`https://contact-manager-backend-ad0w.onrender.com/contacts/${currentContact.id}`, {
        method: 'PUT',
        body: JSON.stringify(currentContact),
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Add new contact
      await fetch('https://contact-manager-backend-ad0w.onrender.com/contacts', {
        method: 'POST',
        body: JSON.stringify(currentContact),
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    // Reset the current contact state after submission
    setCurrentContact({ id: null, name: '', email: '', phone: '' });
    setShowForm(false);
  
    // Fetch updated contacts list
    fetchContacts();
  };
  
  // Handle deleting a contact
  const handleDelete = async (id) => {
    await fetch(`https://contact-manager-backend-ad0w.onrender.com/contacts/${id}`, {
      method: 'DELETE',
    });
    fetchContacts();
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="full-page">
      <div className="header">
        <h1 className="head1">Contact Manager App</h1>
        <button className="btn1" onClick={() => setShowForm(true)}>Add New</button>
      </div>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={handleSubmit} className='in-form'>
            <input
              type="text"
              name="name"
              value={currentContact.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={currentContact.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            <input
              type="phone"
              name="phone"
              value={currentContact.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              required
            />
            <button type="submit" className='btn11'>{currentContact.id ? 'Update Contact' : 'Add Contact'}</button>
            <button type="button" className='cancel-btn' onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="contact-list">
        <table className="contact-table">
  <thead>
    <tr>
      <th>Sno</th>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {contacts.map((contact, index) => (
      <tr key={contact.id}>
        <td>{index + 1}</td> {/* Serial number */}
        <td>{contact.name}</td>
        <td>{contact.email}</td>
        <td>{contact.phone}</td>
        <td>
          <button onClick={() => {
            setShowForm(true);
            setCurrentContact(contact);
          }}>Edit</button>
          <button onClick={() => handleDelete(contact.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default ContactManager;
