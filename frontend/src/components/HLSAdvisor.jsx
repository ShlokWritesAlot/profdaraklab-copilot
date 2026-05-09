import React, { useState } from 'react';
import { Cpu, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import axios from 'axios';

const HLSAdvisor = () => {
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [reportMetrics, setReportMetrics] = useState(null);

  const analyzeCode = async () => {
    try {
      const res = await axios.post('http://localhost:8000/hls/analyze', { code });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
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
      <div>
        <h2 className="text-2xl font-bold">Vitis HLS Assistant</h2>
        <p className="text-slate-400">Optimize C/C++ code for FPGA deployment.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-sm font-medium">HLS Source Code</span>
              <button 
                onClick={analyzeCode}
                className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Zap size={14} />
                Analyze
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="#pragma HLS PIPELINE..."
              className="w-full h-80 bg-slate-950 p-6 font-mono text-sm focus:outline-none"
            ></textarea>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Optimization Suggestions</h3>
            {suggestions.length === 0 ? (
              <div className="p-8 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500">
                Paste code and click Analyze to see suggestions.
              </div>
            ) : (
              suggestions.map((s, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-400">{s.type}</h4>
                    <p className="text-sm text-slate-300">{s.message}</p>
                    {s.impact && <p className="text-xs text-slate-500 mt-1 italic">Impact: {s.impact}</p>}
                  </div>
                </div>
              ))
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
