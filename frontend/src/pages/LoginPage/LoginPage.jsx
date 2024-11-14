import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Register; Step 2: Verify code
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleSendVerificationCode = async () => {
    try {
      await axios.post('/api/auth/send-verification-code', { email });
      setStep(2); // Move to the code verification step
    } catch (err) {
      setError('Failed to send verification code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('/api/auth/verify-code', {
        email,
        code: verificationCode,
      });
      if (response.data.message === 'Code verified') {
        handleSignUp(); // Complete the sign-up process
      }
    } catch (err) {
      setError('Invalid verification code');
    }
  };

  const handleSignUp = async () => {
    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      onLogin('fakeToken'); // Placeholder token for authenticated state
    } catch (err) {
      setError('Failed to sign up');
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      if (response.data.token) {
        onLogin(response.data.token);
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Create Account</h1>
          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={handleSendVerificationCode}>
                Send Verification Code
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button type="button" onClick={handleVerifyCode}>
                Verify Code
              </button>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Sign in</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#">Forgot your password?</a>
          <button type="button" onClick={handleSignIn}>Sign In</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={() => setRightPanelActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start your journey with us</p>
            <button className="ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
