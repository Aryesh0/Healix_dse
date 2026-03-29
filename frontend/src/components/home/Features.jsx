import { Lock, Cloud, Zap, Clock } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon">
      {icon}
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B6D', marginBottom: '8px' }}>{title}</h3>
    <p style={{ color: '#4A5568', lineHeight: '1.6' }}>{desc}</p>
  </div>
);

const Features = () => {
  return (
    <section className="section white" id="features">
      <div className="max-w-container">
        <div className="section-header">
          <h2 style={{ color: '#2E5BFF', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px' }}>Enterprise Features</h2>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1A2B6D', marginBottom: '24px' }}>Built For Modern Hospital Infrastructure</h3>
          <p style={{ color: '#4A5568', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
            Healix automates time-consuming administrative tasks, empowering your clinical staff to focus 100% on patient healthcare outcomes.
          </p>
        </div>

        <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <FeatureCard 
            icon={<Lock size={28} />}
            title="Role-Based Secure Auth" 
            desc="Strict access controls for Receptionists, Doctors, and Administrators with JWT secured API validations."
          />
          <FeatureCard 
            icon={<Cloud size={28} />}
            title="100% Cloud Native" 
            desc="Experience zero downtime and seamless scalability with our AWS integrated cloud-native React and Java deployment."
          />
          <FeatureCard 
            icon={<Zap size={28} />}
            title="Fast DSA Lookups" 
            desc="Achieve immediate rendering of massive patient records via $O(1)$ Hash Map architectures embedded in our backend."
          />
          <FeatureCard 
            icon={<Clock size={28} />}
            title="Real-time Queues" 
            desc="Monitor physical wait rooms via Priority Heap logic separating standard appointments from emergency cases."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
