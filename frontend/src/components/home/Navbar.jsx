import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { Activity, ChevronDown, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NavItem = ({ title, description }) => (
  <div className="nav-item">
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {title} <ChevronDown size={14} />
    </span>
    {/* Dropdown Card */}
    <div className="nav-dropdown">
      <h4 style={{ color: '#1A2B6D', fontWeight: 'bold', marginBottom: '8px' }}>{title} Overview</h4>
      <p style={{ color: '#4A5568', fontSize: '14px', margin: 0 }}>{description}</p>
    </div>
  </div>
);

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      toast.error('Please login or register first');
    }
  };

  return (
    <header className="navbar">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ background: '#2E5BFF', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <Activity size={24} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A2B6D' }}>Healix</span>
        </Link>
        
        {/* Nav Links */}
        <nav className="nav-links">
          <NavItem title="Features" description="Explore advanced tools securing modern clinics." />
          <NavItem title="Modules" description="Patient, HR, Inventory, Billing engines detailed." />
          <NavItem title="Services" description="Implementation, onboarding, and 24/7 technical support." />
          <NavItem title="Resources" description="DSA documentation, API docs, and architecture diagrams." />
          <a href="#about" className="nav-item">About</a>
          <a href="#contact" className="nav-item">Contact</a>
        </nav>

        {/* Auth CTA */}
        <div className="nav-actions">
          <button 
            onClick={handleDashboardClick}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#1A2B6D', padding: '8px 16px' }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          {isAuthenticated ? (
            <button 
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
              }}
              style={{ fontWeight: 'bold', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 16px' }}
            >
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: 'bold', color: '#1A2B6D', textDecoration: 'none', padding: '8px 16px' }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '9999px', textDecoration: 'none' }}>
                Book A Demo
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
