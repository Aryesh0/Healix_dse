import { Activity, Globe, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="max-w-container">
        
        <div className="grid-4" style={{ borderBottom: '1px solid #2a3e8e', paddingBottom: '64px', marginBottom: '64px', gridTemplateColumns: 'reapeat(auto-fit, minmax(200px, 1fr))' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ background: '#2E5BFF', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <Activity size={24} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', tracking: 'wide' }}>Healix<span style={{ color: '#2E5BFF' }}>.</span></span>
            </div>
            <p style={{ color: '#A0AEC0', lineHeight: '1.6', maxWidth: '300px', marginBottom: '24px' }}>
              Transforming hospital administration with intelligent, scalable, cloud-native tools engineered around core data structures.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a3e8e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={18} /></a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a3e8e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={18} /></a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a3e8e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={18} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link to="/register">Book a Demo</Link></li>
              <li><Link to="/login">Admin Login</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#stats">Metrics</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Modules</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><a href="#">Patient Records</a></li>
              <li><a href="#">Pharmacy Inventory</a></li>
              <li><a href="#">Billing Ecosystem</a></li>
              <li><a href="#">Smart Queue AI</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">HIPAA Compliance</a></li>
              <li><a href="#">Cookie Notice</a></li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', color: '#A0AEC0', fontSize: '14px' }}>
          <p>&copy; {new Date().getFullYear()} Healix Hospital Management System. All rights reserved.</p>
          <p>Engineered with React & Spring Boot</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
