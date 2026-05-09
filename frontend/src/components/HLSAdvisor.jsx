import React, { useState } from 'react';
import { Cpu, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import axios from 'axios';

const HLSAdvisor = () => {
  const [code, setCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [reportMetrics, setReportMetrics] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const analyzeCode = async () => {
    try {
      const res = await axios.post('http://localhost:8000/hls/analyze', { code });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
    }
  };

  const applyOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await axios.post('http://localhost:8000/hls/optimize', { code });
      setOptimizedCode(res.data.optimized);
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleReportUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/hls/parse-report', formData);
      setReportMetrics(res.data.metrics);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vitis HLS Assistant</h2>
          <p className="text-slate-400">Optimize C/C++ code for FPGA deployment.</p>
        </div>
        {code && (
          <button 
            onClick={applyOptimization}
            disabled={isOptimizing}
            className="bg-purple-600 hover:bg-purple-500 text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg shadow-purple-900/20"
          >
            <Zap size={18} className={isOptimizing ? 'animate-pulse' : ''} />
            {isOptimizing ? 'Generating Optimized Design...' : 'Auto-Optimize Design'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Original HLS Source</span>
                <button 
                  onClick={analyzeCode}
                  className="bg-blue-600 hover:bg-blue-500 text-[10px] px-2 py-1 rounded transition-colors"
                >
                  Analyze
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="#pragma HLS PIPELINE..."
                className="w-full h-80 bg-slate-950 p-6 font-mono text-sm focus:outline-none resize-none"
              ></textarea>
            </div>

            {/* Optimized Code */}
            <div className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${optimizedCode ? 'border-purple-500/50 opacity-100' : 'border-slate-800 opacity-50'}`}>
              <div className="bg-purple-900/20 px-6 py-3 border-b border-purple-500/20 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Optimized Design (AI Generated)</span>
                {optimizedCode && (
                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </div>
              {optimizedCode ? (
                <textarea
                  readOnly
                  value={optimizedCode}
                  className="w-full h-80 bg-slate-950 p-6 font-mono text-sm focus:outline-none resize-none text-purple-200"
                ></textarea>
              ) : (
                <div className="w-full h-80 bg-slate-950 flex flex-col items-center justify-center text-slate-600 p-10 text-center">
                  <Cpu size={48} className="mb-4 opacity-20" />
                  <p className="text-sm italic">Click "Auto-Optimize" to generate a parallel, fixed-point version of your design.</p>
                </div>
              )}
            </div>
          </div>

          {explanation && (
            <div className="bg-purple-600/10 border border-purple-600/30 rounded-2xl p-6">
              <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Optimization Rationale
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">Optimization Suggestions</h3>
            {suggestions.length === 0 ? (
              <div className="p-8 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500">
                Paste code and click Analyze to see suggestions.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 hover:border-blue-500/50 transition-colors">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-400">{s.type}</h4>
                      <p className="text-sm text-slate-300">{s.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Cpu size={18} className="text-blue-500" />
              Synthesis Report
            </h3>
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:bg-slate-800/50 transition-colors">
                <p className="text-sm text-slate-400">Upload .rpt file</p>
                <input type="file" className="hidden" onChange={handleReportUpload} />
              </div>
            </label>

            {reportMetrics && (
              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Latency (Max)</span>
                  <span className="font-mono text-blue-400">{reportMetrics.latency_max || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">DSP Usage</span>
                  <span className="font-mono text-purple-400">{reportMetrics.dsp || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">LUT Usage</span>
                  <span className="font-mono text-orange-400">{reportMetrics.lut || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HLSAdvisor;
