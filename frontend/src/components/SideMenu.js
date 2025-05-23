import React from 'react';

const menuItems = [
  { id: 1, label: 'Electric', icon: '⚡' },
  { id: 2, label: 'History', icon: '⏰' },
  { id: 3, label: 'Krutrim', icon: 'क' },
  { id: 4, label: 'Food History', icon: '🍽️' },
  { id: 5, label: 'Ola Money', icon: '🅼' },
  { id: 6, label: 'Payments', icon: '💼', badge: '1 offer available', badgeColor: '#4caf50' },
  { id: 7, label: 'Insurance', icon: '☂️' },
  { id: 8, label: 'Gift card', icon: '🎁' },
  { id: 9, label: 'OlaCoin', icon: '🪙' },
  { id: 10, label: 'Support', icon: '🛟' },
  { id: 11, label: 'Ola UPI', icon: '🔲', badge: 'NEW', badgeColor: '#f44336' },
  { id: 12, label: 'About', icon: 'ℹ️', version: '7.3.2' },
];

const SideMenu = ({ onClose }) => {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.menu} onClick={e => e.stopPropagation()}>
        <div style={styles.profileSection}>
          <div style={styles.profileIcon}>👤</div>
          <div style={styles.profileLabel}>My Profile {'>'}</div>
        </div>
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
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  menu: {
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    boxSizing: 'border-box',
    boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
    overflowY: 'auto',
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
