import React from 'react';
import { Beaker, Play } from 'lucide-react';

export default function ExperimentCard({ experiment, onRun, loading }) {
  const fields = [
    { label: 'Market / Instrument', value: experiment.instrument },
    { label: 'Timeframe', value: experiment.timeframe },
    { label: 'Entry Condition', value: experiment.entryCondition },
    { label: 'Exit Condition', value: experiment.exitCondition },
    { label: 'Holding Period', value: experiment.holdingPeriod },
    { label: 'Filters', value: experiment.filters?.join(', ') || 'None' }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-cyan-900/20 px-8 py-5 border-b border-cyan-900/50 flex items-center gap-4">
        <Beaker className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-cyan-50">Structured Experiment</h2>
      </div>
      
      <div className="p-8">
        <div className="mb-8 pb-8 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">AI Interpretation</h3>
          <p className="text-slate-300 bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner">
            {experiment.hypothesis || 'Testing the defined conditions to determine edge.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {fields.map((f, i) => (
            <div key={i} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{f.label}</div>
              <div className="text-slate-200 font-medium">{f.value || 'Not specified'}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-900/10 border border-amber-900/30 rounded-xl p-5 mb-8">
          <h4 className="text-amber-500 font-bold mb-2 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Assumptions Made
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 ml-4">
            {experiment.assumptions?.length > 0 
              ? experiment.assumptions.map((a, i) => <li key={i}>{a}</li>)
              : <li>Standard mock trading conditions applied.</li>
            }
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onRun}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? 'Starting...' : 'Run Test (Demo)'}
            {!loading && <Play className="w-5 h-5 fill-current" />}
          </button>
        </div>
      </div>
    </div>
  );
}
