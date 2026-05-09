import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Paperclip } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatView = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your DarakLab Copilot. How can I assist with your FPGA or Signal Processing research today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        messages: [...messages, userMessage]
      });
      
      const assistantMessage = response.data.message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not reach the local backend. Ensure FastAPI is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-900 border border-slate-800'
            }`}>
              <ReactMarkdown 
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 italic text-slate-400">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about HLS pragmas, OFDM channel estimation..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <div className="absolute right-3 top-3 flex gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-300">
              <Paperclip size={20} />
            </button>
            <button 
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
