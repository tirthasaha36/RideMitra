import React from 'react';

const WelcomePage = ({ onCreateAccount, onLogin }) => {
  return (
    <div style={styles.container}>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        alt="Background"
        style={styles.backgroundImage}
      />
      <div style={styles.modal}>
        <div style={styles.namasteIcon} role="img" aria-label="Namaste">
          🙏
        </div>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>Have a better sharing experience</p>
        <button style={styles.createAccountButton} onClick={onCreateAccount}>
          Create an account
        </button>
        <button style={styles.loginButton} onClick={onLogin}>
          Log In
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(4px) brightness(0.7)',
    zIndex: 0,
  },
  modal: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 320,
    textAlign: 'center',
    zIndex: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  namasteIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  createAccountButton: {
    backgroundColor: '#FFC107',
    borderRadius: 30,
    padding: '12px 0',
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    padding: '12px 0',
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107',
    border: '2px solid #FFC107',
    cursor: 'pointer',
    marginBottom: 10,
  },
};

export default WelcomePage;
