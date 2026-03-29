import { Activity, ShieldCheck, FileBarChart, Monitor } from 'lucide-react';
import './Home.css';

const Step = ({ step, title, desc }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 10, flex: 1 }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', border: '4px solid #2E5BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E5BFF', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', position: 'relative', zIndex: 10 }}>
      {step}
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B6D', marginBottom: '12px' }}>{title}</h3>
    <p style={{ color: '#4A5568' }}>{desc}</p>
  </div>
);

const Workflow = () => {
  return (
    <section className="section gray" id="workflow">
      <div className="max-w-container">
        <div className="section-header">
          <h2 style={{ color: '#2E5BFF', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px' }}>Seamless Operations</h2>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1A2B6D' }}>A Digitally Connected Hospital</h3>
        </div>

        <div style={{ position: 'relative', marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '48px' }}>
          
          {/* Connecting Line */}
          <div style={{ position: 'absolute', top: '32px', left: '0', width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #2E5BFF, transparent)', opacity: 0.3, zIndex: 1 }}></div>

          <Step 
            step="1"
            title="Smart Admission" 
            desc="Patient registers at reception, data instantly mapped via $O(1)$ Hash Map routing."
          />
          <Step 
            step="2"
            title="Priority Queue" 
            desc="Emergency flagged patients auto-sorted using Min-Heap priority data structures."
          />
          <Step 
            step="3"
            title="Clinical Care" 
            desc="Doctor receives patient history securely over stateless JWT authenticated session."
          />
          <Step 
            step="4"
            title="Billing & Exit" 
            desc="Automated checkout calculations ensuring full 100% paperless efficiency."
          />

        </div>
      </div>
    </section>
  );
};

export default Workflow;
