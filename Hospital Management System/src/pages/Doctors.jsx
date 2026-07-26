import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Briefcase, 
  CalendarCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import { 
  getDoctors, 
  addDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../utils/storage';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Doctors = () => {
  const location = useLocation();
  const { showToast } = useToast();

  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  
  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'General Medicine',
    experience: '',
    phone: '',
    email: '',
    availability: 'Available'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
    // Check if redirecting from Quick Action "Register Doctor"
    if (location.state && location.state.openAddModal) {
      handleOpenAddModal();
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadData = () => {
    setDoctors(getDoctors());
  };

  const handleOpenAddModal = () => {
    setSelectedDoctor(null);
    setFormData({
      name: '',
      specialization: 'General Medicine',
      experience: '',
      phone: '',
      email: '',
      availability: 'Available'
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      phone: doctor.phone,
      email: doctor.email,
      availability: doctor.availability
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const handleOpenDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Doctor name is required';
    if (!formData.experience) errors.experience = 'Years of experience is required';
    else if (isNaN(formData.experience) || Number(formData.experience) < 0) errors.experience = 'Experience must be a positive number';
    
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email format is invalid';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedDoctor) {
      const updated = {
        ...selectedDoctor,
        ...formData,
        experience: parseInt(formData.experience)
      };
      updateDoctor(updated);
      showToast(`Doctor profile updated for ${formData.name}`, 'success');
    } else {
      addDoctor({
        ...formData,
        experience: parseInt(formData.experience)
      });
      showToast(`Dr. ${formData.name} registered successfully`, 'success');
    }

    setIsAddEditModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (selectedDoctor) {
      deleteDoctor(selectedDoctor.id);
      showToast(`Doctor Dr. ${selectedDoctor.name} removed from registry`, 'success');
      setIsDeleteOpen(false);
      setSelectedDoctor(null);
      loadData();
    }
  };

  const toggleAvailability = (doctor) => {
    const nextStatusMap = {
      'Available': 'On Call',
      'On Call': 'Unavailable',
      'Unavailable': 'Available'
    };
    const updated = {
      ...doctor,
      availability: nextStatusMap[doctor.availability]
    };
    updateDoctor(updated);
    showToast(`${doctor.name} availability is now ${updated.availability}`, 'info');
    loadData();
  };

  // Unique specializations for filter dropdown
  const specializations = [...new Set(doctors.map(d => d.specialization))];

  // Filter doctors list
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpec = specFilter ? doc.specialization === specFilter : true;
    return matchesSearch && matchesSpec;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available': return 'badge badge-success';
      case 'On Call': return 'badge badge-warning';
      default: return 'badge badge-danger';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <CheckCircle size={12} />;
      case 'On Call': return <Clock size={12} />;
      default: return <AlertTriangle size={12} />;
    }
  };

  return (
    <div style={styles.container} className="flex flex-col gap-6 animate-fade">
      {/* Top filter control panel */}
      <div style={styles.headerBar} className="flex justify-between align-center">
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search doctors by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div className="flex gap-3">
          <select 
            value={specFilter} 
            onChange={(e) => setSpecFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Register Doctor</span>
          </button>
        </div>
      </div>

      {/* Grid of Doctor cards */}
      {filteredDoctors.length > 0 ? (
        <div style={styles.doctorGrid} className="grid grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="card" style={styles.doctorCard}>
              {/* Doctor Identity Header */}
              <div style={styles.cardHeader} className="flex justify-between align-start">
                <div className="flex align-center gap-3">
                  <div style={styles.doctorAvatar}>
                    <Stethoscope size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={styles.docName}>{doc.name}</h3>
                    <span style={styles.docId}>{doc.id}</span>
                  </div>
                </div>
                {/* Clickable Quick Toggle Availability Badge */}
                <button 
                  onClick={() => toggleAvailability(doc)}
                  className={getStatusBadgeClass(doc.availability)}
                  title="Click to toggle availability status"
                  style={styles.badgeBtn}
                >
                  <span style={styles.badgeLabelContainer} className="flex align-center gap-1">
                    {getStatusIcon(doc.availability)}
                    {doc.availability}
                  </span>
                </button>
              </div>

              {/* Doctor Details */}
              <div style={styles.cardBody} className="flex flex-col gap-3">
                <div style={styles.detailRow} className="flex align-center gap-2">
                  <Briefcase size={16} color="var(--text-tertiary)" />
                  <span><strong>Specialization:</strong> {doc.specialization}</span>
                </div>

                <div style={styles.detailRow} className="flex align-center gap-2">
                  <CalendarCheck size={16} color="var(--text-tertiary)" />
                  <span><strong>Experience:</strong> {doc.experience} Years</span>
                </div>

                <div style={styles.detailRow} className="flex align-center gap-2">
                  <Phone size={16} color="var(--text-tertiary)" />
                  <span>{doc.phone}</span>
                </div>

                <div style={styles.detailRow} className="flex align-center gap-2">
                  <Mail size={16} color="var(--text-tertiary)" style={styles.textTruncate} />
                  <span style={styles.textTruncate}>{doc.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.cardFooter} className="flex justify-end gap-2">
                <button 
                  style={styles.actionBtnEdit}
                  onClick={() => handleOpenEditModal(doc)}
                  title="Edit Profile"
                >
                  <Edit2 size={15} />
                  <span>Edit</span>
                </button>
                <button 
                  style={styles.actionBtnDel}
                  onClick={() => handleOpenDelete(doc)}
                  title="Remove Doctor"
                >
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyContainer} className="card flex flex-col align-center justify-center gap-2">
          <span>No doctors registered matching search criteria.</span>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      <Modal 
        isOpen={isAddEditModalOpen} 
        onClose={() => setIsAddEditModalOpen(false)} 
        title={selectedDoctor ? "Modify Doctor Profile" : "Register Doctor Profile"}
      >
        <form onSubmit={handleFormSubmit} style={styles.formGrid}>
          {/* Doctor Name */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Doctor's Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input" 
              placeholder="e.g. Dr. Jane Smith"
            />
            {formErrors.name && <span className="form-error">{formErrors.name}</span>}
          </div>

          {/* Specialization */}
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <select 
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="form-input"
            >
              {[
                'General Medicine', 
                'Cardiology', 
                'Pediatrics', 
                'Neurology', 
                'Orthopedics', 
                'Dermatology', 
                'Oncology', 
                'Gynaecology'
              ].map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Years of Experience */}
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input 
              type="number" 
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="form-input" 
              placeholder="e.g. 10"
            />
            {formErrors.experience && <span className="form-error">{formErrors.experience}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input" 
              placeholder="+1 (555) 000-0000"
            />
            {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input" 
              placeholder="e.g. doctor@hospital.com"
            />
            {formErrors.email && <span className="form-error">{formErrors.email}</span>}
          </div>

          {/* Availability Status */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Initial Availability Status</label>
            <select 
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="form-input"
            >
              <option value="Available">Available</option>
              <option value="On Call">On Call</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div style={styles.modalFooter} className="flex justify-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Doctor Registry?"
        message={`Are you sure you want to remove ${selectedDoctor?.name} from CarePulse? All active schedules linked to this doctor will remain but doctor registry will be closed.`}
        confirmText="Remove Profile"
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
  doctorGrid: {
    width: '100%',
  },
  doctorCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '260px',
  },
  cardHeader: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  doctorAvatar: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  docId: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
  },
  badgeBtn: {
    padding: 0,
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  badgeLabelContainer: {
    padding: '4px 8px',
    borderRadius: '9999px',
  },
  cardBody: {
    flexGrow: 1,
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  textTruncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  cardFooter: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  actionBtnEdit: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    borderRadius: '8px',
  },
  actionBtnDel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-light)',
    borderRadius: '8px',
  },
  emptyContainer: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
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

// Responsive style tags for doctor forms
if (typeof window !== 'undefined') {
  const doctorStyles = document.createElement('style');
  doctorStyles.textContent = `
    @media (max-width: 768px) {
      form[style*="grid-template-columns: repeat(2"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      div[style*="grid-column: span 2"] {
        grid-column: span 1 !important;
      }
    }
  `;
  document.head.appendChild(doctorStyles);
}

export default Doctors;
