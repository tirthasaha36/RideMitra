import React from 'react';

const LocationPermission = ({ onUseLocation, onSkip }) => {
  return (
    <div style={styles.container}>
      <img
        src="https://maps.googleapis.com/maps/api/staticmap?center=Jaipur,India&zoom=12&size=600x400&key=YOUR_API_KEY"
        alt="Map background"
        style={styles.mapBackground}
      />
      <div style={styles.modal}>
        <div style={styles.iconWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="#FFC107"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <h2 style={styles.title}>Enable your location</h2>
        <p style={styles.description}>
          Choose your location to start find the requests around you
        </p>
        <button style={styles.useLocationButton} onClick={onUseLocation}>
          Use my location
        </button>
        <button style={styles.skipButton} onClick={onSkip}>
          Skip for now
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
  mapBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(4px) brightness(0.7)',
    zIndex: 0,
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 320,
    textAlign: 'center',
    zIndex: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  iconWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  useLocationButton: {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    borderRadius: 30,
    padding: '12px 0',
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 10,
  },
  skipButton: {
    backgroundColor: 'transparent',
    color: '#FFC107',
    border: 'none',
    fontSize: 14,
    cursor: 'pointer',
  },
};

export default LocationPermission;
