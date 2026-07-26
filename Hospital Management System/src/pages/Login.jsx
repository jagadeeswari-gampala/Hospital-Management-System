import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, User, Eye, EyeOff } from 'lucide-react';
import { login, getCurrentUser } from '../utils/storage';
import { useToast } from '../components/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (getCurrentUser()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const tempErrors = {};
    if (!username.trim()) tempErrors.username = 'Username is required';
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 5) tempErrors.password = 'Password must be at least 5 characters';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      
      if (res.success) {
        showToast('Login successful! Welcome back.', 'success');
        navigate('/', { replace: true });
      } else {
        showToast(res.message, 'error');
      }
    }, 800);
  };

  return (
    <div style={styles.container}>
      {/* Visual Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.overlay} />
        <div style={styles.leftContent} className="animate-fade">
          <div style={styles.logoBadge} className="flex align-center gap-2">
            <HeartPulse size={24} />
            <span style={styles.logoTitle}>CarePulse Portal</span>
          </div>
          <div style={styles.heroTextContainer}>
            <h1 style={styles.heroHeading}>Empowering Healthcare Professionals</h1>
            <p style={styles.heroSubheading}>
              Access real-time patient charts, coordinate consultations, and manage medical appointments in one unified workspace.
            </p>
          </div>
          <div style={styles.demoBox}>
            <span style={styles.demoLabel}>DEMO CREDENTIALS:</span>
            <div style={styles.demoRow}>
              <span>Username: <strong style={{ color: 'var(--primary)' }}>admin</strong></span>
              <span>Password: <strong style={{ color: 'var(--primary)' }}>admin123</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right Panel */}
      <div style={styles.rightPanel} className="flex align-center justify-center">
        <div style={styles.formContainer} className="animate-slide">
          <div style={styles.formHeader}>
            <h2 style={styles.title}>Sign In</h2>
            <p style={styles.subtitle}>Enter your admin credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Username Input */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input" 
                  placeholder="admin"
                  style={styles.inputField}
                />
              </div>
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input" 
                  placeholder="••••••••"
                  style={styles.inputField}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <div style={styles.spinner} />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={styles.formFooter}>
            <p style={styles.footerText}>CarePulse © 2026. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-primary)',
  },
  leftPanel: {
    flex: '1.2',
    position: 'relative',
    backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px',
    color: '#ffffff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 13, 22, 0.75)',
    zIndex: 1,
  },
  leftContent: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logoBadge: {
    display: 'inline-flex',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '8px 16px',
    borderRadius: '30px',
    alignSelf: 'flex-start',
  },
  logoTitle: {
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  heroTextContainer: {
    maxWidth: '520px',
    margin: 'auto 0',
  },
  heroHeading: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  heroSubheading: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6',
  },
  demoBox: {
    backgroundColor: 'rgba(9, 13, 22, 0.65)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '16px 20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  demoLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.05em',
  },
  demoRow: {
    display: 'flex',
    gap: '24px',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.85)',
  },
  rightPanel: {
    flex: '1',
    backgroundColor: 'var(--bg-secondary)',
    padding: '40px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  formHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: 'var(--text-tertiary)',
  },
  inputField: {
    paddingLeft: '42px',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    color: 'var(--text-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    height: '44px',
    marginTop: '10px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  formFooter: {
    textAlign: 'center',
    marginTop: '10px',
  },
  footerText: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
  }
};

// Add raw CSS for animations or elements that need keyframes dynamically
if (typeof window !== 'undefined') {
  const loginStyle = document.createElement('style');
  loginStyle.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 900px) {
      div[style*="display: flex; min-height: 100vh;"] {
        flex-direction: column !important;
      }
      div[style*="flex: 1.2"] {
        flex: none !important;
        height: 300px !important;
        padding: 24px !important;
      }
      div[style*="flex: 1"] {
        flex: 1 !important;
        padding: 32px 24px !important;
      }
      h1[style*="font-size: 2.5rem"] {
        font-size: 1.8rem !important;
        margin-bottom: 10px !important;
      }
      p[style*="font-size: 1rem"] {
        font-size: 0.9rem !important;
      }
    }
  `;
  document.head.appendChild(loginStyle);
}

export default Login;
