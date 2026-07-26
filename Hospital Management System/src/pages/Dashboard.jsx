import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserSquare2, 
  CalendarDays, 
  Clock, 
  PlusCircle, 
  CalendarPlus, 
  Activity,
  Heart,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { getPatients, getDoctors, getAppointments, getActivities } from '../utils/storage';
import StatCard from '../components/StatCard';
import SvgChart from '../components/SvgChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patientsCount: 0,
    doctorsCount: 0,
    appointmentsCount: 0,
    pendingApts: 0
  });
  const [activities, setActivities] = useState([]);
  const [admissionsChartData, setAdmissionsChartData] = useState([]);
  const [deptChartData, setDeptChartData] = useState([]);

  useEffect(() => {
    const patients = getPatients();
    const doctors = getDoctors();
    const appointments = getAppointments();
    const history = getActivities();

    // Calculate core statistics
    const pending = appointments.filter(apt => apt.status === 'Pending' || apt.status === 'Scheduled').length;
    setStats({
      patientsCount: patients.length,
      doctorsCount: doctors.length,
      appointmentsCount: appointments.length,
      pendingApts: pending
    });

    setActivities(history.slice(0, 5)); // Get recent 5 activities

    // Seeding chart data dynamically from actual storage
    // 1. Patient admissions trend (mocked weekly)
    setAdmissionsChartData([
      { label: 'Mon', value: 3 },
      { label: 'Tue', value: 5 },
      { label: 'Wed', value: 2 },
      { label: 'Thu', value: 8 },
      { label: 'Fri', value: 6 },
      { label: 'Sat', value: patients.length > 5 ? patients.length : 4 },
      { label: 'Sun', value: patients.length > 5 ? patients.length + 1 : 5 }
    ]);

    // 2. Department appointments count
    const deptCounts = appointments.reduce((acc, apt) => {
      acc[apt.department] = (acc[apt.department] || 0) + 1;
      return acc;
    }, {});

    const chartDepts = Object.keys(deptCounts).map(dept => ({
      label: dept.substring(0, 5) + '.',
      value: deptCounts[dept]
    }));

    // Ensure we have at least some visual data in case counts are empty
    if (chartDepts.length === 0) {
      setDeptChartData([
        { label: 'Card.', value: 4 },
        { label: 'Pedi.', value: 2 },
        { label: 'Neur.', value: 3 },
        { label: 'Orth.', value: 2 }
      ]);
    } else {
      setDeptChartData(chartDepts);
    }
  }, []);

  const formatActivityTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'patient': return <Heart size={14} color="var(--accent)" />;
      case 'doctor': return <Stethoscope size={14} color="var(--primary)" />;
      case 'appointment': return <CalendarDays size={14} color="var(--secondary)" />;
      default: return <ShieldCheck size={14} color="var(--success)" />;
    }
  };

  return (
    <div style={styles.container} className="flex flex-col gap-6 animate-fade">
      {/* Welcome Banner */}
      <div style={styles.welcomeBanner} className="flex justify-between align-center">
        <div>
          <h2 style={styles.welcomeTitle}>Welcome Back, CarePulse Admin</h2>
          <p style={styles.welcomeSubtitle}>Here is what's happening at the hospital portal today.</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={styles.statsGrid} className="grid grid-cols-4 gap-6">
        <StatCard 
          title="Total Patients" 
          value={stats.patientsCount} 
          icon={<Users size={22} />} 
          change="8.2%" 
          changeType="increase"
          color="primary"
        />
        <StatCard 
          title="Total Doctors" 
          value={stats.doctorsCount} 
          icon={<UserSquare2 size={22} />} 
          change="0.0%" 
          changeType="increase"
          color="secondary"
        />
        <StatCard 
          title="Total Appointments" 
          value={stats.appointmentsCount} 
          icon={<CalendarDays size={22} />} 
          change="12.4%" 
          changeType="increase"
          color="success"
        />
        <StatCard 
          title="Active Schedules" 
          value={stats.pendingApts} 
          icon={<Clock size={22} />} 
          change="4.1%" 
          changeType="decrease"
          color="warning"
        />
      </div>

      {/* Charts and Action Section */}
      <div style={styles.chartsGrid} className="grid gap-6">
        {/* Weekly admissions line chart */}
        <SvgChart title="Weekly Patient Admissions (Trend)" type="line" data={admissionsChartData} />
        {/* Department bar chart */}
        <SvgChart title="Appointments by Department (Distribution)" type="bar" data={deptChartData} />
      </div>

      {/* Row: Quick actions & Recent Activities */}
      <div style={styles.detailsGrid} className="grid gap-6">
        {/* Quick Actions Card */}
        <div className="card" style={styles.detailsCard}>
          <h3 style={styles.cardHeader}>Quick Actions</h3>
          <div style={styles.actionsContainer} className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/patients', { state: { openAddModal: true } })}
              style={styles.actionBtn} 
              className="flex flex-col align-center justify-center gap-3"
            >
              <div style={{ ...styles.actionIconContainer, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <PlusCircle size={22} />
              </div>
              <span style={styles.actionLabel}>Add New Patient</span>
            </button>

            <button 
              onClick={() => navigate('/appointments', { state: { openBookModal: true } })}
              style={styles.actionBtn} 
              className="flex flex-col align-center justify-center gap-3"
            >
              <div style={{ ...styles.actionIconContainer, backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                <CalendarPlus size={22} />
              </div>
              <span style={styles.actionLabel}>Book Appointment</span>
            </button>

            <button 
              onClick={() => navigate('/doctors', { state: { openAddModal: true } })}
              style={styles.actionBtn} 
              className="flex flex-col align-center justify-center gap-3"
            >
              <div style={{ ...styles.actionIconContainer, backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                <Stethoscope size={22} />
              </div>
              <span style={styles.actionLabel}>Register Doctor</span>
            </button>

            <button 
              onClick={() => navigate('/profile')}
              style={styles.actionBtn} 
              className="flex flex-col align-center justify-center gap-3"
            >
              <div style={{ ...styles.actionIconContainer, backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <Activity size={22} />
              </div>
              <span style={styles.actionLabel}>Portal Health</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card" style={styles.detailsCard}>
          <h3 style={styles.cardHeader}>Recent System Logs</h3>
          <div style={styles.activityList}>
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} style={styles.activityItem} className="flex align-center justify-between">
                  <div className="flex align-center gap-3">
                    <div style={styles.activityIconCircle}>
                      {getActivityIcon(act.type)}
                    </div>
                    <span style={styles.activityText}>{act.action}</span>
                  </div>
                  <span style={styles.activityTime}>{formatActivityTime(act.timestamp)}</span>
                </div>
              ))
            ) : (
              <div style={styles.noData} className="flex flex-col align-center justify-center">
                <span>No recent activity logs available.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  welcomeBanner: {
    padding: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--card-radius)',
    boxShadow: 'var(--shadow-sm)',
  },
  welcomeTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  welcomeSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  dateBadge: {
    padding: '8px 16px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
  },
  statsGrid: {
    width: '100%',
  },
  chartsGrid: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  detailsGrid: {
    gridTemplateColumns: '1.2fr 1.8fr',
  },
  detailsCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '320px',
  },
  cardHeader: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '20px',
  },
  actionsContainer: {
    flexGrow: 1,
  },
  actionBtn: {
    border: '1px dashed var(--border-color)',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    transition: 'all 0.2s ease',
    padding: '16px',
  },
  actionBtnHover: {
    borderColor: 'var(--primary)',
    backgroundColor: 'var(--primary-glow)',
  },
  actionIconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    overflowY: 'auto',
    flexGrow: 1,
  },
  activityItem: {
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  activityIconCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  activityTime: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  noData: {
    height: '100%',
    color: 'var(--text-tertiary)',
    fontSize: '0.85rem',
  }
};

// Handle media query styles dynamically
if (typeof window !== 'undefined') {
  const dashboardStyle = document.createElement('style');
  dashboardStyle.textContent = `
    @media (max-width: 1200px) {
      div[style*="grid-template-columns: repeat(2, minmax(0, 1fr))"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      div[style*="grid-template-columns: 1.2fr 1.8fr"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      div[style*="height: 320px"] {
        height: auto !important;
        min-height: 280px !important;
      }
    }
    .action-btn:hover {
      border-color: var(--primary) !important;
      background-color: var(--primary-glow) !important;
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(dashboardStyle);
  
  // Attach hover action to the quick action buttons by adding an event listener class name
  setTimeout(() => {
    document.querySelectorAll('button[style*="border: 1px dashed"]').forEach(btn => {
      btn.classList.add('action-btn');
    });
  }, 100);
}

export default Dashboard;
