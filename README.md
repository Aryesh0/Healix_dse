# 🏥 Healix — Hospital Management System

Healix is a full-stack Hospital Management System (HMS) built with a modern architecture emphasizing speed, security, and DSA-driven clinical logic.

## 🛠 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18, Vite 5, React Router, Tailwind-style Vanilla CSS Variables |
| Backend   | Python 3.11+, FastAPI, Motor (MongoDB), JWT |
| Database  | MongoDB (`healix_db`) |
| ORM       | Spring Data MongoDB      |

---

## 🚀 Getting Started & How to Run

Follow these terminal instructions to get the complete system running on your local machine.

### Prerequisites
1. **Python 3.11+** Installed
2. **Node.js 18+** Installed
3. **MongoDB** installed and running locally on port `27017`

---

### Step 1: Start MongoDB
Ensure your local MongoDB daemon is running. 
If installed as a Windows service:
```bash
net start MongoDB
```

---

### Step 2: Start the Python Backend
Open a new terminal window, navigate to the `backend` directory, install dependencies, and start FastAPI.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Run the FastAPI server
uvicorn main:app --reload --port 8000
```
> The backend API will start on **http://localhost:8000**

---

### Step 3: Start the React Frontend
Open a **second** terminal window, navigate to the `frontend` directory, install the required packages, and start the Vite dev server.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install NPM dependencies (only needed once)
npm install

# 3. Start the development server
npm run dev
```
> The React application will be available at **http://localhost:5173**

---

## 🔑 Authentication & Testing

The system is secured with stateless JWT tokens stored in `localStorage`. 

### How to test:
1. Open `http://localhost:5173` in your browser.
2. Click **Register here** to create an account.
3. Select an account type (**Patient**, **Doctor**, or **Admin**). Note how the form fields change dynamically based on the role.
4. Fill out the form and submit.
5. You will be redirected to the Login page. 
6. Log in with the credentials you just created.
7. You will be redirected to the Dashboard, where you can view live MongoDB statistic counts, the DSA-driven fast-search Patient Management page, and the dual Queue Management page.

---

## 🧠 DSA Implementations

The system utilizes several computer science data structures translated into healthcare logic:

- **$O(1)$ Hash Map Searches:** Patient searches implement instant lookup conceptualizations.
- **Linked Lists (FIFO Queue):** The standard waiting list inherently strictly processes patients first-come, first-served.
- **Priority Heaps:** The emergency triage queue bypasses the standard list, serving critical patients immediately via `bumpToPriority` operations.
