import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  UserCheck, 
  CheckCircle,
  FileSpreadsheet,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  getAppointments, 
  addAppointment, 
  updateAppointment, 
  deleteAppointment,
  getPatients,
  getDoctors
} from '../utils/storage';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Appointments = () => {
  const location = useLocation();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form inputs
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    department: 'General Medicine',
    status: 'Scheduled'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
    // Check if redirecting from Quick Action "Book Appointment"
    // Note: useLocation in standard vite templates can have location.state
    if (location && location.state && location.state.openBookModal) {
      handleOpenBookModal();
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadData = () => {
    setAppointments(getAppointments());
    setPatients(getPatients());
    const loadedDocs = getDoctors();
    setDoctors(loadedDocs);
  };

  const handleOpenBookModal = () => {
    setSelectedAppointment(null);
    setFormData({
      patientName: patients[0]?.name || '',
      doctorName: doctors[0]?.name || '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      department: doctors[0]?.specialization || 'General Medicine',
      status: 'Scheduled'
    });
    setFormErrors({});
    setIsBookModalOpen(true);
  };

  const handleOpenEditModal = (apt) => {
    setSelectedAppointment(apt);
    setFormData({
      patientName: apt.patientName,
      doctorName: apt.doctorName,
      date: apt.date,
      time: apt.time,
      department: apt.department,
      status: apt.status
    });
    setFormErrors({});
    setIsBookModalOpen(true);
  };

  const handleOpenCancel = (apt) => {
    setSelectedAppointment(apt);
    setIsDeleteOpen(true);
  };

  // Sync department automatically when selecting a doctor
  const handleDoctorChange = (docName) => {
    const selectedDoc = doctors.find(d => d.name === docName);
    setFormData({
      ...formData,
      doctorName: docName,
      department: selectedDoc ? selectedDoc.specialization : formData.department
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName) errors.patientName = 'Please select a patient';
    if (!formData.doctorName) errors.doctorName = 'Please select a doctor';
    if (!formData.date) errors.date = 'Appointment date is required';
    if (!formData.time) errors.time = 'Appointment time is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedAppointment) {
      const updated = {
        ...selectedAppointment,
        ...formData
      };
      updateAppointment(updated);
      showToast(`Appointment status updated for ${formData.patientName}`, 'success');
    } else {
      addAppointment(formData);
      showToast(`Appointment booked successfully with ${formData.doctorName}`, 'success');
    }

    setIsBookModalOpen(false);
    loadData();
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      deleteAppointment(selectedAppointment.id);
      showToast(`Appointment ${selectedAppointment.id} has been cancelled`, 'success');
      setIsDeleteOpen(false);
      setSelectedAppointment(null);
      loadData();
    }
  };

  const handleQuickStatusChange = (apt, nextStatus) => {
    const updated = {
      ...apt,
      status: nextStatus
    };
    updateAppointment(updated);
    showToast(`Appointment ${apt.id} marked as ${nextStatus}`, 'info');
    loadData();
  };

  // Filters
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? apt.status === statusFilter : true;
    const matchesDate = dateFilter ? apt.date === dateFilter : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="badge badge-success"><CheckCircle size={12} />Completed</span>;
      case 'Scheduled': return <span className="badge badge-info"><Calendar size={12} />Scheduled</span>;
      case 'Pending': return <span className="badge badge-warning"><AlertCircle size={12} />Pending</span>;
      default: return <span className="badge badge-danger"><XCircle size={12} />Cancelled</span>;
    }
  };

  return (
    <div style={styles.container} className="flex flex-col gap-6 animate-fade">
      {/* Top filter row */}
      <div style={styles.headerBar} className="flex justify-between align-center">
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by ID, patient, or doctor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div className="flex gap-3">
          {/* Date Filter */}
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={styles.filterDate}
          />

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button className="btn btn-primary" onClick={handleOpenBookModal}>
            <Plus size={18} />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Grid of Appointments */}
      <div className="table-container">
        {filteredAppointments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Patient Details</th>
                <th>Assigned Doctor</th>
                <th>Date & Time</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{apt.id}</td>
                  <td>
                    <span style={styles.cellBold} className="flex align-center gap-1">
                      <User size={14} color="var(--text-tertiary)" />
                      {apt.patientName}
                    </span>
                  </td>
                  <td>
                    <span style={styles.cellBold} className="flex align-center gap-1">
                      <UserCheck size={14} color="var(--text-tertiary)" />
                      {apt.doctorName}
                    </span>
                  </td>
                  <td>
                    <div style={styles.dateTimeCell} className="flex flex-col">
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }} className="flex align-center gap-1">
                        <Calendar size={12} color="var(--primary)" />
                        {apt.date}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }} className="flex align-center gap-1">
                        <Clock size={12} />
                        {apt.time}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{apt.department}</span>
                  </td>
                  <td>{getStatusBadge(apt.status)}</td>
                  <td>
                    <div style={styles.actionsCell} className="flex justify-center gap-2">
                      {/* Check off scheduled appointment */}
                      {(apt.status === 'Scheduled' || apt.status === 'Pending') && (
                        <button 
                          style={styles.actionBtnCheck} 
                          onClick={() => handleQuickStatusChange(apt, 'Completed')}
                          title="Mark Completed"
                        >
                          <CheckCircle size={15} />
                        </button>
                      )}
                      
                      <button 
                        style={styles.actionBtnEdit} 
                        onClick={() => handleOpenEditModal(apt)}
                        title="Reschedule / Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      
                      {apt.status !== 'Cancelled' && (
                        <button 
                          style={styles.actionBtnDel} 
                          onClick={() => handleOpenCancel(apt)}
                          title="Cancel Appointment"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyContainer} className="flex flex-col align-center justify-center gap-2">
            <span>No appointments found matching filters.</span>
          </div>
        )}
      </div>

      {/* BOOK/EDIT APPOINTMENT MODAL */}
      <Modal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        title={selectedAppointment ? "Reschedule Appointment" : "Book New Appointment"}
      >
        <form onSubmit={handleFormSubmit} style={styles.formGrid}>
          {/* Patient Selection Dropdown */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Patient</label>
            <select 
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="form-input"
            >
              <option value="">Select Register Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
            {formErrors.patientName && <span className="form-error">{formErrors.patientName}</span>}
          </div>

          {/* Doctor Selection Dropdown */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Consulting Doctor</label>
            <select 
              value={formData.doctorName}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="form-input"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.specialization}) - {d.availability}
                </option>
              ))}
            </select>
            {formErrors.doctorName && <span className="form-error">{formErrors.doctorName}</span>}
          </div>

          {/* Department (Auto Sync or Manual) */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Department / Clinic</label>
            <input 
              type="text" 
              value={formData.department}
              className="form-input" 
              readOnly 
              style={{ backgroundColor: 'var(--bg-tertiary)', cursor: 'not-allowed' }}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Appointment Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-input" 
            />
            {formErrors.date && <span className="form-error">{formErrors.date}</span>}
          </div>

          {/* Time */}
          <div className="form-group">
            <label className="form-label">Appointment Time</label>
            <input 
              type="time" 
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="form-input" 
            />
            {formErrors.time && <span className="form-error">{formErrors.time}</span>}
          </div>

          {/* Status Selection (only visible on edit) */}
          {selectedAppointment && (
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Schedule Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-input"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div style={styles.modalFooter} className="flex justify-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Confirm Booking</button>
          </div>
        </form>
      </Modal>

      {/* CANCEL CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment Booking?"
        message={`Are you sure you want to cancel the appointment for ${selectedAppointment?.patientName}? The schedule details will be permanently flagged as Cancelled.`}
        confirmText="Cancel Appointment"
      />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  headerBar: {
    padding: '16px 20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--card-radius)',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: '450px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-tertiary)',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 42px',
    fontSize: '0.9rem',
    borderRadius: 'var(--input-radius)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-tertiary)',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  filterDate: {
    padding: '10px 14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: 'var(--input-radius)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    outline: 'none',
    color: 'var(--text-secondary)',
  },
  filterSelect: {
    padding: '10px 14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: 'var(--input-radius)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    outline: 'none',
    color: 'var(--text-secondary)',
  },
  cellBold: {
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  dateTimeCell: {
    gap: '4px',
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionBtnCheck: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    color: 'var(--success)',
    backgroundColor: 'var(--success-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnEdit: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    color: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDel: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  },
  modalFooter: {
    gridColumn: 'span 2',
    marginTop: '12px',
  }
};

// Handle responsive columns for forms
if (typeof window !== 'undefined') {
  const appointmentStyles = document.createElement('style');
  appointmentStyles.textContent = `
    @media (max-width: 768px) {
      form[style*="grid-template-columns: repeat(2"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      div[style*="grid-column: span 2"] {
        grid-column: span 1 !important;
      }
    }
  `;
  document.head.appendChild(appointmentStyles);
}

export default Appointments;
