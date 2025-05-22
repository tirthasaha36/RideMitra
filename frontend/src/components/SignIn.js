
import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';

const SignIn = ({ onBack, onSignUp }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Sign In (mock)');
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
        onComplete={() => setShowForgotPassword(false)}
      />
    );
  }

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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowForgotPassword(true);
            }}
            style={styles.link}
          >
            Forgot password?
          </a>
        </div>
        <button type="submit" style={styles.button}>Sign In</button>
      </form>
      <p style={styles.or}>or</p>
      <div style={styles.socialButtons}>
        <button style={styles.socialButton}>
          <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google" style={styles.socialIcon} />
        </button>
        <button style={styles.socialButton}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" alt="Facebook" style={styles.socialIcon} />
        </button>
        <button style={styles.socialButton}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{...styles.socialIcon, objectFit: 'contain'}} />
        </button>
      </div>
      <p style={styles.centeredText}>
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
    borderRadius: 30,
    border: '1px solid #ccc',
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
    borderRadius: 30,
  },
  or: {
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  socialButton: {
    backgroundColor: '#eee',
    border: 'none',
    padding: 5,
    cursor: 'pointer',
    width: 50,
    height: 50,
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  centeredText: {
    textAlign: 'center',
  },
};

export default SignIn;
