# CarePulse - Hospital Management System (HMS)

CarePulse is a premium, responsive, frontend-only Hospital Management System (HMS) built using **React.js (Vite)**, custom **CSS3 variables**, and **LocalStorage** for full data persistence. It is designed to empower healthcare administrators with tools to manage patient records, doctor registries, and appointment scheduling seamlessly.

---

## 🚀 Key Features

- **🔑 Access Control / Login**: Elegant split-screen design. Log in using built-in demo administrator credentials.
- **📊 Analytics Dashboard**: Comprehensive metrics trackers showing key statistics. Interactive SVG charts display patient weekly admissions and department appointment distribution.
- **🏥 Patient Records Management**: Complete CRUD operations for patient tracking, details modals, and discharge confirmation checks.
- **🩺 Doctor Registry**: Grid card view of doctors, experience tracking, specialty filtering, and quick availability toggles.
- **📅 Appointment Scheduler**: Schedule consults, link registered patients and doctors, automatically synchronize departments, and filter appointments by date and status.
- **⚙️ Hospital Configuration**: Edit admin credentials and control bed occupancy limits directly inside the profile settings.
- **🌓 Adaptive Theme**: Smooth toggling between Light and Dark modes.
- **📱 Fluid Responsiveness**: Designed using CSS Flexbox, Grid, and Media queries for a seamless experience across Mobile, Tablet, and Desktop screens.

---

## 🛠️ Technology Stack

1. **Framework**: React 18 (bootstrapped with Vite)
2. **Routing**: React Router DOM v6
3. **Styling**: Vanilla CSS3 Custom Variables (dark/light theme tokens)
4. **Icons**: Lucide React
5. **Database / State**: Browser LocalStorage & React Hooks

---

## 📦 Setup and Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### 1. Installation
Navigate to the root directory and install all the dependencies:
```bash
npm install
```

### 2. Start Development Server
Run the Vite development server. Both `npm start` and `npm run dev` are configured to launch the server:
```bash
npm start
```
*Alternatively, you can run:*
```bash
npm run dev
```

The application will launch on your local host (usually `http://localhost:5173`).

### 3. Log In Credentials
- **Username**: `admin`
- **Password**: `admin123`

### 4. Build for Production
To build a highly optimized production bundle, run:
```bash
npm run build
```

---

## 📁 File Structure

```
Hospital Management System/
├── package.json          # Node dependencies and scripts
├── vite.config.js       # Vite configuration
├── index.html            # HTML entry point (Plus Jakarta Sans imported)
├── README.md             # Project documentation
├── src/
│   ├── main.jsx          # Bootstrap React entrypoint
│   ├── App.jsx           # Routing & Toast Context Provider
│   ├── index.css         # CSS Tokens & styling overrides
│   ├── components/       # Reusable components
│   │   ├── Modal.jsx           # Flexible modal overlay
│   │   ├── StatCard.jsx        # Glowing dashboard metric tracker
│   │   ├── SvgChart.jsx        # SVG-based line and bar charts
│   │   ├── Toast.jsx           # Floating system notifications
│   │   └── ConfirmDialog.jsx   # Deletion confirm modal
│   ├── layouts/          # Core Layout Wrapper
│   │   └── DashboardLayout.jsx # Collapsible Sidebar, Header, and Theme toggle
│   ├── pages/            # View Pages
│   │   ├── Login.jsx           # Auth portal form
│   │   ├── Dashboard.jsx       # Analytics center
│   │   ├── Patients.jsx        # Patient CRUD list
│   │   ├── Doctors.jsx         # Doctors grid and availability
│   │   ├── Appointments.jsx    # Appointment scheduler
│   │   └── Profile.jsx         # Admin & Hospital metadata
│   └── utils/
│       └── storage.js          # LocalStorage CRUD hooks & realistic seed data
```
