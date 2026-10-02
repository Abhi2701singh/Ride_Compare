import React, { useState, useEffect } from 'react';
import { RideOption, LocationPoint, BookingStatus, DriverInfo } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Key, 
  MapPin, 
  Clock, 
  CreditCard, 
  Wallet, 
  ExternalLink,
  Car,
  AlertTriangle
} from 'lucide-react';

interface BookingModalProps {
  ride: RideOption;
  pickup: LocationPoint;
  destination: LocationPoint;
  onClose: () => void;
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  ride,
  pickup,
  destination,
  onClose,
  onBookingSuccess
}) => {
  const [step, setStep] = useState<'review' | 'matching' | 'confirmed'>('review');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card' | 'wallet'>('upi');
  const [status, setStatus] = useState<BookingStatus>('searching');
  const [otp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [etaRemaining, setEtaRemaining] = useState(ride.etaMinutes);

  // Driver names database
  const driverNames = [
    'Rajesh Kumar Sharma',
    'Vikram Singh',
    'Mohammad Arif',
    'Amitabh Verma',
    'Sunil Yadav',
    'Ramesh Patil'
  ];

  const handleConfirmBooking = () => {
    setStep('matching');
    setStatus('searching');

    // Simulate driver matching radar
    setTimeout(() => {
      const selectedName = driverNames[Math.floor(Math.random() * driverNames.length)];
      const randomVehicleNum = `DL ${Math.floor(1 + Math.random() * 9)}C ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(1000 + Math.random() * 9000)}`;

      const assignedDriver: DriverInfo = {
        name: selectedName,
        phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
        rating: 4.88,
        totalTrips: '3,420 trips',
        vehicleNumber: randomVehicleNum,
        vehicleModel: ride.vehicleModel,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        currentEtaMin: ride.etaMinutes
      };

      setDriver(assignedDriver);
      setStatus('driver_assigned');
      setStep('confirmed');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // no-op if blocked
      }

      onBookingSuccess(`BK-${Date.now().toString().slice(-6)}`);
    }, 2800);
  };

  // Countdown timer for driver arriving
  useEffect(() => {
    if (step === 'confirmed' && etaRemaining > 1) {
      const interval = setInterval(() => {
        setEtaRemaining(prev => Math.max(1, prev - 1));
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [step, etaRemaining]);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: REVIEW & PAYMENT SELECTION */}
        {step === 'review' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${ride.providerBg}`}>
                {ride.providerName}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Ride Booking
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {ride.vehicleName} • {ride.vehicleModel}
                </p>
              </div>
            </div>

            {/* Route Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 mb-5 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <div>
                  <p className="text-slate-400 font-medium">Pickup</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{pickup.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0"></span>
                <div>
                  <p className="text-slate-400 font-medium">Destination</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{destination.name}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                <span>Distance: {ride.distanceKm} km</span>
                <span>Trip Duration: ~{ride.durationMinutes} mins</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                SELECT PAYMENT METHOD
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: '⚡' },
                  { id: 'cash', label: 'Cash to Driver', icon: '💵' },
                  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'wallet', label: 'RideCompare Wallet', icon: '👛' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
                      paymentMethod === item.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Summary Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 flex items-center justify-between mb-5">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Payable Fare</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">₹{ride.fare}</p>
              </div>
              <div className="text-right text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  No Hidden Charges
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Includes GST & Tolls</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm & Request Driver</span>
              </button>

              <a
                href={ride.deepLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Or Book Directly on {ride.providerName} App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* STEP 2: RADAR MATCHING ANIMATION */}
        {step === 'matching' && (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
            {/* Animated Radar Circle */}
            <div className="relative flex items-center justify-center w-36 h-36 mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl">
                <Car className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Dispatching Nearest {ride.providerName} Partner...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Locating top rated {ride.vehicleName} drivers within 1.5 km of {pickup.shortName}.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
              <span>Securing best rate (₹{ride.fare})</span>
            </div>
          </div>
        )}

        {/* STEP 3: BOOKING CONFIRMED & DRIVER TRACKING */}
        {step === 'confirmed' && driver && (
          <div className="p-6">
            {/* Success Pill */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Ride Confirmed!</span>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Arriving in {etaRemaining} mins
              </span>
            </div>

            {/* OTP Showcase Box (Crucial for Indian ride hailing apps) */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-xl">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                    ONE-TIME TRIP START OTP
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Share only after boarding vehicle
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black tracking-widest text-amber-900 dark:text-amber-200 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl shadow-sm border border-amber-200 dark:border-amber-700">
                {otp}
              </span>
            </div>

            {/* Driver Profile Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm border-2 border-white dark:border-slate-600 shadow">
                    👤
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {driver.name}
                    </h4>
                    <p className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                      ⭐ {driver.rating} <span className="text-slate-400 font-normal">({driver.totalTrips})</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xs rounded-lg border border-slate-200 dark:border-slate-700 tracking-wider">
                    {driver.vehicleNumber}
                  </span>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {driver.vehicleModel}
                  </p>
                </div>
              </div>

              {/* Driver Contact Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700">
                <a
                  href={`tel:${driver.phone}`}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
                <button
                  onClick={() => alert(`Message sent to driver: "I am waiting at ${pickup.shortName}"`)}
                  className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Ride Status Tracker Timeline */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl mb-5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  Driver is en-route
                </span>
                <span>Payment: <strong className="uppercase">{paymentMethod}</strong> (₹{ride.fare})</span>
              </div>
            </div>

            {/* Done CTA */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
            >
              Back to Comparison Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
