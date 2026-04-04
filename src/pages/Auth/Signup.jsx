import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const Signup = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setMessage('Signup Successful!');
    setTimeout(() => { window.location.href = "/"; }, 1000);
  };

  const handleGoogleClick = () => {
    window.location.href = "https://accounts.google.com/AccountChooser?service=lso&continue=https://myaccount.google.com/";
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-90 h-137.5 bg-white rounded-3xl border border-gray-100 p-7 shadow-sm text-center flex flex-col justify-center">
      
      <h1 className="text-2xl font-bold text-[#333333] mb-5">Sign Up</h1>

      {message && <p className="mb-3 text-green-600 font-bold text-sm">{message}</p>}

      <form className="space-y-3" onSubmit={handleSignup}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" variant="outlined" required />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" variant="outlined" required />
        <Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" variant="outlined" required />
        
        <div className="text-[10px] text-gray-500 mt-2">
          I agree to the{' '}
          <a href="https://policies.google.com/terms" target="_blank" className="text-[#2297FE] font-bold hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/privacy" target="_blank" className="text-[#2297FE] font-bold hover:underline">
            Privacy Policy
          </a>
        </div>

        <Button variant="primary" type="submit">Sign up</Button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        Already have an account? <button onClick={onSwitch} className="font-bold text-[#2297FE] hover:underline uppercase">Log In</button>
      </p>

      <div className="flex items-center my-4">
        <div className="grow border-t border-gray-200"></div>
        <span className="mx-3 text-[10px] font-bold text-gray-400">or</span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      <Button variant="outline" onClick={handleGoogleClick}>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" /> Sign up with Google
      </Button>
    </div>
  );
};

export default Signup;