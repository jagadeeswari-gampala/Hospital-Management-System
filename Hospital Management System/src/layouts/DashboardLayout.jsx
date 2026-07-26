import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  CalendarDays, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronDown,
  Bell,
  HeartPulse
} from 'lucide-react';
import { getCurrentUser, logout } from '../utils/storage';
import { useToast } from '../components/Toast';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme} theme`, 'info');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
    { name: 'Doctors', path: '/doctors', icon: <UserSquare2 size={20} /> },
    { name: 'Appointments', path: '/appointments', icon: <CalendarDays size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
  ];

  if (!user) return null;

  return (
    <div style={styles.layout}>
      {/* Sidebar - Desktop */}
      <aside style={{ ...styles.sidebar, left: sidebarOpen ? '0px' : '-280px' }} className="flex flex-col">
        <div style={styles.logoContainer} className="flex align-center gap-3">
          <div style={styles.logoIcon}>
            <HeartPulse size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={styles.logoText}>CarePulse</h2>
            <span style={styles.logoSubtext}>HMS Portal</span>
          </div>
        </div>

        <nav style={styles.navigation}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  ...styles.navLink,
                  backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                  paddingLeft: isActive ? '16px' : '20px',
                }}
              >
                {item.icon}
                <span style={styles.navLabel}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={handleLogout} style={styles.logoutBtn} className="w-full flex align-center gap-3">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={styles.mainContainer}>
        {/* Header */}
        <header style={styles.header} className="flex align-center justify-between">
          <div className="flex align-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={styles.menuToggle}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 style={styles.pageTitle}>
              {navItems.find(item => item.path === location.pathname)?.name || 'Portal'}
            </h1>
          </div>

          <div className="flex align-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              style={styles.headerBtn}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notifications */}
            <button style={styles.headerBtn} title="Notifications">
              <Bell size={20} />
            </button>

            {/* Profile Dropdown */}
            <div style={styles.profileWrapper}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} 
                style={styles.profileTrigger}
                className="flex align-center gap-2"
              >
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  style={styles.avatar} 
                />
                <div style={styles.userMeta}>
                  <span style={styles.userName}>{user.username}</span>
                  <span style={styles.userRole}>{user.role}</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {profileDropdownOpen && (
                <>
                  <div style={styles.dropdownOverlay} onClick={() => setProfileDropdownOpen(false)} />
                  <div style={styles.dropdown} className="animate-fade">
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileDropdownOpen(false)}
                      style={styles.dropdownItem}
                      className="flex align-center gap-2"
                    >
                      <UserCircle size={16} />
                      <span>My Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      style={{ ...styles.dropdownItem, color: 'var(--accent)' }}
                      className="flex align-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Routing Area */}
        <main style={styles.content}>
          {children}
        </main>
      </div>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    zIndex: 100,
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  logoContainer: {
    padding: '24px 20px',
    borderBottom: '1px solid var(--border-color)',
  },
  logoIcon: {
    backgroundColor: 'var(--primary)',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px var(--primary-glow)',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  logoSubtext: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
  },
  navigation: {
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexGrow: 1,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  navLabel: {
    marginTop: '2px',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid var(--border-color)',
  },
  logoutBtn: {
    padding: '12px 20px',
    color: 'var(--accent)',
    borderRadius: 'var(--input-radius)',
    transition: 'background-color 0.2s',
    fontWeight: '600',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    paddingLeft: 'var(--sidebar-width)',
    transition: 'padding-left 0.3s ease',
  },
  header: {
    height: 'var(--header-height)',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  menuToggle: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
  },
  pageTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  headerBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
  },
  profileWrapper: {
    position: 'relative',
  },
  profileTrigger: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--primary)',
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    lineHeight: '1.2',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  userRole: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 140,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '48px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    width: '180px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    zIndex: 150,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  content: {
    padding: '24px',
    flexGrow: 1,
    maxWidth: '1600px',
    width: '100%',
    margin: '0 auto',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 95,
  }
};

// Handle mobile layout overrides with standard JS listeners rather than CSS since styling React components
if (typeof window !== 'undefined') {
  const handleResize = () => {
    const isMobile = window.innerWidth <= 992;
    const mainContainer = document.querySelector('main')?.parentElement;
    const menuToggle = document.querySelector('header button');
    
    if (mainContainer) {
      mainContainer.style.paddingLeft = isMobile ? '0px' : 'var(--sidebar-width)';
    }
  };

  window.addEventListener('resize', handleResize);
  // Add a style tag dynamic override for mobile
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @media (max-width: 992px) {
      header button[style*="display: none"] {
        display: flex !important;
      }
      aside[style*="left: -280px"] {
        left: -280px !important;
      }
      aside[style*="left: 0px"] {
        left: 0px !important;
      }
      div[style*="padding-left: var(--sidebar-width)"] {
        padding-left: 0px !important;
      }
      .nav-label-hide {
        display: inline !important;
      }
    }
  `;
  document.head.appendChild(styleTag);
}

export default DashboardLayout;
