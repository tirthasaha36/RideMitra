import React from 'react';

const BookingPage = ({ onBack }) => {
  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>Back</button>
      <h2 style={styles.title}>Booking Page</h2>
      <p>This is a placeholder for the Booking Page.</p>
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
};

export default BookingPage;
