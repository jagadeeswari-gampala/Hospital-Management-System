// Local Storage Management and Sample Data Seeding

const KEYS = {
  DOCTORS: 'hms_doctors',
  PATIENTS: 'hms_patients',
  APPOINTMENTS: 'hms_appointments',
  USER: 'hms_user',
  ACTIVITIES: 'hms_activities'
};

const DEFAULT_DOCTORS = [
  {
    id: "DOC001",
    name: "Dr. Alexander Bennett",
    specialization: "Cardiology",
    experience: 12,
    phone: "+1 (555) 234-5678",
    email: "a.bennett@carepulse.com",
    availability: "Available",
  },
  {
    id: "DOC002",
    name: "Dr. Sarah Jenkins",
    specialization: "Pediatrics",
    experience: 8,
    phone: "+1 (555) 345-6789",
    email: "s.jenkins@carepulse.com",
    availability: "Available",
  },
  {
    id: "DOC003",
    name: "Dr. Robert Chen",
    specialization: "Neurology",
    experience: 15,
    phone: "+1 (555) 456-7890",
    email: "r.chen@carepulse.com",
    availability: "On Call",
  },
  {
    id: "DOC004",
    name: "Dr. Emily Taylor",
    specialization: "Orthopedics",
    experience: 10,
    phone: "+1 (555) 567-8901",
    email: "e.taylor@carepulse.com",
    availability: "Available",
  },
  {
    id: "DOC005",
    name: "Dr. Marcus Vance",
    specialization: "Dermatology",
    experience: 6,
    phone: "+1 (555) 678-9012",
    email: "m.vance@carepulse.com",
    availability: "Unavailable",
  }
];

const DEFAULT_PATIENTS = [
  {
    id: "PAT001",
    name: "Johnathan Miller",
    age: 45,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+1 (555) 901-2345",
    email: "john.miller@gmail.com",
    address: "742 Evergreen Terrace, Springfield",
    disease: "Hypertension",
    assignedDoctor: "Dr. Alexander Bennett",
    admissionDate: "2026-07-01"
  },
  {
    id: "PAT002",
    name: "Sophia Rodriguez",
    age: 29,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+1 (555) 890-1234",
    email: "sophia.rod@yahoo.com",
    address: "123 Maple Street, Riverdale",
    disease: "Migraine Chronica",
    assignedDoctor: "Dr. Robert Chen",
    admissionDate: "2026-07-05"
  },
  {
    id: "PAT003",
    name: "Oliver Thompson",
    age: 7,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+1 (555) 789-0123",
    email: "thompson.family@gmail.com",
    address: "456 Oak Avenue, Fairview",
    disease: "Seasonal Allergies",
    assignedDoctor: "Dr. Sarah Jenkins",
    admissionDate: "2026-07-10"
  },
  {
    id: "PAT004",
    name: "Emma Watson",
    age: 34,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+1 (555) 678-9012",
    email: "emma.watson@icloud.com",
    address: "89 Pine Road, Lakeside",
    disease: "Fractured Fibula",
    assignedDoctor: "Dr. Emily Taylor",
    admissionDate: "2026-07-12"
  },
  {
    id: "PAT005",
    name: "Arthur Pendragon",
    age: 62,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 567-8901",
    email: "king.arthur@gmail.com",
    address: "1 Camelot Lane, Avalon",
    disease: "Cardiovascular Blockage",
    assignedDoctor: "Dr. Alexander Bennett",
    admissionDate: "2026-07-13"
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: "APT001",
    patientName: "Johnathan Miller",
    doctorName: "Dr. Alexander Bennett",
    date: "2026-07-14",
    time: "09:30",
    department: "Cardiology",
    status: "Scheduled"
  },
  {
    id: "APT002",
    patientName: "Sophia Rodriguez",
    doctorName: "Dr. Robert Chen",
    date: "2026-07-14",
    time: "11:00",
    department: "Neurology",
    status: "Scheduled"
  },
  {
    id: "APT003",
    patientName: "Oliver Thompson",
    doctorName: "Dr. Sarah Jenkins",
    date: "2026-07-15",
    time: "14:15",
    department: "Pediatrics",
    status: "Scheduled"
  },
  {
    id: "APT004",
    patientName: "Emma Watson",
    doctorName: "Dr. Emily Taylor",
    date: "2026-07-13",
    time: "10:00",
    department: "Orthopedics",
    status: "Completed"
  },
  {
    id: "APT005",
    patientName: "Arthur Pendragon",
    doctorName: "Dr. Alexander Bennett",
    date: "2026-07-13",
    time: "13:30",
    department: "Cardiology",
    status: "Pending"
  },
  {
    id: "APT006",
    patientName: "Sophia Rodriguez",
    doctorName: "Dr. Robert Chen",
    date: "2026-07-10",
    time: "16:00",
    department: "Neurology",
    status: "Cancelled"
  }
];

const DEFAULT_ACTIVITIES = [
  { id: 1, action: "Admin logged in successfully", type: "system", timestamp: "2026-07-13T13:50:00" },
  { id: 2, action: "Admitted patient Arthur Pendragon", type: "patient", timestamp: "2026-07-13T13:30:00" },
  { id: 3, action: "Scheduled appointment APT005 with Dr. Alexander Bennett", type: "appointment", timestamp: "2026-07-13T13:15:00" },
  { id: 4, action: "Doctor Dr. Marcus Vance set availability to Unavailable", type: "doctor", timestamp: "2026-07-13T10:45:00" }
];

// Initialize database
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.DOCTORS)) {
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(DEFAULT_DOCTORS));
  }
  if (!localStorage.getItem(KEYS.PATIENTS)) {
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
  }
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
  }
};

// Generic read/write
const getItems = (key) => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    console.error("Error reading localStorage key: ", key, e);
    return [];
  }
};

const setItems = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Log activity helper
export const logActivity = (action, type = "system") => {
  const activities = getItems(KEYS.ACTIVITIES);
  const newActivity = {
    id: Date.now(),
    action,
    type,
    timestamp: new Date().toISOString().slice(0, 19)
  };
  setItems(KEYS.ACTIVITIES, [newActivity, ...activities].slice(0, 50)); // Keep last 50
};

// API - Doctors
export const getDoctors = () => getItems(KEYS.DOCTORS);
export const saveDoctors = (doctors) => setItems(KEYS.DOCTORS, doctors);
export const addDoctor = (doctor) => {
  const doctors = getDoctors();
  const newId = `DOC${String(doctors.length + 1).padStart(3, '0')}`;
  const newDoctor = { ...doctor, id: newId };
  saveDoctors([...doctors, newDoctor]);
  logActivity(`Added doctor ${newDoctor.name} (${newDoctor.specialization})`, "doctor");
  return newDoctor;
};
export const updateDoctor = (updatedDoctor) => {
  const doctors = getDoctors();
  const index = doctors.findIndex(doc => doc.id === updatedDoctor.id);
  if (index !== -1) {
    doctors[index] = updatedDoctor;
    saveDoctors(doctors);
    logActivity(`Updated details for doctor ${updatedDoctor.name}`, "doctor");
  }
};
export const deleteDoctor = (id) => {
  const doctors = getDoctors();
  const doctor = doctors.find(doc => doc.id === id);
  if (doctor) {
    saveDoctors(doctors.filter(doc => doc.id !== id));
    logActivity(`Removed doctor ${doctor.name}`, "doctor");
  }
};

// API - Patients
export const getPatients = () => getItems(KEYS.PATIENTS);
export const savePatients = (patients) => setItems(KEYS.PATIENTS, patients);
export const addPatient = (patient) => {
  const patients = getPatients();
  const newId = `PAT${String(patients.length + 1).padStart(3, '0')}`;
  const newPatient = { ...patient, id: newId };
  savePatients([...patients, newPatient]);
  logActivity(`Registered patient ${newPatient.name} for ${newPatient.disease}`, "patient");
  return newPatient;
};
export const updatePatient = (updatedPatient) => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === updatedPatient.id);
  if (index !== -1) {
    patients[index] = updatedPatient;
    savePatients(patients);
    logActivity(`Updated medical records for patient ${updatedPatient.name}`, "patient");
  }
};
export const deletePatient = (id) => {
  const patients = getPatients();
  const patient = patients.find(p => p.id === id);
  if (patient) {
    savePatients(patients.filter(p => p.id !== id));
    logActivity(`Discharged/Removed patient ${patient.name}`, "patient");
  }
};

// API - Appointments
export const getAppointments = () => getItems(KEYS.APPOINTMENTS);
export const saveAppointments = (appointments) => setItems(KEYS.APPOINTMENTS, appointments);
export const addAppointment = (appointment) => {
  const appointments = getAppointments();
  const newId = `APT${String(appointments.length + 1).padStart(3, '0')}`;
  const newAppointment = { ...appointment, id: newId };
  saveAppointments([...appointments, newAppointment]);
  logActivity(`Scheduled appointment for ${newAppointment.patientName} with ${newAppointment.doctorName}`, "appointment");
  return newAppointment;
};
export const updateAppointment = (updatedAppointment) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(apt => apt.id === updatedAppointment.id);
  if (index !== -1) {
    appointments[index] = updatedAppointment;
    saveAppointments(appointments);
    logActivity(`Updated appointment status for ${updatedAppointment.patientName} to ${updatedAppointment.status}`, "appointment");
  }
};
export const deleteAppointment = (id) => {
  const appointments = getAppointments();
  const appointment = appointments.find(apt => apt.id === id);
  if (appointment) {
    saveAppointments(appointments.filter(apt => apt.id !== id));
    logActivity(`Cancelled/Removed appointment ${id}`, "appointment");
  }
};

// API - Activities
export const getActivities = () => getItems(KEYS.ACTIVITIES);

// Auth Service
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER)) || null;
  } catch (e) {
    return null;
  }
};

export const login = (username, password) => {
  // Simple validation for front-end only application
  if (username.toLowerCase() === 'admin' && password === 'admin123') {
    const user = { username: 'Admin', role: 'Administrator', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' };
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    logActivity("Administrator logged in", "system");
    return { success: true, user };
  }
  return { success: false, message: "Invalid username or password (use admin/admin123)" };
};

export const logout = () => {
  localStorage.removeItem(KEYS.USER);
  logActivity("Administrator logged out", "system");
};

export const updateProfile = (profileData) => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updated = { ...currentUser, ...profileData };
    localStorage.setItem(KEYS.USER, JSON.stringify(updated));
    logActivity("Admin profile details updated", "system");
    return updated;
  }
  return null;
};
