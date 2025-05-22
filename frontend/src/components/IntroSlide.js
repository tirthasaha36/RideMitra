import React from 'react';

const IntroSlide = ({ title, description, imageUrl, onNext, onSkip, isLast }) => {
  return (
    <div style={styles.container}>
      <div style={styles.skip} onClick={onSkip} role="button" tabIndex={0} aria-label="Skip Intro">
        Skip
      </div>
      <img src={imageUrl} alt={title} style={styles.image} />
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>
      <button style={styles.nextButton} onClick={onNext} aria-label={isLast ? 'Go' : 'Next'}>
        {isLast ? 'Go' : '→'}
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
    alignItems: 'center',
    position: 'relative',
    textAlign: 'center',
  },
  skip: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#999',
    fontSize: 16,
    cursor: 'pointer',
  },
  image: {
    width: '80%',
    maxWidth: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    padding: '0 10px',
  },
  nextButton: {
    backgroundColor: '#FFC107',
    borderRadius: '50%',
    width: 60,
    height: 60,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default IntroSlide;
