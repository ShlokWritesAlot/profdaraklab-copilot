import React, { useState } from 'react';
import { 
  MessageSquare, 
  Database, 
  Activity, 
  Cpu, 
  FileText, 
  Settings, 
  Layers, 
  Terminal,
  ChevronRight,
  Send,
  Upload,
  Plus
} from 'lucide-react';
import ChatView from './components/ChatView';
import SignalLab from './components/SignalLab';
import HLSAdvisor from './components/HLSAdvisor';
import ExperimentTracker from './components/ExperimentTracker';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your DarakLab Copilot. How can I assist with your FPGA or Signal Processing research today?" }
  ]);

  const navItems = [
    { id: 'chat', name: 'AI Chat', icon: <MessageSquare size={20} /> },
    { id: 'knowledge', name: 'Knowledge Base', icon: <Database size={20} /> },
    { id: 'hls', name: 'HLS Assistant', icon: <Cpu size={20} /> },
    { id: 'signals', name: 'Signal Lab', icon: <Activity size={20} /> },
    { id: 'experiments', name: 'Experiments', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">D</div>
          <h1 className="font-bold text-xl tracking-tight">DarakLab</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Ollama: llama3.1 Connected</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === 'chat' && (
          <ChatView 
            messages={chatMessages} 
            setMessages={setChatMessages} 
          />
        )}
        {activeTab === 'signals' && <SignalLab />}
        {activeTab === 'hls' && <HLSAdvisor />}
        {activeTab === 'experiments' && <ExperimentTracker />}
        
        {activeTab === 'knowledge' && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Knowledge Base</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="card-gradient p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Upload size={24} />
                </div>
                <h3 className="text-lg font-semibold">Upload Research</h3>
                <p className="text-sm text-slate-400">Add PDFs, papers, or lab notes to the local vector DB.</p>
                <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">Select Files</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
