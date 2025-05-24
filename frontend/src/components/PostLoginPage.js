 import React, { useEffect } from 'react';
import SuccessIcon from '../assets/images/SuccessIcon.png';

const PostLoginPage = ({ onRedirect }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 1000); // Redirect after 1 seconds

    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div style={styles.container}>
      <div style={styles.modal}>
        <img src={SuccessIcon} alt="Success" style={styles.icon} />
        <h1 style={styles.title}>Congratulations</h1>
        <p style={styles.subtitle}>
          Your account is ready to use. You will be redirected to the Home Page in a few seconds.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 50,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    width: '80%',
    maxWidth: 320,
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: 200,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
};

export default PostLoginPage;
