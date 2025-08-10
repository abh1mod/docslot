# DocSlot - Healthcare Appointment Booking Platform

**Your Health, Our Priority — Book Appointments with Ease**

## Overview

DocSlot is a healthcare appointment booking platform developed as a learning project to understand modern web development technologies and healthcare system workflows. It demonstrates how to build a dual-user system with separate interfaces for patients and doctors, showcasing full-stack development skills.

## Core Functionality

- **Dual User System**: Separate interfaces for patients and doctors
- **Appointment Booking**: Real-time availability checking and instant booking
- **Profile Management**: User profiles with basic information
- **Secure Authentication**: JWT-based authentication with role-based access control
- **File Management**: Upload and sharing of documents
- **Email Delivery System**: Automated email notifications for appointments, confirmations, and updates
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Technology Stack

**Frontend**: React 19.1.0, Vite 6.3.5, Tailwind CSS 3.4.17, React Router DOM 7.6.1, React Icons 5.5.0, React Toastify 11.0.5

**Backend**: Node.js, Express.js 4.21.2, PostgreSQL 8.16.0, Redis 5.5.6, Neon Database

**Security**: JWT, bcrypt 6.0.0, CORS 2.8.5

**File Handling**: Cloudinary 2.7.0, Express FileUpload 1.5.2

**Additional**: Nodemailer 7.0.3, Morgan 1.10.0, Axios 1.9.0


## Usage

**For Patients**: Register, browse doctors, book appointments, upload medical reports, manage health records

**For Doctors**: Set up practice profile, manage appointments, view patient history, handle medical reports

## Usage Flow

### Patient Journey
1. **Profile Selection** → Choose "Patient" profile type
2. **Registration** → Fill personal details, contact information
3. **Login** → Access patient dashboard with authentication
4. **Browse Doctors** → Search by specialty, location
5. **Book Appointment** → Select date, time slot, appointment type
6. **Upload Reports** → Share relevant medical documents before consultation
7. **Confirmation** → Receive instant booking confirmation on email
10. **Manage Appointments** → View or Cancel upcoming appointments
11. **Access History** → View past appointments and medical records

### Doctor Journey
1. **Profile Selection** → Choose "Doctor" profile type
2. **Registration** → Fill personal details, contact information
3. **Profile Setup** → Set availability schedule, contact, address, update profile photo, specialization etc.
4. **Login** → Access doctor dashboard
5. **View Requests** → Check incoming appointment requests from patients
6. **Review Patient Info** → Access patient history and uploaded medical reports
7. **Appointment Management** → Appointments are approved by default, can reject with email notification to patient
8. **Patient Communication** → Send confirmations, reminders, and updates
9. **Practice Growth** → Expand patient base and manage practice efficiently

## Contributing

We welcome contributions! Fork the repository, create a feature branch, make your changes, and submit a pull request.


**Made with ❤️ for better healthcare**