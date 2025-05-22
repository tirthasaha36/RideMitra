import React, { useState } from 'react';

const Profile = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    district: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Profile saved (mock)');
    onBack();
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>Back</button>
      <h2 style={styles.title}>Profile</h2>
      <div style={styles.avatarContainer}>
        <div style={styles.avatar}>+</div>
      </div>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Your mobile number"
        value={formData.phone}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="street"
        placeholder="Street"
        value={formData.street}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="district"
        placeholder="District"
        value={formData.district}
        onChange={handleChange}
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={onBack} style={styles.cancelButton}>Cancel</button>
        <button onClick={handleSave} style={styles.saveButton}>Save</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    maxWidth: 400,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  backButton: {
    marginBottom: 10,
    background: 'none',
    border: 'none',
    color: '#FFC107',
    cursor: 'pointer',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    fontSize: 48,
    color: '#aaa',
    lineHeight: '80px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: 15,
    width: '45%',
    fontSize: 18,
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    padding: 15,
    width: '45%',
    fontSize: 18,
    cursor: 'pointer',
  },
};

export default Profile;
