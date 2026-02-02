"use client";

import { motion } from 'framer-motion';
import { MousePointer2, Box, Circle, Type, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Element {
  id: string;
  type: 'box' | 'circle' | 'text';
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  agent?: string;
  color: string;
}

export default function WorkspaceView({ onBack }: { onBack: () => void }) {
  const [elements, setElements] = useState<Element[]>([
    { id: '1', type: 'box', x: 200, y: 150, w: 120, h: 80, label: 'Agentia Core', agent: 'Dolsoe', color: '#4040ff' },
    { id: '2', type: 'circle', x: 500, y: 300, label: 'Logic Node', agent: 'GPT-4o', color: '#00ffff' },
  ]);

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setElements(prev => prev.map(el => {
        if (el.agent === 'Dolsoe') {
          return { ...el, x: el.x + (Math.random() - 0.5) * 2, y: el.y + (Math.random() - 0.5) * 2 };
        }
        return el;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col">
      {/* Header / Toolbar */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
            &larr; Back to Planet
          </button>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="font-bold text-lg tracking-tight">ClawBoard / <span className="text-cyan-400">Main_Lab</span></h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
          <ToolBtn icon={<MousePointer2 size={18} />} active />
          <ToolBtn icon={<Box size={18} />} />
          <ToolBtn icon={<Circle size={18} />} />
          <ToolBtn icon={<Type size={18} />} />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <UserAvatar color="bg-blue-500" name="D" />
            <UserAvatar color="bg-cyan-500" name="G" />
          </div>
          <button className="bg-white text-black px-4 py-1.5 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
            Share
          </button>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 relative overflow-hidden cursor-crosshair">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />

        {/* Elements */}
        {elements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x: el.x, y: el.y }}
            className="absolute p-4 rounded-xl border-2 backdrop-blur-sm shadow-2xl"
            style={{ 
              borderColor: el.color,
              backgroundColor: `${el.color}10`,
              width: el.w,
              height: el.h,
              borderRadius: el.type === 'circle' ? '999px' : '12px'
            }}
          >
            <div className="text-xs font-mono uppercase opacity-50 mb-1">{el.agent}</div>
            <div className="font-bold">{el.label}</div>
            
            {/* 2.5D Depth Effect (Subtle Shadow) */}
            <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 bg-black/20 blur-md rounded-xl" />
          </motion.div>
        ))}

        {/* Floating Agent Status */}
        <div className="absolute bottom-8 left-8 flex flex-col gap-2">
          <AgentStatus name="Dolsoe" status="Thinking..." active />
          <AgentStatus name="GPT-4o" status="Refactoring UI..." />
        </div>
      </main>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <ControlBtn icon={<ZoomIn size={20} />} />
        <ControlBtn icon={<ZoomOut size={20} />} />
        <ControlBtn icon={<Share2 size={20} />} />
      </div>
    </div>
  );
}

function ToolBtn({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={`p-2 rounded-md transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
      {icon}
    </button>
  );
}

function UserAvatar({ color, name }: { color: string, name: string }) {
  return (
    <div className={`w-8 h-8 rounded-full border-2 border-black ${color} flex items-center justify-center text-[10px] font-bold`}>
      {name}
    </div>
  );
}

function AgentStatus({ name, status, active = false }: { name: string, status: string, active?: boolean }) {
  return (
    <div className="bg-black/80 border border-white/10 backdrop-blur-lg rounded-lg p-3 flex items-center gap-3 min-w-[200px]">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
      <div>
        <div className="text-xs font-bold text-white/50 uppercase tracking-widest">{name}</div>
        <div className="text-sm text-white">{status}</div>
      </div>
    </div>
  );
}

function ControlBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-12 h-12 bg-black/80 border border-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all">
      {icon}
    </button>
  );
}
