import React from 'react';

const WelcomePage = ({ onCreateAccount, onLogin }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome</h1>
      <p style={styles.subtitle}>Have a better sharing experience</p>
      <button style={styles.createAccountButton} onClick={onCreateAccount}>
        Create an account
      </button>
      <button style={styles.loginButton} onClick={onLogin}>
        Log In
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    padding: 20,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
    width: '80%',
    maxWidth: 300,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    padding: '12px 0',
    width: '80%',
    maxWidth: 300,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC107',
    border: '2px solid #FFC107',
    cursor: 'pointer',
  },
};

export default WelcomePage;
