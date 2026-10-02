import React from 'react';
import { LocationPoint } from '../types';
import { X, History, MapPin, ArrowRight, Trash2, RotateCcw } from 'lucide-react';

export interface TripHistoryItem {
  id: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  date: string;
  fare?: number;
  providerName?: string;
}

interface TripsHistoryModalProps {
  history: TripHistoryItem[];
  onSelectTrip: (item: TripHistoryItem) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const TripsHistoryModal: React.FC<TripsHistoryModalProps> = ({
  history,
  onSelectTrip,
  onClearHistory,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl">
              <History className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Trips & Searches
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quickly re-check fares for your regular routes
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

        {/* List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No recent searches yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Your searched journeys and comparisons will appear here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 truncate">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="truncate">{item.pickup.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.destination.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span>{item.date}</span>
                    {item.providerName && (
                      <span>• Booked with {item.providerName} (₹{item.fare})</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectTrip(item);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Compare</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
