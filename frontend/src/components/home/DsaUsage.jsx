import { Network, Server, HardDrive, Cpu, AlignLeft, Layers } from 'lucide-react';
import './Home.css';

const DsaBlock = ({ icon, title, tech }) => (
  <div className="feature-card" style={{ display: 'flex' }}>
    <div style={{ marginRight: '24px', color: '#2E5BFF', background: '#e6f0ff', padding: '16px', borderRadius: '12px', height: 'max-content' }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B6D', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#4A5568', lineHeight: '1.6' }}>{tech}</p>
    </div>
  </div>
);

const DsaUsage = () => {
  return (
    <section className="section" style={{ background: '#F8FAFF', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }} id="technology">
      <div className="max-w-container">
        <div style={{ display: 'flex', gap: '64px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ color: '#2E5BFF', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px' }}>Engineering Core</h2>
            <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1A2B6D', marginBottom: '24px', lineHeight: '1.2' }}>Powered By Fundamental Data Structures</h3>
            <p style={{ color: '#4A5568', fontSize: '18px', marginBottom: '24px' }}>
              Beneath the sleek React interface lies a highly optimized Java Spring Boot engine engineered to handle massive clinical scale using theoretical computer science principles.
            </p>
            <div>
              <button className="btn btn-secondary" style={{ padding: '12px 24px' }}>Read Architecture Docs</button>
            </div>
          </div>

          <div className="grid-2" style={{ flex: '2 1 500px' }}>
            <DsaBlock 
              icon={<AlignLeft size={28} />}
              title="Fast Lookups" 
              tech="HashMaps O(1) time complexity for instant retrieval of patient documents, physician profiles, and active billing statuses without full-table database scans."
            />
            <DsaBlock 
              icon={<Layers size={28} />}
              title="Emergency Sorting" 
              tech="Priority Queues (Min-Heap) dynamically rank incoming patients. Critical emergency room cases automatically bubble to the front of the queue."
            />
            <DsaBlock 
              icon={<Server size={28} />}
              title="Visit History" 
              tech="Linked Lists track chronologically ordered patient visits, allowing bidirectional traversal through a patient's entire medical timeline."
            />
            <DsaBlock 
              icon={<Network size={28} />}
              title="Department Trees" 
              tech="Hierarchical Tree structures algorithmically map complex hospital department relationships and specialized doctor routing trees."
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default DsaUsage;
