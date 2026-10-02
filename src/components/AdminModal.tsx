import React from 'react';
import { AdminSettings, ProviderId } from '../types';
import { 
  X, 
  Settings, 
  BarChart3, 
  ToggleLeft, 
  ToggleRight, 
  CloudRain, 
  Sun, 
  Activity, 
  DollarSign, 
  Users, 
  Search, 
  CheckCircle,
  Shield
} from 'lucide-react';

interface AdminModalProps {
  settings: AdminSettings;
  onUpdateSettings: (newSettings: AdminSettings) => void;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const toggleProvider = (id: ProviderId) => {
    onUpdateSettings({
      ...settings,
      providerEnabled: {
        ...settings.providerEnabled,
        [id]: !settings.providerEnabled[id]
      }
    });
  };

  const handleSurgeChange = (val: number) => {
    onUpdateSettings({
      ...settings,
      surgeMultiplier: val
    });
  };

  const handleWeatherChange = (weather: 'clear' | 'rain' | 'traffic') => {
    onUpdateSettings({
      ...settings,
      weatherCondition: weather
    });
  };

  const providersList: { id: ProviderId; name: string; tag: string; defaultColor: string }[] = [
    { id: 'uber', name: 'Uber Technologies', tag: 'Cabs, Moto, Auto', defaultColor: 'text-black dark:text-white' },
    { id: 'ola', name: 'Ola Cabs (ANI Tech)', tag: 'Mini, Prime, Auto', defaultColor: 'text-emerald-600' },
    { id: 'rapido', name: 'Rapido (Roppen)', tag: 'Bike Taxi, Auto', defaultColor: 'text-amber-500' },
    { id: 'indrive', name: 'inDrive Mobility', tag: 'Cab Bidding, Auto', defaultColor: 'text-sky-600' },
    { id: 'blusmart', name: 'BluSmart Mobility', tag: '100% Electric EV', defaultColor: 'text-blue-600' },
    { id: 'nammayatri', name: 'Namma Yatri / Moving Tech', tag: 'Direct ONDC Open Auto/Cab', defaultColor: 'text-orange-500' },
    { id: 'yatrisathi', name: 'Yatri Sathi (Govt WB)', tag: 'Regulated Taxi Meter', defaultColor: 'text-teal-600' }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Admin Control Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage aggregations, surge simulation & provider connectivity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Analytics & KPI Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Platform Analytics (Simulated Live)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 text-[11px] font-medium">Total Searches</span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {settings.simulatedSearchesCount.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">+18% today</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 text-[11px] font-medium">Total Bookings</span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {settings.simulatedBookingsCount.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">46% conversion</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 text-[11px] font-medium">User Savings</span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{settings.totalUserSavings.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Avg ₹95 / ride</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 text-[11px] font-medium">Est. Revenue</span>
                <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                  ₹18,450
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Via referral & ads</span>
              </div>
            </div>
          </div>

          {/* 2. Weather & Surge Simulation */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span>Dynamic Surge & Weather Simulator</span>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-black">
                {settings.surgeMultiplier.toFixed(1)}x Multiplier
              </span>
            </h4>

            {/* Weather Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleWeatherChange('clear')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  settings.weatherCondition === 'clear'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Normal / Clear</span>
              </button>
              <button
                onClick={() => handleWeatherChange('rain')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  settings.weatherCondition === 'rain'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Rain Surge (+35%)</span>
              </button>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Standard (1.0x)</span>
                <span>Peak Hours (1.5x)</span>
                <span>Heavy Surge (2.5x)</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={settings.surgeMultiplier}
                onChange={(e) => handleSurgeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* 3. Provider Enable/Disable & API Health */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              Connected Ride Provider Integrations
            </h4>

            <div className="space-y-2">
              {providersList.map((p) => {
                const isEnabled = settings.providerEnabled[p.id];
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${p.defaultColor}`}>
                          {p.name}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md">
                          {p.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>API Status: Healthy (avg 38ms latency)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleProvider(p.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isEnabled
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-700'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Disabled</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
