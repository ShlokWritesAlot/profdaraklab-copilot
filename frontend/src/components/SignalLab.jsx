import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Play, BarChart2 } from 'lucide-react';

const SignalLab = () => {
  const [iqData, setIqData] = useState({ i: [], q: [] });
  const [fftData, setFftData] = useState({ spectrum: [], freqs: [] });
  const [loading, setLoading] = useState(false);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const iqRes = await axios.get('http://localhost:8000/signals/iq');
      setIqData(iqRes.data);
      
      const fftRes = await axios.post('http://localhost:8000/signals/fft', iqRes.data);
      setFftData(fftRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div className="p-8 space-y-8 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Signal Lab</h2>
          <p className="text-slate-400">Real-time IQ data analysis and FFT visualization.</p>
        </div>
        <button 
          onClick={fetchSignals}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* IQ Plot (Placeholder for real canvas/plotly) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64 flex flex-col">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Play size={18} className="text-green-500" />
            IQ Samples (Time Domain)
          </h3>
          <div className="flex-1 flex items-end gap-[2px]">
            {iqData.i.slice(0, 100).map((val, idx) => (
              <div 
                key={idx} 
                className="flex-1 bg-blue-500" 
                style={{ height: `${Math.abs(val) * 100}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* FFT Plot */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64 flex flex-col">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-purple-500" />
            FFT Spectrum (Frequency Domain)
          </h3>
          <div className="flex-1 flex items-end gap-[1px]">
            {fftData.spectrum.slice(0, 100).map((val, idx) => (
              <div 
                key={idx} 
                className="flex-1 bg-purple-500" 
                style={{ height: `${(val / Math.max(...fftData.spectrum)) * 100}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-6">OFDM Parameters</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-500">FFT Size</label>
            <input type="number" defaultValue={64} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-500">Cyclic Prefix</label>
            <input type="number" defaultValue={16} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-500">Subcarriers</label>
            <input type="number" defaultValue={52} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" />
          </div>
          <div className="space-y-2 flex items-end">
            <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg">Apply Config</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalLab;
