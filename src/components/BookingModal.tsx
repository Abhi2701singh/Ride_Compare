import React, { useState, useEffect } from 'react';
import { RideOption, LocationPoint, DriverInfo } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Key, 
  QrCode, 
  Car, 
  ArrowRight,
  ExternalLink,
  Wallet,
  Sparkles,
  Receipt
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
  const [step, setStep] = useState<'review' | 'matching' | 'in_progress' | 'pay_at_destination'>('review');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'wallet'>('cash');
  const [otp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [etaRemaining, setEtaRemaining] = useState(ride.etaMinutes);
  const [hasPaid, setHasPaid] = useState(false);

  const driverNames = [
    'Rajesh Kumar Sharma',
    'Vikram Singh',
    'Mohammad Arif',
    'Amitabh Verma',
    'Sunil Yadav',
    'Ramesh Patil'
  ];

  const handleConfirmRide = () => {
    setStep('matching');

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
      setStep('in_progress');

      onBookingSuccess(`BK-${Date.now().toString().slice(-6)}`);
    }, 2400);
  };

  // Reached destination trigger
  const handleArriveAtDestination = () => {
    setStep('pay_at_destination');
  };

  // Mark payment completed at destination
  const handleFinishPayment = () => {
    setHasPaid(true);
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // no-op
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: REVIEW & SELECT HOW TO PAY AT DESTINATION */}
        {step === 'review' && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${ride.providerBg}`}>
                {ride.providerName}
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Ride Booking
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {ride.vehicleName} • {ride.vehicleModel}
                </p>
              </div>
            </div>

            {/* Crucial Indian Ride-Hailing Notice: Pay After Reaching */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl flex items-start gap-2.5 mb-4 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  Paise Destination Par Pahunchne Ke Baad Dena Hai (Pay on Arrival)
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Abhi koi payment nahi karni. Jab driver aapko destination par chhod dega, tab aap Cash ya UPI se pay kar sakte hain.
                </p>
              </div>
            </div>

            {/* Route Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 mb-4 text-xs space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Pickup</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{pickup.shortName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0"></span>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Destination</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{destination.shortName}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                <span>Distance: {ride.distanceKm} km</span>
                <span>Trip: ~{ride.durationMinutes} mins</span>
              </div>
            </div>

            {/* Preferred Payment Mode Choice for Destination */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Aap Destination Par Kaise Pay Karenge? (Choose Payment Mode)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cash', label: 'Cash to Driver', desc: 'Pay cash upon arrival', icon: '💵' },
                  { id: 'upi', label: 'UPI / QR Code', desc: 'GPay / PhonePe at drop', icon: '📱' },
                  { id: 'card', label: 'Card Payment', desc: 'Debit / Credit card', icon: '💳' },
                  { id: 'wallet', label: 'Ride Wallet', desc: 'Balance deduction', icon: '👛' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPaymentMode(item.id as any)}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      paymentMode === item.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-bold">{item.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Fare Due at Destination */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Due Amount after Trip</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">₹{ride.fare}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
                Pay to Driver Later
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleConfirmRide}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm Ride (No Advance Money Needed)</span>
              </button>

              <a
                href={ride.deepLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Or Book Directly on {ride.providerName} App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* STEP 2: RADAR MATCHING */}
        {step === 'matching' && (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
            <div className="relative flex items-center justify-center w-32 h-32 mb-5">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-3 bg-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl text-2xl">
                🚕
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Finding Nearest {ride.providerName} Partner...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Searching available {ride.vehicleName} within 1 km of {pickup.shortName}.
            </p>
          </div>
        )}

        {/* STEP 3: DRIVER ASSIGNED & IN-PROGRESS (OTP DISPLAYED) */}
        {step === 'in_progress' && driver && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Driver Assigned!</span>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-lg">
                Arriving in {etaRemaining} mins
              </span>
            </div>

            {/* OTP BOX (Crucial for boarding) */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-2xl flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-xl">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                    ONE-TIME TRIP START OTP
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Gaadi me baithne ke baad driver ko de
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black tracking-widest text-amber-900 dark:text-amber-200 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl shadow-sm border border-amber-200 dark:border-amber-700">
                {otp}
              </span>
            </div>

            {/* Driver Profile */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg border-2 border-white dark:border-slate-600 shadow">
                    👤
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
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
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {driver.vehicleModel}
                  </p>
                </div>
              </div>

              {/* Call/Message */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700">
                <a
                  href={`tel:${driver.phone}`}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
                <button
                  onClick={() => alert(`Driver message: "Haan ji, main 2 minute me ${pickup.shortName} par pahunch raha hu."`)}
                  className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Payment reminder banner */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl mb-4 text-xs flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>Payable at Destination:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">₹{ride.fare} ({paymentMode.toUpperCase()})</span>
            </div>

            {/* Destination reached simulation trigger */}
            <button
              onClick={handleArriveAtDestination}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Destination Par Pahunch Gaye? Click Karein (Pay ₹{ride.fare})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: DESTINATION REACHED - PAY DRIVER NOW */}
        {step === 'pay_at_destination' && driver && (
          <div className="p-5 sm:p-6 text-center">
            {!hasPaid ? (
              <>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                  🏁
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Destination Arrived!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Aap {destination.shortName} pahunch chuke hain. Please driver ko payment karein.
                </p>

                {/* Amount Due Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/90 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 mb-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Total Amount Due
                  </span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white my-0.5">
                    ₹{ride.fare}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pay to: <strong>{driver.name}</strong> ({driver.vehicleNumber})
                  </p>
                </div>

                {/* UPI QR Code Simulator or Cash */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-5">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>Driver Ka UPI QR Code (GPay / PhonePe / Paytm)</span>
                  </div>
                  {/* Simulated QR Pattern */}
                  <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl shadow border border-slate-200 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold text-center p-2">
                      Scan to Pay ₹{ride.fare}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Ya driver ko direct <strong>₹{ride.fare} Cash</strong> de dein.
                  </p>
                </div>

                <button
                  onClick={handleFinishPayment}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Maine Paise De Diye (Payment Done)</span>
                </button>
              </>
            ) : (
              /* PAYMENT CONFIRMED SCREEN */
              <div className="py-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Trip Completed & Paid!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 mb-5">
                  ₹{ride.fare} successfully paid to {driver.name}. Thank you for riding with {ride.providerName}!
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-left mb-5 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Paid:</span>
                    <strong className="text-slate-800 dark:text-slate-200">₹{ride.fare}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Mode:</span>
                    <span className="font-semibold text-emerald-600 uppercase">{paymentMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date & Time:</span>
                    <span className="text-slate-700 dark:text-slate-300">Just now</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs"
                >
                  Done & Back to Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
