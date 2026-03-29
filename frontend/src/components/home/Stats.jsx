import { Activity } from 'lucide-react';
import './Home.css';

const StatBlock = ({ num, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: 'linear-gradient(135deg, #1A2B6D, #2E5BFF)', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-40px', right: '-40px', opacity: 0.1 }}>
      <Activity size={150} />
    </div>
    <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px', position: 'relative', zIndex: 10 }}>{num}</h2>
    <p style={{ fontSize: '18px', color: '#E6F0FF', fontWeight: '500', position: 'relative', zIndex: 10 }}>{label}</p>
  </div>
);

const Stats = () => {
  return (
    <section className="section white" id="stats">
      <div className="max-w-container">
        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <StatBlock num="1,000+" label="Verified Hospitals" />
          <StatBlock num="2.5M" label="Patients Managed" />
          <StatBlock num="99.9%" label="System Uptime" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
