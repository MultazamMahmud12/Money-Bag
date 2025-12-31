import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + (error.message || "Please try again"));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Google sign-in successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Google sign-in failed: " + (error.message || "Please try again"));
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Left Side - Form Section */}
        <div className="form-section">
          <h1 className="welcome-title">Welcome Back</h1>
          <p className="welcome-subtitle">Access your financial dashboard</p>

          {/* Tab Buttons */}
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  <i className="icon-email">📧</i>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <i className="icon-lock">🔒</i>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="toggle-password">👁️</button>
                </label>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button type="submit" className="submit-btn">
                Sign In
              </button>

              <p className="register-link">
                Do you want to register? <span onClick={handleSignUp}>Sign Up</span>
              </p>

              <div className="social-login">
                <p>Or sign in with</p>
                <div className="social-buttons">
                  <button type="button" className="social-btn facebook">
                    <i className="fab fa-facebook-f">f</i>
                  </button>
                  <button type="button" onClick={handleGoogleSignIn} className="social-btn google">
                    <i className="fab fa-google">G</i>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sign Up Message */}
          {activeTab === 'signup' && (
            <div className="signup-redirect">
              <p>Ready to create an account?</p>
              <button onClick={handleSignUp} className="submit-btn">
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Illustration */}
        <div className="illustration-section">
          <div className="illustration-card">
            <div className="illustration-content">
              <div className="icon-play">▶️</div>
              <div className="icon-mail">✉️</div>
              <div className="icon-shapes">
                <div className="shape triangle">▲</div>
                <div className="shape circle">●</div>
              </div>
              <div className="chart-bars">
                <div className="bar bar-purple"></div>
                <div className="bar bar-blue"></div>
                <div className="bar bar-orange"></div>
              </div>
              <div className="decorative-wave"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
