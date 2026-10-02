import React, { useState } from 'react';
import { UserAccount } from '../types';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface AuthModalProps {
  user: UserAccount;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  onUpdateUser,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(user.isLoggedIn ? 'login' : 'login');
  const [phone, setPhone] = useState(user.phone || '');
  const [name, setName] = useState(user.name || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setOtpInput('7492'); // Pre-fill mock OTP for smooth testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) {
      alert('Please enter the OTP.');
      return;
    }

    const updated: UserAccount = {
      ...user,
      name: name || 'Abhinav Singh',
      phone: phone || '+91 98765 43210',
      email: `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      isLoggedIn: true
    };
    onUpdateUser(updated);
    setSuccessMsg('Logged in successfully!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleQuickDemoLogin = () => {
    const demoUser: UserAccount = {
      id: 'usr_demo_1',
      name: 'Abhinav Singh',
      phone: '+91 98765 43210',
      email: 'abhinav@example.com',
      isLoggedIn: true,
      savedPlaces: [
        {
          id: 'sp_1',
          label: 'Home',
          type: 'home',
          location: {
            name: 'Noida Sector 62, Noida',
            shortName: 'Home (Noida Sec 62)',
            lat: 28.6280,
            lng: 77.3649
          }
        },
        {
          id: 'sp_2',
          label: 'Work Office',
          type: 'work',
          location: {
            name: 'Connaught Place, New Delhi',
            shortName: 'Office (CP)',
            lat: 28.6328,
            lng: 77.2197
          }
        }
      ]
    };
    onUpdateUser(demoUser);
    setSuccessMsg('Logged in as Abhinav Singh!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleLogout = () => {
    onUpdateUser({
      ...user,
      isLoggedIn: false
    });
    setOtpSent(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {user.isLoggedIn ? (
          /* USER PROFILE VIEW WHEN LOGGED IN */
          <div className="p-6">
            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {user.name}
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {user.phone} • {user.email}
                </p>
              </div>
            </div>

            {/* Saved Places */}
            <div className="my-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Saved Favorite Places
              </h4>
              <div className="space-y-2">
                {user.savedPlaces && user.savedPlaces.length > 0 ? (
                  user.savedPlaces.map((sp) => (
                    <div
                      key={sp.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg font-bold">
                          {sp.type === 'home' ? '🏠' : '🏢'}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{sp.label}</p>
                          <p className="text-[11px] text-slate-400">{sp.location.shortName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        Saved
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No saved places yet.</p>
                )}
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Log Out</span>
            </button>
          </div>
        ) : (
          /* LOGIN / SIGN IN FORM */
          <div className="p-6">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center text-2xl shadow-sm mb-2">
                🚕
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Login to RideCompare
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your bookings, save favorite places & unlock member discounts
              </p>
            </div>

            {/* Quick 1-Click Demo Login */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Quick Demo Login (Abhinav Singh)</span>
            </button>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-semibold uppercase">
                Or with Phone Number
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            {/* Phone Login Form */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Abhinav Singh"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 absolute left-3">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full pl-16 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all mt-2"
                >
                  Get OTP via SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300">
                  <p className="font-semibold">OTP sent to +91 {phone}</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">Use OTP: <strong>7492</strong> for instant verification</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter 4-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="7492"
                    maxLength={4}
                    className="w-full text-center tracking-widest text-lg font-black py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all mt-2"
                >
                  Verify & Enter
                </button>
              </form>
            )}

            {successMsg && (
              <div className="mt-3 p-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
