import React, { useState } from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function ClarificationPanel({ analysis, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [customValues, setCustomValues] = useState({});

  const handleOptionSelect = (field, option) => {
    setAnswers(prev => ({ ...prev, [field]: option }));
    const newCustom = { ...customValues };
    delete newCustom[field];
    setCustomValues(newCustom);
  };

  const handleCustomChange = (field, value) => {
    setCustomValues(prev => ({ ...prev, [field]: value }));
    setAnswers(prev => ({ ...prev, [field]: 'Custom' }));
  };

  const handleSubmit = () => {
    // Merge final answers
    const finalAnswers = {};
    analysis.missingInformation.forEach(m => {
      if (answers[m.field] === 'Custom' && customValues[m.field]) {
        finalAnswers[m.field] = customValues[m.field];
      } else {
        finalAnswers[m.field] = answers[m.field];
      }
    });
    onSubmit(finalAnswers);
  };

  const isComplete = analysis.missingInformation.every(m => {
    if (answers[m.field] === 'Custom') return !!customValues[m.field];
    return !!answers[m.field];
  });

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          <HelpCircle className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Clarification Needed</h2>
          <p className="text-slate-400 text-sm">Some important details were missing from your question.</p>
        </div>
      </div>

      <div className="space-y-6">
        {analysis.missingInformation.map((item, idx) => (
          <div key={idx} className="bg-slate-950 rounded-xl p-6 border border-slate-800 transition-all hover:border-slate-700">
            <h3 className="font-bold text-slate-200 capitalize mb-2">
              {item.field.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-slate-400 text-sm mb-5">{item.question}</p>
            
            <div className="space-y-3">
              {item.options.map((opt, i) => (
                <label key={i} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border ${answers[item.field] === opt ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}>
                  <input
                    type="radio"
                    name={item.field}
                    className="w-4 h-4 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500"
                    checked={answers[item.field] === opt}
                    onChange={() => handleOptionSelect(item.field, opt)}
                  />
                  <span className={answers[item.field] === opt ? 'text-cyan-400 font-medium' : 'text-slate-300'}>{opt}</span>
                </label>
              ))}
              
              <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border ${answers[item.field] === 'Custom' ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}>
                <input
                  type="radio"
                  name={item.field}
                  className="w-4 h-4 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  checked={answers[item.field] === 'Custom'}
                  onChange={() => handleOptionSelect(item.field, 'Custom')}
                />
                <span className={answers[item.field] === 'Custom' ? 'text-cyan-400 font-medium' : 'text-slate-300'}>Custom</span>
                {answers[item.field] === 'Custom' && (
                  <input
                    type="text"
                    className="ml-3 flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter custom value..."
                    value={customValues[item.field] || ''}
                    onChange={(e) => handleCustomChange(item.field, e.target.value)}
                  />
                )}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50 hover:-translate-y-0.5"
        >
          Build Experiment
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
