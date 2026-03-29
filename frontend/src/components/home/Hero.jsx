import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, FileBarChart } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="max-w-container" style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        
        {/* Left Side Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Driven <span style={{ color: '#2E5BFF', position: 'relative' }}>
              Cloud Based
            </span> <br/>
            Hospital Management System
          </h1>
          <p className="hero-text">
            Our Hospital Software integrated with automation tools and patient care systems, 
            enhances your medical experience with real-time collaboration. Stop Waiting, 
            Improve your healthcare future with our AI-powered hospital management system.
          </p>
          
          <div style={{ marginTop: '24px' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px', borderRadius: '9999px', textDecoration: 'none' }}>
              Start Free Demo
              <Activity size={20} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </div>

        {/* Right Side Cards (Healthray Style Demo) */}
        <div className="hero-visuals">
          
          <div className="card" style={{ position: 'absolute', top: '40px', left: '0', width: '250px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B6D' }}>Mobility</span>
            <div style={{ background: '#E6F0FF', padding: '16px', borderRadius: '50%', color: '#2E5BFF' }}>
               <Activity size={40} />
            </div>
          </div>

          <div className="card" style={{ position: 'absolute', top: '120px', right: '0', width: '280px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 10 }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B6D' }}>100% Paperless</span>
            <div style={{ background: '#E2F8E9', padding: '16px', borderRadius: '50%', color: '#27C24C' }}>
               <FileBarChart size={40} />
            </div>
          </div>

          <div className="card" style={{ position: 'absolute', bottom: '40px', left: '100px', width: '250px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B6D' }}>Security</span>
            <div style={{ background: '#FFF0EB', padding: '16px', borderRadius: '50%', color: '#f59e0b' }}>
               <ShieldCheck size={40} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
