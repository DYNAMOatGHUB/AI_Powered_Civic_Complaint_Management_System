import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import client from '../api/client';

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleMobileChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mobileNumber.length !== 10) {
      setError("Mobile number must be exactly 10 digits (numbers only).");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await client.post('/auth/register', {
          mobile_number: mobileNumber,
          username: username || undefined,
          password,
          name,
          email
        });
        localStorage.setItem('token', res.data.access_token);
        onLoginSuccess({ 
          mobile_number: res.data.mobile_number, 
          username: res.data.username || res.data.mobile_number, 
          role: res.data.role 
        });
        onClose();
      } else {
        const res = await client.post('/auth/login', {
          mobile_number: mobileNumber,
          password,
          role: 'citizen'
        });
        localStorage.setItem('token', res.data.access_token);
        onLoginSuccess({ 
          mobile_number: res.data.mobile_number, 
          username: res.data.username || res.data.mobile_number, 
          role: res.data.role 
        });
        onClose();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail.map(d => d.msg).join(', '));
        } else {
          setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        }
      } else {
        setError("Authentication failed. Please check your mobile number and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">{isRegister ? 'Citizen Registration' : 'Municipal Portal Login'}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number (10 Digits) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-gray-400 font-semibold">+91</span>
              <input 
                type="tel" 
                value={mobileNumber} 
                onChange={handleMobileChange} 
                placeholder="e.g. 9876543210"
                maxLength={10}
                className="w-full border border-gray-300 rounded pl-11 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required 
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username (Optional)</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter a username (optional)"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password *</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required 
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="user@example.com"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs"
                />
              </div>
            </>
          )}

          <div className="pt-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded font-bold text-xs shadow transition"
            >
              {loading ? 'Authenticating...' : (isRegister ? 'Register Citizen Account' : 'Login to Portal')}
            </button>
          </div>

          <div className="text-center pt-2 border-t">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-xs text-emerald-800 hover:underline font-medium"
            >
              {isRegister ? 'Already have an account? Login here' : "Don't have an account? Register here"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default LoginModal;
