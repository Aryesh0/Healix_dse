import { createContext, useState, useEffect } from 'react';

// ==========================================
// EXPERIMENT 2: STACK (LIFO)
// Used for Activity Logs
// ==========================================
export class ActivityStack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  isEmpty() {
    return this.items.length === 0;
  }
  display() {
    return [...this.items].reverse();
  }
}

// ==========================================
// EXPERIMENT 4: PRIORITY QUEUE EXTENSION
// Used for Waiting Patients & Emergency Triage
// ==========================================
export class PatientQueue {
  constructor() {
    this.items = [];
  }
  // Standard FIFO Enqueue
  enqueue(element) {
    this.items.push({...element, isEmergency: false});
  }
  // Priority Enqueue (Jumps to front)
  enqueueEmergency(element) {
    this.items.unshift({...element, isEmergency: true});
  }
  // Moves an existing patient to the front
  prioritize(id) {
    const idx = this.items.findIndex(p => p.id === id);
    if (idx !== -1) {
      const p = this.items.splice(idx, 1)[0];
      p.isEmergency = true;
      this.items.unshift(p);
    }
  }
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }
  front() {
    if (this.isEmpty()) return "No elements";
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  display() {
    return [...this.items];
  }
  getPosition(id) {
    const idx = this.items.findIndex(p => p.id === id);
    return idx === -1 ? null : idx + 1;
  }
}

// ==========================================
// EXPERIMENT 6: BINARY SEARCH TREE (BST)
// Used for indexing Patients by ID for fast lookup
// ==========================================
class Node {
  constructor(patient) {
    this.data = patient;
    this.left = null;
    this.right = null;
  }
}
export class PatientBST {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  insert(patient) {
    const newNode = new Node(patient);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
    this.size++;
  }
  insertNode(node, newNode) {
    if (newNode.data.id < node.data.id) {
      if (node.left === null) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (node.right === null) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }
  search(node, id) {
    if (node === null) return null;
    if (id < node.data.id) return this.search(node.left, id);
    if (id > node.data.id) return this.search(node.right, id);
    return node.data; // Found Custom Data Structure implementation using Recursion (Exp 1 + 6)
  }
  inorder(node, result = []) {
    if (node !== null) {
      this.inorder(node.left, result);
      result.push(node.data);
      this.inorder(node.right, result);
    }
    return result;
  }
  getAll() {
    return this.inorder(this.root);
  }
}

// ==========================================
// EXPERIMENT 5: SINGLY LINKED LIST
// Used for managing available Beds dynamically
// ==========================================
class BedNode {
  constructor(bedNumber) {
    this.bedNumber = bedNumber;
    this.next = null;
  }
}
export class BedLinkedList {
  constructor() {
    this.head = null;
    this.count = 0;
  }
  // Insertion at End (Exp 5b)
  addBed(bedNumber) {
    const newNode = new BedNode(bedNumber);
    if (this.head === null) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.count++;
  }
  // Deletion at Beginning (Exp 5a) - Taking Next Available Bed
  takeBed() {
    if (this.head === null) return null;
    const taken = this.head;
    this.head = this.head.next;
    this.count--;
    return taken.bedNumber;
  }
}

// Initializing the Context
export const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  // We keep instances in state so they persist, 
  // but we trigger a re-render with a 'tick' counter whenever we mutate them!
  const [db, setDb] = useState({
    logs: new ActivityStack(),
    queue: new PatientQueue(),
    patients: new PatientBST(),
    beds: new BedLinkedList(),
    doctorsMap: [
      { id: 'D1', name: 'Dr. Aryesh', specialty: 'Neurologist', days: ['Monday', 'Wednesday', 'Friday'], hours: '09:00 - 15:00' },
      { id: 'D2', name: 'Dr. Smith', specialty: 'Cardiologist', days: ['Tuesday', 'Thursday'], hours: '10:00 - 16:00' }
    ],
    scheduledAppointments: []
  });
  const [tick, setTick] = useState(0);

  const sync = () => setTick(t => t + 1); // Force flush changes to React

  // Initial seeding of Mock Database
  useEffect(() => {
    const initialDb = { ...db };
    
    if (initialDb.patients.size === 0) {
        // Seed Patients (BST Exp 6)
        initialDb.patients.insert({ id: 101, name: 'Alice Walker', dob: '1990-05-12' });
        initialDb.patients.insert({ id: 85, name: 'Bob Smith', dob: '1985-11-20' });
        initialDb.patients.insert({ id: 120, name: 'Charlie Davis', dob: '2000-01-30' });
        
        // Seed Beds (Singly Linked List Exp 5)
        for (let i = 1; i <= 25; i++) {
            initialDb.beds.addBed(`W1-B${i}`);
        }

        // Seed Appointments
        initialDb.scheduledAppointments = [
          { id: 'APT-1001', patientName: 'Alice Walker', doctor: 'Dr. Aryesh', date: '2026-04-10', time: '10:00', status: 'Scheduled', type: 'Consultation' },
          { id: 'APT-1002', patientName: 'Bob Smith', doctor: 'Dr. Smith', date: '2026-04-12', time: '14:30', status: 'Scheduled', type: 'Follow-up' },
        ];

        // Seed Logs (Stack Exp 2)
        initialDb.logs.push({ action: 'System DB Initialized', time: new Date().toLocaleTimeString(), type: 'system', color: 'bg-green-500' });

        setDb(initialDb);
        sync();
    }
  }, []);

  const value = {
    db,
    sync,
    // Scheduled Appointments Tracking
    scheduleAppointment: (patientName, doctorName, date, time) => {
      const apt = {
        id: `APT-${Math.floor(Math.random() * 9000) + 1000}`,
        patientName, doctor: doctorName, date, time, status: 'Scheduled', type: 'Consultation'
      };
      db.scheduledAppointments.push(apt);
      db.logs.push({ action: `Scheduled APT for ${patientName} w/ ${doctorName}`, time: new Date().toLocaleTimeString(), type: 'appointment', color: 'bg-indigo-500' });
      sync();
    },
    updateDoctorAvailability: (docName, days, hours) => {
      const doc = db.doctorsMap.find(d => d.name === docName);
      if (doc) {
        doc.days = days; doc.hours = hours;
        db.logs.push({ action: `Updated hours for ${docName}`, time: new Date().toLocaleTimeString(), type: 'doctor', color: 'bg-purple-500' });
        sync();
      } else {
        db.doctorsMap.push({ id: `D${Math.floor(Math.random()*100)}`, name: docName, specialty: 'General', days, hours });
        sync();
      }
    },
    // Regular Enqueue (Receptionist / Walk-in)
    admitPatient: (name, reason, dob, bloodGroup) => {
      const id = Math.floor(Math.random() * 1000) + 200; 
      const newPatient = { id, name, reason, dob, bloodGroup };
      db.patients.insert(newPatient); 
      db.queue.enqueue(newPatient);   
      db.logs.push({ action: `Added ${name} (ID: ${id}) to Queue`, time: new Date().toLocaleTimeString(), type: 'patient', color: 'bg-teal-500' });
      sync();
    },
    // Emergency Enqueue (Jumps Line)
    admitEmergency: (name, reason) => {
      const id = Math.floor(Math.random() * 1000) + 200; 
      const newPatient = { id, name, reason, isEmergency: true };
      db.patients.insert(newPatient); 
      db.queue.enqueueEmergency(newPatient);   
      db.logs.push({ action: `EMERGENCY ALERT: ${name} (ID: ${id}) admitted!`, time: new Date().toLocaleTimeString(), type: 'emergency', color: 'bg-red-500' });
      sync();
    },
    // Priority Jump (Mark waiting patient as emergency)
    markAsEmergency: (id, name) => {
      db.queue.prioritize(id);
      db.logs.push({ action: `${name} moved to EMERGENCY!`, time: new Date().toLocaleTimeString(), type: 'emergency', color: 'bg-red-500' });
      sync();
    },
    // Self-Booking (For Patients)
    bookAppointment: (name, symptom) => {
      const id = Math.floor(Math.random() * 1000) + 200; 
      const newPatient = { id, name, reason: symptom };
      db.patients.insert(newPatient); 
      db.queue.enqueue(newPatient);   
      db.logs.push({ action: `Self-booked: ${name} (Online)`, time: new Date().toLocaleTimeString(), type: 'patient', color: 'bg-pink-500' });
      sync();
    },
    // Doctor Dequeue
    seeDoctor: () => {
      const patient = db.queue.dequeue(); 
      if (patient) {
        db.beds.takeBed(); 
        db.logs.push({ action: `Dr seen ${patient.name}`, time: new Date().toLocaleTimeString(), type: 'doctor', color: 'bg-blue-500' });
        sync();
      }
      return patient;
    }
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
