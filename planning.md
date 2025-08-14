# E-QUEUE – Planning Document

## 1. Overview
The **E-QUEUE** system is a web application designed to address the queueing challenges at **Occidental Mindoro State College – Mamburao Campus**.  
It provides a streamlined, efficient way for campus offices to manage customer queues with real-time tracking, notifications, and role-based access.

---

## 2. Objectives
- Eliminate long and disorganized queues.
- Improve service efficiency for OMSC Mamburao Campus offices.
- Provide a modern, responsive, and user-friendly queuing experience.
- Offer real-time queue management with notifications.

---

## 3. Target Users & Roles
### 3.1 System Admin
**Full Access**
- Informative dashboard.
- Manage all users (add, edit, delete).
- Assign access permissions.
- Perform system-wide settings.
- Monitor queues across all offices.

### 3.2 Office Admin
**Office-Level Access**
- Dashboard with **Customer Feedback Analysis**.
- Manage office staff.
- Edit profile.
- Manage services & requirements.
- Manage queue lanes & order.
- Manage feedback forms.
- Manage announcements.

### 3.3 Office Staff
**Staff-Level Access**
- Edit profile.
- Manage queues in real-time.
- Register walk-in customers & issue tickets.
- View customer feedback.
- Queue controls: **Done**, **Hold**, **Skip**.

### 3.4 Customers
**Self-Service Access**
- Create an account.
- Book a ticket (office → service → date).
- Download/print ticket.
- Cancel/revoke ticket.
- Provide rating/feedback.
- View queue & estimated time.
- Upload priority ID if applicable.

---

## 4. Queueing Flow
1. Customer logs in.
2. Selects **Office → Service → Date**.
3. Gets ticket & views **Queue Dashboard**.
4. Staff manages queue (call next, hold, skip).
5. If another lane is needed → notify customer with preparations.

---

## 5. Rules & Policies
- New ticket only if previous is cleared/canceled.
- Spam cancellations = account lock.
- No-show = auto-cancel.
- First-Come-First-Serve.
- Priority lanes require proof.

---

## 6. Notifications
- **Modes:** In-app, Email, SMS.
- **Voice Notification:** English/Tagalog, 3x repeats, 3s interval.
- Reminders at **5 or 3 customers before turn** or **few minutes before turn**.
- All notifications are **real-time**.

---

## 7. UI/UX Guidelines
- **Font:** Poppins
- **Color Palette:**
  - Primary: `#071952`
  - Secondary: `#088395`
  - Accent: `#37B7C3`
  - Background: `#EBF4F6`
- Fully responsive for **Staff** and **Customer**.
- Interactive, easy-to-use.
- Mobile-friendly & accessible.

---

## 8. Technical Requirements
- **Backend:** Firebase-ready with server actions structure.
- **Frontend:** Fully responsive & interactive.
- **Realtime** queue updates.
- **Voice notification** integration.
- **Multi-channel notifications**.

---

## 9. Development Roadmap
### **Phase 1 – UI/UX Development (Frontend-Only)**
**Goal:** Build and finalize **all UI pages** without backend logic.
1. **Common Pages**
   - Login / Register
   - Forgot Password
   - Landing Page
2. **System Admin Pages**
   - Dashboard
   - User Management (list, add, edit, delete)
   - Office Management
   - Reports & Analytics
3. **Office Admin Pages**
   - Dashboard (with Feedback Analysis)
   - Staff Management
   - Service Management
   - Queue Lane Management
   - Feedback Form Management
   - Announcement Management
   - Profile Page
4. **Office Staff Pages**
   - Dashboard
   - Queue Management Interface
   - Walk-in Registration
   - Feedback Viewer
   - Profile Page
5. **Customer Pages**
   - Dashboard (Queue Viewer)
   - Office & Service Selection
   - Ticket Viewer (with Download/Print)
   - Feedback Form
   - Profile Page

---

### **Phase 2 – Frontend Integration with Dummy Data**
**Goal:** Simulate app with mock data for testing UI interactions.
- Use static JSON or mock APIs.
- Test navigation and component interactions.
- Ensure responsiveness across devices.

---

### **Phase 3 – Backend & Firebase Setup**
**Goal:** Connect UI to real backend.
- Setup Firebase authentication.
- Setup Firestore/Realtime Database for queues.
- Implement server actions structure.
- Integrate cloud functions for notifications.

---

### **Phase 4 – Real-time Features & Notifications**
**Goal:** Enable live queue updates and alerts.
- WebSocket or Firebase real-time listeners.
- Voice notification system.
- Email, SMS, and in-app alerts.

---

### **Phase 5 – Testing & Optimization**
**Goal:** Ensure system is stable and efficient.
- Unit & integration testing.
- Performance optimization.
- Bug fixes & UI polishing.

---

### **Phase 6 – Deployment**
**Goal:** Launch production-ready system.
- Configure hosting (Firebase Hosting / Vercel).
- Final security checks.
- Release.

---

## 10. Future Enhancements
- AI waiting time prediction.
- Offline mode for walk-ins.
- Analytics dashboard for queue trends.
