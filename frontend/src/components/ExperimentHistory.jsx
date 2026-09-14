import React from 'react';
import { Clock } from 'lucide-react';

export default function ExperimentHistory({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 h-full flex flex-col">
        <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" />
          Recent Experiments
        </h3>
        <div className="flex-1 flex items-center justify-center text-center p-6 text-slate-600 text-sm">
          Your completed experiments will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 flex flex-col max-h-[calc(100vh-8rem)]">
      <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2 shrink-0">
        <Clock className="w-5 h-5 text-slate-500" />
        Recent Experiments
      </h3>
      
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item, i) => (
          <div 
            key={item.id || i}
            className="block p-5 rounded-xl border border-slate-800/50 bg-slate-950 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">
                {item.instrument || 'Unknown'}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-sm font-medium text-slate-300 line-clamp-2 mb-4 group-hover:text-slate-200">
              "{item.question}"
            </p>
            
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span className="text-slate-500">{item.status}</span>
              <span className="text-emerald-400">Win Rate: {item.winRate || '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
