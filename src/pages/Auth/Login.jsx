import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Input from './Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('login');

  // --- EmailJS Config ---
  const SERVICE_ID = "YOUR_SERVICE_ID";
  const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Login Successful!");
      localStorage.setItem("user", JSON.stringify(data.user)); 
      setTimeout(() => { window.location.href = "/"; }, 1000);
    } else {
      setMessage(data.message || "Invalid credentials");
    }
  } catch (error) {
    setMessage("Connection error!");
  }
};

  const handleRequestOTP = (e) => {
    e.preventDefault();
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);

    const templateParams = { to_email: email, message: newCode };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        setMessage('Security code sent to your email!');
        setMode('otp');
      })
      .catch(() => alert("Email sending failed!"));
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setMode('reset');
      setMessage('');
    } else {
      alert("Invalid Code! Please check your email again.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage('Password Updated Successful!');
    setTimeout(() => { setMode('login'); setMessage(''); }, 2000);
  };

  const handleGoogleClick = () => {

    window.location.href = "https://accounts.google.com/AccountChooser?service=lso&continue=https://myaccount.google.com/";
  };

  return (

    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-90 h-137.5 bg-white rounded-3xl border border-gray-100 p-7 shadow-sm text-center flex flex-col justify-center">

      <h1 className="text-2xl font-bold text-[#333333] mb-6">
        {mode === 'login' ? 'Login' : mode === 'forgot' ? 'Forgot Password' : mode === 'otp' ? 'Enter Code' : 'New Password'}
      </h1>

      {message && <p className="mb-4 text-green-600 font-bold text-sm">{message}</p>}

      {mode === 'login' && (

        <form className="space-y-3" onSubmit={handleLogin}>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" variant="outlined" required />
          <Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" variant="outlined" required />
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center text-[11px] text-gray-500 cursor-pointer">
              <input type="checkbox" className="mr-1 w-3 h-3 border-gray-300 text-[#2297FE]" /> Remember me
            </label>
            <button type="button" onClick={() => setMode('forgot')} className="text-[11px] font-bold text-[#333333] hover:underline">Forgot password?</button>
          </div>
          <Button variant="primary" type="submit">Log in</Button>
        </form>
      )}

      {mode === 'forgot' && (
        <form className="space-y-4" onSubmit={handleRequestOTP}>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" type="email" variant="outlined" required />
          <Button variant="primary" type="submit">Send Code</Button>
          <button type="button" onClick={() => setMode('login')} className="text-xs font-bold text-gray-400 mt-2">Back to Login</button>
        </form>
      )}

      {mode === 'otp' && (
        <form className="space-y-4" onSubmit={handleVerifyOTP}>
          <Input label="Verification Code" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 4-digit code" type="text" variant="outlined" required />
          <Button variant="primary" type="submit">Verify Code</Button>
        </form>
      )}

      {mode === 'reset' && (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <Input label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" type="password" variant="outlined" required />
          <Button variant="primary" type="submit">Update Password</Button>
        </form>
      )}

      {mode === 'login' && (
        <>
          <div className="flex items-center my-4">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-3 text-[10px] font-bold text-gray-400">OR</span>
            <div className="grow border-t border-gray-200"></div>
          </div>
          <Button variant="outline" onClick={handleGoogleClick}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" /> Log in with Google
          </Button>
          <p className="mt-6 text-xs text-gray-500">
            Need an account? <Link to="/signup" className="font-bold text-[#2297FE] hover:underline uppercase">SIGN UP</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;