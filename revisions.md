# System Concerns & Requirements Document

## 1. Student / Customer Page

### 1.1 Service Evaluation

- The system must provide a **Service Evaluation Form** accessible via a **QR code** given at the end of the transaction.
- The QR code should be unique per transaction and linked to the specific office/service.
- **Completion of the Service Evaluation is mandatory** after each transaction.
- Customers **cannot get a new ticket** unless they have completed the evaluation for their most recent transaction.

### 1.2 Ticket Rules

- **No booking or appointment feature** — tickets must be valid **only for the same day**.
- **Only one active ticket per customer** — customers can only get another ticket once:
  1. Their current transaction is completed, **and**
  2. The service evaluation for that transaction is submitted.
- **No fees** should be charged for ticket issuance.

### 1.3 Ticket Issuance Flow

The process for obtaining a ticket must follow these steps:

1. **Select Office**
2. **Select Service**
3. **Check Credentials**
4. **Review & Confirm**

> _No scheduling step is allowed in the process._

### 1.4 Feedback Section Behavior

- In the feedback form, the “Service” field must **automatically update** based on the selected “Office.”

---

## 2. Staff Page

### 2.1 Feedback Removal

- The feedback section should be **removed** from the Staff page and placed under **Office Admin**.

### 2.2 Queue Management

- Each office should have **only one staff member** managing the queue at any given time.
- Clarify queue numbering logic when multiple staff members are assigned — this may require a **Change Account** feature to switch users instead of having multiple active at once.

### 2.3 Evaluation Compliance

- Staff should be able to **see whether a customer has completed their evaluation** before allowing them to get another ticket.
- The system should **automatically block ticket issuance** if the evaluation for the last transaction is incomplete.

### 2.4 Proceeding to the Next Customer

- After the staff **scans the customer's QR code** to confirm that the transaction is complete, the **next customer in the queue will automatically proceed**.

---

## 3. Office Admin Page

### 3.1 Logbook Feature

- Must include a **printable logbook** of transactions/queue history, including:
  - Transaction details
  - Whether the customer completed the evaluation

### 3.2 Queue Lanes

- Review and justify the need for **multiple queue lanes** per office.

### 3.3 Service Evaluation QR Code

- Add a feature to **generate QR codes** for the Service Evaluation Form.
- This should be placed under the **Feedback Forms** section.
- Office Admin must be able to **view and track customers who have not completed evaluations**.

---

## 4. System Admin Page

### 4.1 Violator Monitoring

- Provide a **violations dashboard** to view flagged users, such as:
  - 3 consecutive failed login attempts
  - Invalid photo proof for priority
  - Repetitive ticket cancellations
  - **Failure to complete evaluation** after transaction
- Ensure all violator activity is **visible and logged** for review.

### 4.2 Maintenance Mode

- Clearly define and display how **Maintenance Mode** works, including:
  - What parts of the system are disabled
  - Who can still access the system
  - Whether queues are paused or cleared

### 4.3 Queue Progress Without QR Scanning

- The queue must not allow a customer to get another ticket unless their most recent evaluation is completed.
- If the QR code for the evaluation is **not scanned**, the system must prevent the customer from proceeding and from getting another ticket.

---

## 5. General Notes

- All features must ensure **real-time updates** across connected devices.
- Data must be **secure** and comply with privacy regulations.
- UI/UX must remain **simple and mobile-friendly** for easy customer access.
- The evaluation requirement is **non-negotiable** and must be strictly enforced across all roles and processes.
