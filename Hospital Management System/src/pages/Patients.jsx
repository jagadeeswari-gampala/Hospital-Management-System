import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Activity, 
  FileText,
  MapPin,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { 
  getPatients, 
  addPatient, 
  updatePatient, 
  deletePatient, 
  getDoctors 
} from '../utils/storage';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Patients = () => {
  const location = useLocation();
  const { showToast } = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected/Form states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '',
    email: '',
    address: '',
    disease: '',
    assignedDoctor: '',
    admissionDate: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
    // Check if redirecting from Quick Action "Add New Patient"
    if (location.state && location.state.openAddModal) {
      handleOpenAddModal();
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadData = () => {
    setPatients(getPatients());
    setDoctors(getDoctors());
  };

  const handleOpenAddModal = () => {
    setSelectedPatient(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '',
      email: '',
      address: '',
      disease: '',
      assignedDoctor: doctors[0]?.name || '',
      admissionDate: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      disease: patient.disease,
      assignedDoctor: patient.assignedDoctor,
      admissionDate: patient.admissionDate
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const handleOpenViewModal = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.age) errors.age = 'Age is required';
    else if (isNaN(formData.age) || Number(formData.age) <= 0) errors.age = 'Age must be a valid positive number';
    
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email format is invalid';
    
    if (!formData.disease.trim()) errors.disease = 'Diagnosis/Disease details required';
    if (!formData.address.trim()) errors.address = 'Residential address is required';
    if (!formData.assignedDoctor) errors.assignedDoctor = 'Assigned doctor is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedPatient) {
      // Edit mode
      const updated = {
        ...selectedPatient,
        ...formData,
        age: parseInt(formData.age)
      };
      updatePatient(updated);
      showToast(`Patient records updated for ${formData.name}`, 'success');
    } else {
      // Add mode
      addPatient({
        ...formData,
        age: parseInt(formData.age)
      });
      showToast(`Patient ${formData.name} registered successfully`, 'success');
    }

    setIsAddEditModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (selectedPatient) {
      deletePatient(selectedPatient.id);
      showToast(`Patient ${selectedPatient.name} records removed`, 'success');
      setIsDeleteOpen(false);
      setSelectedPatient(null);
      loadData();
    }
  };

  // Filter patients based on searches and dropdown filters
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.disease.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter ? patient.gender === genderFilter : true;
    const matchesBlood = bloodFilter ? patient.bloodGroup === bloodFilter : true;

    return matchesSearch && matchesGender && matchesBlood;
  });

  return (
    <div style={styles.container} className="flex flex-col gap-6 animate-fade">
      {/* Top Filter and Actions Row */}
      <div style={styles.headerBar} className="flex justify-between align-center">
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by ID, name, diagnosis..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div className="flex gap-3">
          {/* Gender Filter */}
          <select 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Blood Group Filter */}
          <select 
            value={bloodFilter} 
            onChange={(e) => setBloodFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Table of Patients */}
      <div className="table-container">
        {filteredPatients.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Age / Gender</th>
                <th>Blood</th>
                <th>Assigned Doctor</th>
                <th>Diagnosis</th>
                <th>Date Admitted</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{p.id}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</td>
                  <td>{p.age} Yrs / {p.gender}</td>
                  <td>
                    <span className="badge badge-info">{p.bloodGroup}</span>
                  </td>
                  <td>
                    <span style={styles.docCell} className="flex align-center gap-1">
                      <UserCheck size={14} />
                      {p.assignedDoctor}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{p.disease}</td>
                  <td>{p.admissionDate}</td>
                  <td>
                    <div style={styles.actionsCell} className="flex justify-center gap-2">
                      <button 
                        style={styles.actionBtnView} 
                        onClick={() => handleOpenViewModal(p)}
                        title="View Record Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        style={styles.actionBtnEdit} 
                        onClick={() => handleOpenEditModal(p)}
                        title="Edit Details"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        style={styles.actionBtnDel} 
                        onClick={() => handleOpenDelete(p)}
                        title="Remove Patient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyContainer} className="flex flex-col align-center justify-center gap-2">
            <span>No patients found matching filter criteria.</span>
          </div>
        )}
      </div>

      {/* ADD/EDIT PATIENT MODAL */}
      <Modal 
        isOpen={isAddEditModalOpen} 
        onClose={() => setIsAddEditModalOpen(false)} 
        title={selectedPatient ? "Modify Patient Record" : "Register New Patient"}
      >
        <form onSubmit={handleFormSubmit} style={styles.formGrid}>
          {/* Patient Name */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input" 
              placeholder="e.g. John Doe"
            />
            {formErrors.name && <span className="form-error">{formErrors.name}</span>}
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label">Age</label>
            <input 
              type="number" 
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="form-input" 
              placeholder="e.g. 45"
            />
            {formErrors.age && <span className="form-error">{formErrors.age}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="form-input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select 
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="form-input"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Admission Date */}
          <div className="form-group">
            <label className="form-label">Admission Date</label>
            <input 
              type="date" 
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              className="form-input" 
            />
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
              placeholder="e.g. name@mail.com"
            />
            {formErrors.email && <span className="form-error">{formErrors.email}</span>}
          </div>

          {/* Diagnosis / Disease */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Diagnosis / Disease</label>
            <input 
              type="text" 
              value={formData.disease}
              onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
              className="form-input" 
              placeholder="e.g. Chronic Asthma, High Fever"
            />
            {formErrors.disease && <span className="form-error">{formErrors.disease}</span>}
          </div>

          {/* Assigned Doctor */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Assigned Doctor</label>
            <select 
              value={formData.assignedDoctor}
              onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
              className="form-input"
            >
              <option value="">Select Assigned Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
            {formErrors.assignedDoctor && <span className="form-error">{formErrors.assignedDoctor}</span>}
          </div>

          {/* Address */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Address</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input" 
              placeholder="Patient's residential street details..."
              rows="2"
              style={{ resize: 'none' }}
            />
            {formErrors.address && <span className="form-error">{formErrors.address}</span>}
          </div>

          {/* Submit Actions */}
          <div style={styles.modalFooter} className="flex justify-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Record</button>
          </div>
        </form>
      </Modal>

      {/* VIEW PATIENT DETAILED MODAL */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title="Patient Medical Profile"
      >
        {selectedPatient && (
          <div style={styles.viewContainer} className="flex flex-col gap-6">
            {/* Header info */}
            <div style={styles.viewHeader} className="flex align-center gap-4">
              <div style={styles.patientAvatarPlaceholder}>
                <User size={32} color="var(--primary)" />
              </div>
              <div>
                <h3 style={styles.viewName}>{selectedPatient.name}</h3>
                <div style={styles.viewSubRow} className="flex gap-3 align-center">
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{selectedPatient.id}</span>
                  <span style={styles.bulletSeparator}>•</span>
                  <span>{selectedPatient.age} Years Old</span>
                  <span style={styles.bulletSeparator}>•</span>
                  <span>{selectedPatient.gender}</span>
                </div>
              </div>
            </div>

            {/* Structured Card Grid */}
            <div style={styles.viewGrid} className="grid grid-cols-2 gap-4">
              <div style={styles.viewCell} className="flex align-center gap-3">
                <Activity size={18} color="var(--primary)" />
                <div>
                  <span style={styles.viewCellLabel}>Diagnosis</span>
                  <span style={styles.viewCellVal}>{selectedPatient.disease}</span>
                </div>
              </div>

              <div style={styles.viewCell} className="flex align-center gap-3">
                <UserCheck size={18} color="var(--secondary)" />
                <div>
                  <span style={styles.viewCellLabel}>Assigned Consultant</span>
                  <span style={styles.viewCellVal}>{selectedPatient.assignedDoctor}</span>
                </div>
              </div>

              <div style={styles.viewCell} className="flex align-center gap-3">
                <Calendar size={18} color="var(--success)" />
                <div>
                  <span style={styles.viewCellLabel}>Date of Admission</span>
                  <span style={styles.viewCellVal}>{selectedPatient.admissionDate}</span>
                </div>
              </div>

              <div style={styles.viewCell} className="flex align-center gap-3">
                <FileText size={18} color="var(--accent)" />
                <div>
                  <span style={styles.viewCellLabel}>Blood Group</span>
                  <span style={{ ...styles.viewCellVal, color: 'var(--accent)', fontWeight: '700' }}>
                    {selectedPatient.bloodGroup}
                  </span>
                </div>
              </div>

              <div style={styles.viewCell} className="flex align-center gap-3">
                <Phone size={18} color="var(--text-secondary)" />
                <div>
                  <span style={styles.viewCellLabel}>Contact Number</span>
                  <span style={styles.viewCellVal}>{selectedPatient.phone}</span>
                </div>
              </div>

              <div style={styles.viewCell} className="flex align-center gap-3">
                <Mail size={18} color="var(--text-secondary)" />
                <div>
                  <span style={styles.viewCellLabel}>Email Address</span>
                  <span style={styles.viewCellVal}>{selectedPatient.email}</span>
                </div>
              </div>

              <div style={{ ...styles.viewCell, gridColumn: 'span 2' }} className="flex gap-3">
                <MapPin size={18} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                <div>
                  <span style={styles.viewCellLabel}>Residential Address</span>
                  <span style={styles.viewCellVal}>{selectedPatient.address}</span>
                </div>
              </div>
            </div>

            <div style={{ ...styles.modalFooter, borderTop: '1px solid var(--border-color)', paddingTop: '16px' }} className="flex justify-end">
              <button className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>Done</button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Discharge Patient?"
        message={`Are you sure you want to remove ${selectedPatient?.name} from the medical records? This action cannot be undone.`}
        confirmText="Remove Record"
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
  emptyContainer: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
  },
  docCell: {
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionBtnView: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    color: 'var(--secondary)',
    backgroundColor: 'var(--secondary-light)',
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
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  },
  modalFooter: {
    gridColumn: 'span 2',
    marginTop: '12px',
  },
  viewContainer: {
    width: '100%',
  },
  viewHeader: {
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  patientAvatarPlaceholder: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  viewSubRow: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  bulletSeparator: {
    color: 'var(--text-tertiary)',
  },
  viewGrid: {
    marginTop: '8px',
  },
  viewCell: {
    padding: '12px 16px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  viewCellLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  viewCellVal: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginTop: '2px',
    display: 'block',
  }
};

// Handle responsive columns for forms
if (typeof window !== 'undefined') {
  const patientStyles = document.createElement('style');
  patientStyles.textContent = `
    @media (max-width: 768px) {
      form[style*="grid-template-columns: repeat(2"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      div[style*="grid-column: span 2"] {
        grid-column: span 1 !important;
      }
      div[style*="grid-template-columns: repeat(2, minmax(0, 1fr))"] {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      div[style*="grid-column: span 2"] {
        grid-column: span 1 !important;
      }
    }
  `;
  document.head.appendChild(patientStyles);
}

export default Patients;
