import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import NET from 'vanta/src/vanta.net';

const Register = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  // Initialize Vanta background effect on mount and cleanup on unmount
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          color: 0xfacc15,
          backgroundColor: 0x000000,
          maxDistance: 20.0,
          spacing: 15.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, phone, password, confirmPassword } = form;

    // Basic validation
    if (
      registering ||
      !name.trim() ||
      !email.includes('@kiit.ac.in') ||
      !phone.trim() ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      setError('❌ Invalid input or passwords do not match');
      return;
    }

    setRegistering(true);
    setError('');

    try {
      if (!showOtpField) {
        // Send OTP
        const otpRes = await fetch('http://localhost:3002/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const otpData = await otpRes.json();
        if (!otpRes.ok) throw new Error(otpData.error || 'Failed to send OTP');

        setShowOtpField(true);
        setRegistering(false);
        toast.info('OTP sent to your email!');
        return;
      }

      // Verify OTP
      const verifyRes = await fetch('http://localhost:3002/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Invalid OTP');

      // Register User
      const res = await fetch('http://localhost:3002/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (res.status === 409) {
        setError('User is already registered.');
        setRegistering(false);
        return;
      }

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
      setRegistering(false);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div
      ref={vantaRef}
      id="vanta"
      className="overflow-x-hidden min-h-screen flex flex-col items-center pt-6 px-4 bg-black"
      aria-label="Register page with animated background"
    >
      <img
        src="/mainlogo.png"
        alt="Main Logo"
        className="h-20 rounded-2xl hover:shadow-yellow-glow"
      />

      <div
        className="flex flex-col justify-center p-8 gap-4 group rounded-xl w-full max-w-md mt-10 bg-stone-500/10 backdrop-blur-xs shadow-md"
        role="form"
      >
        {error && (
          <div className="text-red-500 text-center" role="alert" tabIndex={-1}>
            {error}
            {error.includes('already') && (
              <div className="mt-2">
                <a href="/login" className="text-blue-600 underline">
                  Go to Login
                </a>
              </div>
            )}
          </div>
        )}

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          required
          aria-label="Name"
          disabled={registering}
        />
        <input
          name="email"
          type="email"
          placeholder="example_email@kiit.ac.in"
          value={form.email}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          required
          aria-label="Email"
          disabled={registering}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          required
          aria-label="Phone Number"
          disabled={registering}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          required
          aria-label="Password"
          disabled={registering}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          required
          aria-label="Confirm Password"
          disabled={registering}
        />

        {showOtpField && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
              required
              aria-label="One Time Password"
              disabled={registering}
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const otpRes = await fetch('http://localhost:3002/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email }),
                  });
                  const otpData = await otpRes.json();
                  if (!otpRes.ok) throw new Error(otpData.error || 'Failed to resend OTP');
                  toast.success('✅ OTP resent to your email.');
                } catch (err) {
                  toast.error(err.message);
                }
              }}
              disabled={registering}
              className="bg-blue-500 rounded-xl text-white p-3 w-full hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Resend OTP"
            >
              Resend OTP
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={registering}
          className="w-full p-3 bg-yellow-400 rounded-xl text-gray-700 hover:bg-yellow-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
          aria-busy={registering}
          aria-label={showOtpField ? "Verify OTP and create account" : "Send OTP"}
        >
          {registering
            ? 'Processing...'
            : showOtpField
            ? 'Verify & Create Account'
            : 'Send OTP'}
        </button>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        limit={1}
      />
    </div>
  );
};

export default Register;
