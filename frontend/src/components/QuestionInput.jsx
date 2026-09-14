import React, { useState } from 'react';
import { Search } from 'lucide-react';

const EXAMPLES = [
  "Does buying NIFTY after a 1% fall work better during high-volatility periods?",
  "Does NIFTY tend to recover after falling more than 2% in one day?",
  "Does buying after three consecutive down days have an edge?",
  "Does going short on BANKNIFTY work better on Fridays compared to other days?",
  "Do gap up openings of more than 0.5% tend to reverse by the end of the day?"
];

export default function QuestionInput({ onAnalyze, loading, onTextChange }) {
  const [text, setText] = useState('');

  const handleChange = (val) => {
    setText(val);
    if (onTextChange) onTextChange(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 transition-all hover:shadow-cyan-900/10 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-100 mb-2 shrink-0">What would you like to test?</h2>
      <p className="text-slate-400 mb-8 shrink-0">Describe your trading idea in natural language.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="relative group shrink-0">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <textarea
            className="relative w-full h-36 p-5 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 resize-none outline-none placeholder:text-slate-600 transition-all"
            placeholder="e.g. Does buying NIFTY after a 1% fall work better during high-volatility periods?"
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        
        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? 'Analyzing...' : 'Analyze Question'}
            {!loading && <Search className="w-5 h-5" />}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800/50">
        <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Example Questions</h3>
        <div className="space-y-3">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleChange(ex)}
              className="block w-full text-left px-5 py-4 rounded-xl text-sm text-slate-400 bg-slate-950 hover:bg-slate-800 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
