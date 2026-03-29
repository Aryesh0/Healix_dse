import './Home.css';

const ModuleCard = ({ title, features }) => (
  <div className="feature-card">
    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A2B6D', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>{title}</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', color: '#4A5568' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27C24C', marginRight: '12px' }}></span>
          {f}
        </li>
      ))}
    </ul>
  </div>
);

const Modules = () => {
  return (
    <section className="section gray" id="modules">
      <div className="max-w-container">
        <div className="section-header">
          <h2 style={{ color: '#2E5BFF', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px' }}>Comprehensive Coverage</h2>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1A2B6D' }}>Core System Modules</h3>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <ModuleCard 
            title="Patient Administration" 
            features={["Unique Patient ID Generation", "Medical History Tracking", "Document Management", "Automated Appointments"]}
          />
          <ModuleCard 
            title="Clinic Management" 
            features={["Doctor Directory Mapping", "Department Hierarchies", "Consultation Scheduling", "Prescription Generator"]}
          />
          <ModuleCard 
            title="Inventory & Pharmacy" 
            features={["Medicine Stock Tracking", "Vendor Integrations", "Expiry Date Alerts", "Bin Search Algorithms"]}
          />
          <ModuleCard 
            title="Dynamic Workflows" 
            features={["Priority Queue System", "Ward & Bed Tracking", "OT Scheduling System", "Live Department Transfers"]}
          />
          <ModuleCard 
            title="Billing & Invoicing" 
            features={["Unified Outpatient Bills", "Inpatient Estimations", "Insurance Claim Logs", "Stripe API Integrity"]}
          />
          <ModuleCard 
            title="Analytics & DSA" 
            features={["Role-based Dashboards", "Big-O Scaled Searching", "Visual Graph Referrals", "Undo Stack Operations"]}
          />
        </div>
      </div>
    </section>
  );
};

export default Modules;
