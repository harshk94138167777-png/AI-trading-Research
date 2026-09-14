import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, TrendingUp, Beaker, CheckCircle, Search, HelpCircle, Loader, Play } from 'lucide-react';
import QuestionInput from './components/QuestionInput';
import ClarificationPanel from './components/ClarificationPanel';
import ExperimentCard from './components/ExperimentCard';
import { TestResultsData, TestResultsAI } from './components/TestResults';
import ExperimentHistory from './components/ExperimentHistory';

const API_BASE_URL = 'http://localhost:5000/api';

const STAGES = {
  ASK: 'ASK',
  UNDERSTAND: 'UNDERSTAND',
  CLARIFY: 'CLARIFY',
  DEFINE: 'DEFINE',
  TEST: 'TEST',
  LEARN: 'LEARN'
};

function App() {
  const [stage, setStage] = useState(() => localStorage.getItem('app_stage') || STAGES.ASK);
  const [question, setQuestion] = useState(() => localStorage.getItem('app_question') || '');
  const [analysis, setAnalysis] = useState(() => JSON.parse(localStorage.getItem('app_analysis')) || null);
  const [experiment, setExperiment] = useState(() => JSON.parse(localStorage.getItem('app_experiment')) || null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(() => JSON.parse(localStorage.getItem('app_results')) || null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // Persist state to localStorage
  useEffect(() => { localStorage.setItem('app_stage', stage); }, [stage]);
  useEffect(() => { localStorage.setItem('app_question', question); }, [question]);
  useEffect(() => { 
    if (analysis) localStorage.setItem('app_analysis', JSON.stringify(analysis)); 
    else localStorage.removeItem('app_analysis');
  }, [analysis]);
  useEffect(() => { 
    if (experiment) localStorage.setItem('app_experiment', JSON.stringify(experiment));
    else localStorage.removeItem('app_experiment');
  }, [experiment]);
  useEffect(() => { 
    if (results) localStorage.setItem('app_results', JSON.stringify(results));
    else localStorage.removeItem('app_results');
  }, [results]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('experiments_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newExp, res) => {
    const entry = {
      id: newExp.id,
      date: new Date().toISOString(),
      question,
      instrument: newExp.instrument,
      status: 'completed',
      winRate: res.metrics.winRate
    };
    const newHistory = [entry, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('experiments_history', JSON.stringify(newHistory));
  };

  const handleAnalyze = async (q) => {
    setQuestion(q);
    setLoading(true);
    setError('');
    setStage(STAGES.UNDERSTAND);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/analyze`, { question: q });
      setAnalysis(res.data);
      if (res.data.missingInformation && res.data.missingInformation.length > 0) {
        setStage(STAGES.CLARIFY);
      } else {
        createExperiment(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze question. Is backend running?');
      setStage(STAGES.ASK);
    } finally {
      setLoading(false);
    }
  };

  const handleClarifySubmit = (clarifiedData) => {
    // Merge clarified info into analysis
    const updatedAnalysis = { ...analysis, ...clarifiedData, missingInformation: [] };
    createExperiment(updatedAnalysis);
  };

  const createExperiment = async (data) => {
    setLoading(true);
    setStage(STAGES.DEFINE);
    try {
      const res = await axios.post(`${API_BASE_URL}/experiment`, data);
      setExperiment(res.data);
    } catch (err) {
      setError('Failed to define experiment.');
      setStage(STAGES.ASK);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTest = async () => {
    setLoading(true);
    setStage(STAGES.TEST);
    try {
      const res = await axios.post(`${API_BASE_URL}/test`, { experiment });
      setResults(res.data);
      saveToHistory(experiment, res.data);
      setStage(STAGES.LEARN);
    } catch (err) {
      setError('Failed to run test.');
      setStage(STAGES.DEFINE);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStage(STAGES.ASK);
    setQuestion('');
    setAnalysis(null);
    setExperiment(null);
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen font-sans bg-slate-950 text-slate-100 selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Abstract Background Chart */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M-50 600 L100 550 L250 650 L400 450 L550 500 L700 300 L850 400 L1000 200 L1150 250 L1300 100 L1500 150" 
            stroke="url(#chart-gradient)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          />
          <path 
            d="M-50 600 L100 550 L250 650 L400 450 L550 500 L700 300 L850 400 L1000 200 L1150 250 L1300 100 L1500 150 L1500 850 L-50 850 Z" 
            fill="url(#chart-fill)" 
          />
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9" />
              <stop offset="0.5" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22d3ee" stopOpacity="0.15" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex items-center">
          <div className="flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer" onClick={reset}>
            <div className="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logo-cyan-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                <defs>
                  <linearGradient id="logo-cyan-blue" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
              AI Trading Research
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Main Hero Statement */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Turn a trading idea into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">structured experiment.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Test your hypothesis instantly. AI translates your words into backtestable logic.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12 overflow-x-auto py-2">
          {Object.values(STAGES).map((s, idx) => {
            const isActive = stage === s;
            const isPast = Object.keys(STAGES).indexOf(stage) > idx;
            
            // Logic for glowing arrow
            let arrowGlows = false;
            
            // 1. If currently loading the NEXT stage, the arrow pointing to it glows
            if (loading && stage === Object.values(STAGES)[idx + 1]) {
              arrowGlows = true;
            }
            
            // 2. If we are currently ON this stage and waiting for user to proceed
            if (!loading && isActive) {
              if (idx === 0 && question.trim().length > 0) {
                // ASK stage - user is typing
                arrowGlows = true;
              } else if (idx === 2 || idx === 3) {
                // CLARIFY or DEFINE stages - user needs to click submit/run
                arrowGlows = true;
              }
            }
            
            return (
              <React.Fragment key={s}>
                <div 
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                    isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-105' : 
                    isPast ? 'text-slate-300 bg-slate-800 border border-slate-700' : 'text-slate-600 bg-slate-900 border border-slate-800'
                  }`}
                >
                  {s}
                </div>
                {idx < Object.values(STAGES).length - 1 && (
                  <ArrowRight 
                    className={`w-4 h-4 mx-2 transition-all duration-500 ${
                      arrowGlows 
                        ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse scale-125' 
                        : isPast 
                          ? 'text-cyan-500/50' 
                          : 'text-slate-800'
                    }`} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
            {error}
          </div>
        )}

        {stage !== STAGES.LEARN ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {stage === STAGES.ASK && (
                <QuestionInput 
                  onAnalyze={handleAnalyze} 
                  loading={loading} 
                  onTextChange={(val) => setQuestion(val)} 
                />
              )}

              {stage === STAGES.UNDERSTAND && loading && (
                <div className="flex flex-col items-center justify-center p-16 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in duration-500">
                  <Loader className="w-12 h-12 text-cyan-400 animate-spin mb-6" />
                  <h3 className="text-xl font-bold text-slate-100">Understanding your research question...</h3>
                  <p className="text-slate-400 mt-3 font-medium">Extracting variables and identifying parameters</p>
                </div>
              )}

              {stage === STAGES.CLARIFY && analysis && (
                <ClarificationPanel 
                  analysis={analysis} 
                  onSubmit={handleClarifySubmit} 
                />
              )}

              {stage === STAGES.DEFINE && experiment && (
                <ExperimentCard 
                  experiment={experiment} 
                  onRun={handleRunTest} 
                  loading={loading} 
                />
              )}

              {stage === STAGES.TEST && loading && (
                <div className="flex flex-col items-center justify-center p-16 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in duration-500">
                  <Loader className="w-12 h-12 text-emerald-400 animate-spin mb-6" />
                  <h3 className="text-xl font-bold text-slate-100">Running Mock Simulation...</h3>
                  <p className="text-slate-400 mt-3 font-medium">Generating deterministic test results</p>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-28 h-full">
                <ExperimentHistory history={history} onSelect={(id) => console.log('load', id)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              <div className="md:col-span-2">
                <TestResultsData 
                  metrics={results.metrics} 
                  data={results.chartData.distribution.map(d => ({ name: d.bucket, occurrences: d.count, isPositive: parseFloat(d.bucket) > 0 }))} 
                />
              </div>
              <div className="md:col-span-1">
                <div className="h-full">
                  <ExperimentHistory history={history} onSelect={(id) => console.log('load', id)} />
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <TestResultsAI 
                aiInterpretation={results.aiInterpretation} 
                onReset={reset} 
              />
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}

export default App;
