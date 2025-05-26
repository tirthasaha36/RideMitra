import React, { useState, useEffect } from 'react';

const menuItems = [
  { id: 1, label: 'History', icon: '⏰' },
  { id: 2, label: 'Payments', icon: '💼', badge: '1 offer available', badgeColor: '#4caf50' },
  { id: 3, label: 'Insurance', icon: '☂️' },
  { id: 4, label: 'Gift card', icon: '🎁' },
  { id: 5, label: 'Support', icon: '🛟' },
  { id: 6, label: 'About', icon: 'ℹ️', version: '1.0.0' },
];

const SideMenu = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation on mount
    setVisible(true);
  }, []);

  const handleClose = () => {
    // Trigger slide-out animation
    setVisible(false);
    // Wait for animation to finish before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div
        style={{
          ...styles.menu,
          transform: visible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={styles.profileSection}>
          <div style={styles.profileIcon}>👤</div>
          <div style={styles.profileLabel}>My Profile {'>'}</div>
        </div>
        <button style={styles.closeButton} onClick={handleClose} aria-label="Close menu">
          &times;
        </button>
        <div style={styles.menuItems}>
          {menuItems.map(item => (
            <div key={item.id} style={styles.menuItem}>
              <span style={styles.icon}>{item.icon}</span>
              <span style={styles.label}>{item.label}</span>
              {item.badge && (
                <span style={{ ...styles.badge, backgroundColor: item.badgeColor }}>
                  {item.badge}
                </span>
              )}
              {item.version && (
                <span style={styles.version}>{item.version}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 50,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  menu: {
    width: 280,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    padding: 20,
    boxSizing: 'border-box',
    boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 24,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 30,
    cursor: 'pointer',
  },
  profileIcon: {
    fontSize: 40,
    marginRight: 10,
  },
  profileLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 16,
    cursor: 'pointer',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  label: {
    flex: 1,
  },
  badge: {
    fontSize: 12,
    color: 'white',
    padding: '2px 6px',
    borderRadius: 12,
    whiteSpace: 'nowrap',
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
};

export default SideMenu;