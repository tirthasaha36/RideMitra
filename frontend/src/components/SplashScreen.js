import React from 'react';
import RideMitraLogo from '../assets/images/RideMitra Logo.png';

const SplashScreen = ({ onNext }) => {
  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <div style={styles.logoCircle}>
          <img src={RideMitraLogo} alt="RideMitra Logo" style={styles.logoImage} />
        </div>
        <h1 style={styles.title}>RideMitra</h1>
      </div>
      <div style={styles.loader}>
        <div className="loader"></div>
      </div>
      <button style={styles.nextButton} onClick={onNext} aria-label="Next">
        {'>'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#FFC107',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    backgroundColor: 'white',
    borderRadius: '50%',
    width: 100,
    height: 100,
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 96,
    height: 96,
    objectFit: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  loader: {
    marginBottom: 40,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'white',
    borderRadius: '50%',
    width: 50,
    height: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
    border: 'none',
    cursor: 'pointer',
  },
};

export default SplashScreen;
