import React, { useState } from 'react';

const SignIn = ({ onBack, onSignUp }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Sign In (mock)');
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>Back</button>
      <h2 style={styles.title}>Sign in</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Email or Phone Number"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <div style={styles.forgotPassword}>
          <a href="#" onClick={(e) => e.preventDefault()} style={styles.link}>
            Forgot password?
          </a>
        </div>
        <button type="submit" style={styles.button}>Sign In</button>
      </form>
      <p style={styles.or}>or</p>
      <div style={styles.socialButtons}>
        <button style={styles.socialButton}>G</button>
        <button style={styles.socialButton}>F</button>
        <button style={styles.socialButton}>O</button>
      </div>
      <p>
        Don't have an account?{' '}
        <span style={styles.link} onClick={onSignUp}>Sign Up</span>
      </p>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 15,
  },
  link: {
    color: '#FFC107',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    padding: 15,
    width: '100%',
    fontSize: 18,
    cursor: 'pointer',
    marginBottom: 15,
  },
  or: {
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  socialButton: {
    backgroundColor: '#eee',
    border: 'none',
    padding: 10,
    fontSize: 18,
    cursor: 'pointer',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
};

export default SignIn;
