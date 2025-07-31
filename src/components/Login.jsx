import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NET from 'vanta/src/vanta.net';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState('');

  // Ref for Vanta effect instance
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

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

  const handleLogin = async () => {
    const { email, password } = form;
    if (isAuthenticating) return;

    setAuthenticating(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        throw new Error(data.message || '❌ Failed to authenticate');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div
      ref={vantaRef}
      className="min-h-screen flex items-center justify-center"
      aria-label="Login page background animation"
    >
      <div className="bg-stone-500/10 backdrop-blur-xs p-8 rounded-2xl w-full max-w-md space-y-4 text-center mx-4 sm:mx-0">
        <h2 className="text-2xl font-extrabold text-amber-400">Login</h2>
        {error && (
          <p role="alert" className="text-red-500" tabIndex={-1}>
            {error}
          </p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          autoComplete="username"
          required
          aria-label="Email"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border border-gray-400 placeholder:text-gray-200 focus:bg-white focus:text-black focus:placeholder:text-gray-700 text-white"
          autoComplete="current-password"
          required
          aria-label="Password"
        />

        <button
          type="submit"
          onClick={handleLogin}
          disabled={isAuthenticating}
          className={`w-full p-3 bg-yellow-400 rounded-xl text-gray-700 font-semibold transition-colors ${
            isAuthenticating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500'
          }`}
          aria-busy={isAuthenticating}
        >
          {isAuthenticating ? 'Loading...' : 'Submit'}
        </button>

        <hr className="border-t border-gray-400" />

        <p className="text-gray-100">Don't have an account?</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-[#ecf0f180] text-white p-3 rounded-xl w-full hover:bg-[#ecf0f1aa] transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
