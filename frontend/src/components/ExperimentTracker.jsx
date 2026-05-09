import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Calendar } from 'lucide-react';
import axios from 'axios';

const ExperimentTracker = () => {
  const [experiments, setExperiments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newExp, setNewExp] = useState({
    title: '',
    objective: '',
    hardware: 'RFSoC 4x2',
    result: '',
    conclusions: ''
  });

  const fetchExperiments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/experiments');
      setExperiments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/experiments', newExp);
      setNewExp({
        title: '',
        objective: '',
        hardware: 'RFSoC 4x2',
        result: '',
        conclusions: ''
      });
      setShowForm(false);
      fetchExperiments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  return (
    <div className="p-8 space-y-8 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Experiment Logger</h2>
          <p className="text-slate-400">Track your FPGA synthesis and signal processing runs.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Log New Experiment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Experiment Title</label>
              <input 
                value={newExp.title}
                onChange={e => setNewExp({...newExp, title: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" 
                placeholder="LS Channel Estimation on Zynq"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Hardware Platform</label>
              <select 
                value={newExp.hardware}
                onChange={e => setNewExp({...newExp, hardware: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2"
              >
                <option>RFSoC 4x2</option>
                <option>ZCU111</option>
                <option>PYNQ-Z2</option>
                <option>Vitis HLS Simulator</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-500">Objective</label>
            <textarea 
              value={newExp.objective}
              onChange={e => setNewExp({...newExp, objective: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 h-24"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg">Save Experiment</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {experiments.length === 0 ? (
          <div className="text-center py-20 text-slate-500 italic">No experiments logged yet.</div>
        ) : (
          experiments.map((exp) => (
            <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> 
                        {new Date(exp.created_at.replace(' ', 'T')).toLocaleDateString()}
                      </span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{exp.hardware}</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-white">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperimentTracker;
