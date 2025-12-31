import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          Moneybag
        </Link>

        {/* Contact Info */}
        <div className="navbar-contact">
          CALL US : (207) 34-5078
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">What We Do</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
          
          {currentUser ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>

        {/* Search */}
        <div className="navbar-search">
          <input type="text" placeholder="Search" />
          <button>🔍</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
