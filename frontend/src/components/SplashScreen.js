import React from 'react';

const SplashScreen = ({ onNext }) => {
  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <div style={styles.logoCircle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9l10.21 10.21c-1.35 1.06-3.05 1.69-4.9 1.69zm6.31-2.1L8.1 7.69c1.35-1.06 3.05-1.69 4.9-1.69 4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z" />
          </svg>
        </div>
        <h1 style={styles.title}>Easy Rider</h1>
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
