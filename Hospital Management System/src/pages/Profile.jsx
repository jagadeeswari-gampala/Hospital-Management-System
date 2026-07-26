import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile, logActivity } from '../utils/storage';
import { useToast } from '../components/Toast';
import { 
  User, 
  Shield, 
  Building, 
  Mail, 
  Phone, 
  Clock, 
  Save, 
  Layers,
  MapPin
} from 'lucide-react';

const Profile = () => {
  const { showToast } = useToast();

  const [user, setUser] = useState({
    username: '',
    role: '',
    avatar: ''
  });

  const [hospitalInfo, setHospitalInfo] = useState({
    name: 'CarePulse Medical Center',
    address: '456 Healthcare Blvd, Medical District, NY',
    phone: '+1 (555) 123-4567',
    email: 'contact@carepulse.com',
    hours: '24/7 Emergency Service',
    totalBeds: 150,
    availableBeds: 42
  });

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingHospital, setIsEditingHospital] = useState(false);

  useEffect(() => {
    // Load current admin user
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Load hospital details from localstorage if exists
    const storedHosp = localStorage.getItem('hms_hospital_info');
    if (storedHosp) {
      try {
        setHospitalInfo(JSON.parse(storedHosp));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!user.username.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }
    const updated = updateProfile({ username: user.username, avatar: user.avatar });
    if (updated) {
      setUser(updated);
      setIsEditingUser(false);
      showToast('Admin profile details updated', 'success');
      // Trigger a window custom event to refresh DashboardLayout header
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleHospitalSubmit = (e) => {
    e.preventDefault();
    if (!hospitalInfo.name.trim() || !hospitalInfo.address.trim()) {
      showToast('Hospital name and address are required', 'error');
      return;
    }
    localStorage.setItem('hms_hospital_info', JSON.stringify(hospitalInfo));
    setIsEditingHospital(false);
    logActivity(`Updated hospital center metadata: ${hospitalInfo.name}`, "system");
    showToast('Hospital info saved successfully', 'success');
  };

  return (
    <div style={styles.container} className="grid grid-cols-2 gap-6 animate-fade">
      {/* Admin User Info Card */}
      <div className="card" style={styles.profileCard}>
        <div style={styles.cardHeader} className="flex justify-between align-center">
          <h3 style={styles.cardTitle}>Admin Profile</h3>
          {!isEditingUser && (
            <button className="btn btn-secondary" onClick={() => setIsEditingUser(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {isEditingUser ? (
          <form onSubmit={handleUserSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="form-input" 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <input 
                type="text" 
                value={user.avatar}
                onChange={(e) => setUser({ ...user, avatar: e.target.value })}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role (Read Only)</label>
              <input 
                type="text" 
                value={user.role}
                className="form-input" 
                readOnly
                style={{ backgroundColor: 'var(--bg-tertiary)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="flex gap-2 justify-end" style={{ marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditingUser(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={styles.profileDetails} className="flex flex-col align-center justify-center gap-4">
            <img src={user.avatar} alt={user.username} style={styles.avatarBig} />
            <div style={{ textAlign: 'center' }}>
              <h2 style={styles.userName}>{user.username}</h2>
              <span style={styles.userRole} className="badge badge-info">{user.role}</span>
            </div>

            <div style={styles.infoBox} className="w-full flex flex-col gap-3">
              <div style={styles.infoRow} className="flex align-center gap-3">
                <Shield size={16} color="var(--text-tertiary)" />
                <span>Security Access: <strong>Super Administrator</strong></span>
              </div>
              <div style={styles.infoRow} className="flex align-center gap-3">
                <Building size={16} color="var(--text-tertiary)" />
                <span>Default Office: <strong>Central Admin Building A</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hospital Settings Card */}
      <div className="card" style={styles.profileCard}>
        <div style={styles.cardHeader} className="flex justify-between align-center">
          <h3 style={styles.cardTitle}>Hospital Metadata</h3>
          {!isEditingHospital && (
            <button className="btn btn-secondary" onClick={() => setIsEditingHospital(true)}>
              Edit Settings
            </button>
          )}
        </div>

        {isEditingHospital ? (
          <form onSubmit={handleHospitalSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input 
                type="text" 
                value={hospitalInfo.name}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinic Address</label>
              <input 
                type="text" 
                value={hospitalInfo.address}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                className="form-input" 
              />
            </div>

            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input 
                  type="text" 
                  value={hospitalInfo.phone}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Contacts</label>
                <input 
                  type="email" 
                  value={hospitalInfo.email}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Beds</label>
                <input 
                  type="number" 
                  value={hospitalInfo.totalBeds}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, totalBeds: parseInt(e.target.value) || 0 })}
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Beds</label>
                <input 
                  type="number" 
                  value={hospitalInfo.availableBeds}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, availableBeds: parseInt(e.target.value) || 0 })}
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Working Hours</label>
              <input 
                type="text" 
                value={hospitalInfo.hours}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, hours: e.target.value })}
                className="form-input" 
              />
            </div>

            <div className="flex gap-2 justify-end" style={{ marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditingHospital(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Config</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={styles.hospDetails} className="flex flex-col gap-4">
            <div style={styles.hospHeader} className="flex align-center gap-3">
              <div style={styles.hospIconContainer}>
                <Building size={24} color="var(--primary)" />
              </div>
              <div>
                <h2 style={styles.hospName}>{hospitalInfo.name}</h2>
                <span style={styles.hospHours} className="badge badge-success">{hospitalInfo.hours}</span>
              </div>
            </div>

            <div style={styles.infoBox} className="flex flex-col gap-3">
              <div style={styles.infoRow} className="flex align-center gap-3">
                <MapPin size={16} color="var(--text-tertiary)" />
                <span><strong>Address:</strong> {hospitalInfo.address}</span>
              </div>

              <div style={styles.infoRow} className="flex align-center gap-3">
                <Phone size={16} color="var(--text-tertiary)" />
                <span><strong>Mainline:</strong> {hospitalInfo.phone}</span>
              </div>

              <div style={styles.infoRow} className="flex align-center gap-3">
                <Mail size={16} color="var(--text-tertiary)" />
                <span><strong>Support:</strong> {hospitalInfo.email}</span>
              </div>

              <div style={styles.infoRow} className="flex align-center gap-3">
                <Layers size={16} color="var(--text-tertiary)" />
                <span>
                  <strong>Capacity status:</strong> {hospitalInfo.availableBeds} Free Beds / {hospitalInfo.totalBeds} Total Beds
                </span>
              </div>
            </div>

            {/* Simple Graphic Bed Fill Bar */}
            <div style={styles.progressContainer}>
              <span style={styles.progressLabel}>Bed Occupancy Capacity</span>
              <div style={styles.progressBarBg}>
                <div style={{
                  ...styles.progressBarFill,
                  width: `${((hospitalInfo.totalBeds - hospitalInfo.availableBeds) / hospitalInfo.totalBeds) * 100}%`
                }} />
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                <span>Occupied: {hospitalInfo.totalBeds - hospitalInfo.availableBeds}</span>
                <span>Available: {hospitalInfo.availableBeds}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  profileCard: {
    padding: '24px',
  },
  cardHeader: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  },
  profileDetails: {
    padding: '20px 0',
  },
  avatarBig: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid var(--primary)',
    boxShadow: 'var(--shadow-md)',
  },
  userName: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  userRole: {
    fontWeight: '700',
  },
  infoBox: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  infoRow: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  hospDetails: {
    padding: '10px 0',
  },
  hospHeader: {
    marginBottom: '10px',
  },
  hospIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  hospHours: {
    fontWeight: '700',
    marginTop: '4px',
  },
  progressContainer: {
    marginTop: '20px',
  },
  progressLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    marginBottom: '6px',
    display: 'block',
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    borderRadius: '4px',
    transition: 'width 0.5s ease-out',
  }
};

// CSS overrides for mobile
if (typeof window !== 'undefined') {
  const profileStyles = document.createElement('style');
  profileStyles.textContent = `
    @media (max-width: 900px) {
      div[style*="display: grid;"][class*="grid-cols-2"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
    }
  `;
  document.head.appendChild(profileStyles);
}

export default Profile;
