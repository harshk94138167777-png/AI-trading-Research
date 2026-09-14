import React from 'react';
import { BarChart2, CheckCircle, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function TestResultsData({ metrics, data }) {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-950 px-8 py-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-cyan-500" />
          <h2 className="text-xl font-bold text-slate-100">Data Results</h2>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 shrink-0">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 transition-all hover:border-cyan-500/30">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Occurrences</div>
            <div className="text-3xl font-black text-slate-100">{metrics.occurrences}</div>
          </div>
          <div className="bg-emerald-950/20 p-5 rounded-xl border border-emerald-900/50 transition-all hover:border-emerald-500/50">
            <div className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider mb-2">Win Rate</div>
            <div className="text-3xl font-black text-emerald-400">{metrics.winRate}</div>
          </div>
          <div className="bg-indigo-950/20 p-5 rounded-xl border border-indigo-900/50 transition-all hover:border-indigo-500/50">
            <div className="text-indigo-500/80 text-xs font-bold uppercase tracking-wider mb-2">Avg Return</div>
            <div className="text-3xl font-black text-indigo-400">{metrics.avgReturn}</div>
          </div>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 transition-all hover:border-cyan-500/30">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Sample Size</div>
            <div className="text-3xl font-black text-slate-100">{metrics.sampleSize}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest shrink-0">Return Distribution</h3>
          <div className="flex-1 w-full bg-slate-950/50 p-4 rounded-xl border border-slate-800 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="occurrences" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isPositive ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-6 gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              Negative Returns
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
              Positive Returns
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/50 px-8 py-3 border-t border-slate-800 shrink-0 text-center">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          * Note: Data generated via deterministic mock simulation for prototype demonstration.
        </span>
      </div>
    </div>
  );
}

export function TestResultsAI({ aiInterpretation, onReset }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-indigo-950/20 rounded-2xl shadow-xl border border-indigo-500/20 overflow-hidden relative transition-all hover:border-indigo-500/40">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
        <div className="p-8 pl-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-indigo-100">AI Interpretation</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">What we can reasonably conclude</h3>
              <p className="text-slate-200 text-lg leading-relaxed font-medium">
                {aiInterpretation.conclusion}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">What should we investigate next?</h3>
              <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {aiInterpretation.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-indigo-900/30">
                    <span className="text-indigo-400 font-bold text-xl leading-none mt-0.5">•</span>
                    <span className="text-slate-300">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12 mb-8">
        <button
          onClick={onReset}
          className="bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:-translate-y-1"
        >
          <RotateCcw className="w-5 h-5" />
          Start New Experiment
        </button>
      </div>
    </div>
  );
}
