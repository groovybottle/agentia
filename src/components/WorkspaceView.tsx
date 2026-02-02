"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Box, Circle, Type, Share2, ZoomIn, ZoomOut, Terminal, Activity, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Element {
  id: string;
  type: 'box' | 'circle' | 'text' | 'line';
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  agent: string;
  color: string;
  timestamp: number;
}

interface LogEntry {
  id: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

export default function WorkspaceView({ onBack }: { onBack: () => void }) {
  const [elements, setElements] = useState<Element[]>([
    { id: '1', type: 'box', x: 300, y: 200, w: 160, h: 100, label: 'User_Auth_API', agent: 'Dolsoe', color: '#4040ff', timestamp: Date.now() },
    { id: '2', type: 'circle', x: 600, y: 400, label: 'DB_Cluster', agent: 'GPT-4o', color: '#00ffff', timestamp: Date.now() },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'l1', agent: 'SYSTEM', message: 'Agentia Workspace Initialized.', type: 'info', timestamp: '03:15:02' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation Logic
  useEffect(() => {
    const agents = ['Dolsoe', 'GPT-4o', 'Agent_X'];
    const colors: Record<string, string> = { 'Dolsoe': '#4040ff', 'GPT-4o': '#00ffff', 'Agent_X': '#ff40ff' };
    
    const interval = setInterval(() => {
      const activeAgent = agents[Math.floor(Math.random() * agents.length)];
      
      // Randomly move existing or add new element
      if (Math.random() > 0.7) {
        const newEl: Element = {
          id: Math.random().toString(36).substr(2, 9),
          type: Math.random() > 0.5 ? 'box' : 'circle',
          x: 200 + Math.random() * 600,
          y: 100 + Math.random() * 400,
          w: 120 + Math.random() * 40,
          h: 80 + Math.random() * 20,
          label: `Node_${Math.floor(Math.random() * 999)}`,
          agent: activeAgent,
          color: colors[activeAgent],
          timestamp: Date.now()
        };
        
        setElements(prev => [...prev.slice(-15), newEl]);
        addLog(activeAgent, `Created new node: ${newEl.label}`, 'success');
      } else {
        setElements(prev => prev.map(el => {
          if (el.agent === activeAgent) {
            return { ...el, x: el.x + (Math.random() - 0.5) * 5, y: el.y + (Math.random() - 0.5) * 5 };
          }
          return el;
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addLog = (agent: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      agent,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }).split(' ')[0]
    };
    setLogs(prev => [...prev.slice(-20), newLog]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 bg-[#050508] flex flex-col text-white font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group flex items-center gap-2 text-white/40 hover:text-white transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> 
            <span className="text-xs font-mono tracking-widest uppercase">Planet_View</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex flex-col">
            <h1 className="font-black text-sm tracking-widest uppercase flex items-center gap-2">
              <Zap size={14} className="text-cyan-400 fill-cyan-400" />
              Agentia Workspace
            </h1>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">Instance: Core_Main_01</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <ToolBtn icon={<MousePointer2 size={16} />} active />
          <ToolBtn icon={<Box size={16} />} />
          <ToolBtn icon={<Circle size={16} />} />
          <ToolBtn icon={<Type size={16} />} />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live_Sync</span>
          </div>
          <div className="flex -space-x-2">
            <UserAvatar color="bg-blue-600" name="D" />
            <UserAvatar color="bg-cyan-600" name="G" />
            <UserAvatar color="bg-purple-600" name="X" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Activity Logs */}
        <aside className="w-80 border-r border-white/5 bg-black/20 backdrop-blur-sm flex flex-col z-10">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 text-white/50">
            <Terminal size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Activity_Log</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px] scrollbar-hide">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-1 border-l border-white/10 pl-3 py-1"
                >
                  <div className="flex items-center justify-between opacity-40">
                    <span className="font-bold">{log.agent}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className={`${log.type === 'success' ? 'text-cyan-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-white/80'}`}>
                    {log.message}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-[radial-gradient(#1a1a2e_1px,transparent_1px)] [background-size:40px_40px]">
          {/* Elements */}
          <AnimatePresence>
            {elements.map((el) => (
              <motion.div
                key={el.id}
                layoutId={el.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, x: el.x, y: el.y }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute p-4 rounded-xl border-2 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] group"
                style={{ 
                  borderColor: el.color,
                  backgroundColor: `${el.color}08`,
                  width: el.w,
                  height: el.h,
                  borderRadius: el.type === 'circle' ? '999px' : '16px'
                }}
              >
                {/* 2.5D Depth Highlight */}
                <div className="absolute -top-1 -left-1 w-full h-full rounded-[inherit] border border-white/10 pointer-events-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[9px] font-black uppercase tracking-tighter" style={{ color: el.color }}>{el.agent}</div>
                  <Activity size={10} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="font-bold text-sm tracking-tight">{el.label}</div>
                
                {/* Visual Connection Anchor Points */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/20 bg-black" />
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/20 bg-black" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Canvas UI Overlay */}
          <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Compute_Load</div>
                <div className="text-sm font-mono font-bold text-white">42.8 TFLOPS</div>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-2">
              <AgentDot color="bg-blue-500" name="Dolsoe" active />
              <AgentDot color="bg-cyan-500" name="GPT-4o" active />
              <AgentDot color="bg-purple-500" name="Agent_X" />
            </div>
          </div>
        </main>

        {/* Right Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
          <ControlBtn icon={<ZoomIn size={18} />} />
          <ControlBtn icon={<ZoomOut size={18} />} />
          <div className="h-px w-8 bg-white/10 mx-auto" />
          <ControlBtn icon={<Share2 size={18} />} />
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={`p-2.5 rounded-lg transition-all ${active ? 'bg-white/10 text-white shadow-inner' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
      {icon}
    </button>
  );
}

function UserAvatar({ color, name }: { color: string, name: string }) {
  return (
    <div className={`w-8 h-8 rounded-full border-2 border-black ${color} flex items-center justify-center text-[10px] font-black shadow-lg`}>
      {name}
    </div>
  );
}

function AgentDot({ color, name, active = false }: { color: string, name: string, active?: boolean }) {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className={`w-2 h-2 rounded-full ${color} ${active ? 'shadow-[0_0_10px_currentColor]' : 'opacity-30'}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${active ? 'text-white' : 'text-white/20 group-hover:text-white/40'}`}>
        {name}
      </span>
    </div>
  );
}

function ControlBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-12 h-12 bg-black/60 border border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-black/80 transition-all shadow-2xl">
      {icon}
    </button>
  );
}
