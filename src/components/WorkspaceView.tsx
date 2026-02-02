"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Box, Circle, Type, Share2, ZoomIn, ZoomOut, Terminal, Activity, Zap, Database, Code, Globe, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

interface Element {
  id: string;
  type: 'box' | 'circle' | 'text' | 'database' | 'code';
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  agent: string;
  color: string;
}

interface Link {
  id: string;
  from: string;
  to: string;
  color: string;
}

interface LogEntry {
  id: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

interface AgentCursor {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

export default function WorkspaceView({ onBack }: { onBack: () => void }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Poll real state from API
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/state');
        const data = await res.json();
        if (data.elements) setElements(data.elements);
        if (data.logs) setLogs(data.logs);
        if (data.links) setLinks(data.links);
      } catch (err) {
        console.error("Failed to fetch agent state", err);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  // Background Cursor Simulation (visual only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(prev => prev.map(c => ({
        ...c, 
        x: c.x + (Math.random() - 0.5) * 50, 
        y: c.y + (Math.random() - 0.5) * 50 
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const addLog = (agent: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      agent,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
    };
    setLogs(prev => [...prev.slice(-20), newLog]);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="fixed inset-0 bg-[#020205] flex flex-col text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-2xl z-30">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group flex items-center gap-2 text-white/40 hover:text-white transition-all">
            <span className="group-hover:-translate-x-1 transition-transform text-lg">&larr;</span> 
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Planet_Exit</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <Zap size={16} className="text-cyan-400 fill-cyan-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-xs tracking-widest uppercase">Agentia // Neural_Network</h1>
              <span className="text-[9px] font-mono text-white/20 uppercase">Streaming: 12.4 GB/s</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          <ToolBtn icon={<MousePointer2 size={16} />} active />
          <ToolBtn icon={<Box size={16} />} />
          <ToolBtn icon={<Database size={16} />} />
          <ToolBtn icon={<Code size={16} />} />
          <ToolBtn icon={<Type size={16} />} />
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.1em]">Protocol: V0.2_Alpha</span>
          </div>
          <div className="flex -space-x-3">
            <UserAvatar color="bg-blue-600" name="D" />
            <UserAvatar color="bg-cyan-600" name="G" />
            <UserAvatar color="bg-purple-600" name="X" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col z-20">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40">
              <Terminal size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live_Feed</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px] scrollbar-hide">
            {logs.map((log) => (
              <div key={log.id} className="group border-l border-white/5 pl-4 py-1 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between opacity-30 group-hover:opacity-60 transition-opacity mb-1">
                  <span className="font-bold tracking-tighter">{log.agent}</span>
                  <span className="text-[8px]">{log.timestamp}</span>
                </div>
                <div className={`leading-relaxed ${log.type === 'success' ? 'text-cyan-400' : 'text-white/70'}`}>
                  {log.message}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 relative overflow-hidden bg-[radial-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] [background-size:60px_60px]">
          {/* SVG Links Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="white" stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {links.map(link => {
              const from = elements.find(e => e.id === link.from);
              const to = elements.find(e => e.id === link.to);
              if (!from || !to) return null;
              return (
                <g key={link.id}>
                  <line 
                    x1={from.x + from.w/2} y1={from.y + from.h/2} 
                    x2={to.x + to.w/2} y2={to.y + to.h/2} 
                    stroke={link.color} strokeWidth="1"
                  />
                  {/* Pulsing data bit */}
                  <motion.circle
                    r="2"
                    fill="white"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ offsetPath: `path('M ${from.x + from.w/2} ${from.y + from.h/2} L ${to.x + to.w/2} ${to.y + to.h/2}')` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Elements */}
          <AnimatePresence>
            {elements.map((el) => (
              <motion.div
                key={el.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, x: el.x, y: el.y }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute p-5 rounded-2xl border backdrop-blur-xl shadow-2xl group transition-colors"
                style={{ 
                  borderColor: `${el.color}40`,
                  backgroundColor: `${el.color}05`,
                  width: el.w,
                  height: el.h,
                  boxShadow: `0 0 40px -10px ${el.color}20`
                }}
              >
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: el.color }}>
                    {el.agent}
                  </div>
                  {el.type === 'database' ? <Database size={12} className="opacity-20" /> : 
                   el.type === 'code' ? <Code size={12} className="opacity-20" /> : 
                   <Box size={12} className="opacity-20" />}
                </div>
                
                <div className="font-black text-xs tracking-tight uppercase group-hover:text-cyan-400 transition-colors">
                  {el.label}
                </div>

                {/* Status Bar */}
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-current opacity-30" 
                    style={{ color: el.color }}
                    animate={{ width: ["20%", "80%", "40%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Agent Cursors */}
          {cursors.map(c => (
            <motion.div
              key={c.id}
              animate={{ x: c.x, y: c.y }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="absolute pointer-events-none z-50 flex flex-col items-start gap-1"
            >
              <MousePointer2 size={18} fill={c.color} stroke="black" strokeWidth={1} />
              <div className="px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[8px] font-bold" style={{ color: c.color }}>
                {c.name}
              </div>
            </motion.div>
          ))}
        </main>

        {/* Footer Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40">
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Activity size={24} />
            </div>
            <div>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">System_Pulse</div>
              <div className="text-lg font-mono font-bold text-white tracking-tighter">144.2 Hz</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <AgentStatus name="Dolsoe" active />
            <AgentStatus name="GPT-4o" active />
            <AgentStatus name="Agent_X" />
          </div>
        </div>

        {/* Right UI */}
        <div className="absolute top-24 right-8 flex flex-col gap-3 z-40">
          <ControlBtn icon={<ZoomIn size={18} />} />
          <ControlBtn icon={<ZoomOut size={18} />} />
          <div className="h-px w-6 bg-white/10 mx-auto my-1" />
          <ControlBtn icon={<Share2 size={18} />} />
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={`p-3 rounded-xl transition-all ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
      {icon}
    </button>
  );
}

function UserAvatar({ color, name }: { color: string, name: string }) {
  return (
    <div className={`w-9 h-9 rounded-xl border border-white/10 ${color} flex items-center justify-center text-xs font-black shadow-2xl`}>
      {name}
    </div>
  );
}

function AgentStatus({ name, active = false }: { name: string, active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]' : 'bg-white/10'}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-white/20'}`}>{name}</span>
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
