import React from 'react';

const StatCard = ({ title, value, icon, change, changeType = 'increase', color = 'primary' }) => {
  const getGlowStyle = () => {
    switch(color) {
      case 'primary': return { boxShadow: '0 4px 20px rgba(13, 148, 136, 0.08)', borderLeft: '4px solid var(--primary)' };
      case 'secondary': return { boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)', borderLeft: '4px solid var(--secondary)' };
      case 'success': return { boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)', borderLeft: '4px solid var(--success)' };
      case 'warning': return { boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)', borderLeft: '4px solid var(--warning)' };
      case 'accent': return { boxShadow: '0 4px 20px rgba(244, 63, 94, 0.08)', borderLeft: '4px solid var(--accent)' };
      default: return {};
    }
  };

  const getIconContainerStyle = () => {
    switch(color) {
      case 'primary': return { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' };
      case 'secondary': return { backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' };
      case 'success': return { backgroundColor: 'var(--success-light)', color: 'var(--success)' };
      case 'warning': return { backgroundColor: 'var(--warning-light)', color: 'var(--warning)' };
      case 'accent': return { backgroundColor: 'var(--accent-light)', color: 'var(--accent)' };
      default: return {};
    }
  };

  return (
    <div className="card" style={{ ...styles.card, ...getGlowStyle() }}>
      <div style={styles.header}>
        <div style={styles.textContainer}>
          <span style={styles.title}>{title}</span>
          <h2 style={styles.value}>{value}</h2>
        </div>
        <div style={{ ...styles.iconContainer, ...getIconContainerStyle() }}>
          {icon}
        </div>
      </div>
      {change && (
        <div style={styles.footer}>
          <span style={{ 
            ...styles.changeBadge, 
            color: changeType === 'increase' ? 'var(--success)' : 'var(--accent)',
            backgroundColor: changeType === 'increase' ? 'var(--success-light)' : 'var(--accent-light)'
          }}>
            {changeType === 'increase' ? '↑' : '↓'} {change}
          </span>
          <span style={styles.footerText}>vs last month</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  iconContainer: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '14px',
    fontSize: '0.8rem',
  },
  changeBadge: {
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '6px',
    fontSize: '0.75rem',
  },
  footerText: {
    color: 'var(--text-tertiary)',
  }
};

export default StatCard;
