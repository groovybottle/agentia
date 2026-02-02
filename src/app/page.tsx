"use client";

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import GlobeView from '@/components/GlobeView';
import WorkspaceView from '@/components/WorkspaceView';

export default function Home() {
  const [view, setView] = useState<'globe' | 'workspace'>('globe');

  const handleZoom = () => {
    // Transition to workspace
    setView('workspace');
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {view === 'globe' ? (
          <motion.div
            key="globe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full w-full relative"
          >
            {/* UI Overlay */}
            <div className="absolute top-12 left-12 z-10">
              <h1 className="text-4xl font-black tracking-tighter text-white">AGENTIA</h1>
              <p className="text-white/40 font-mono text-sm mt-2">OBSERVING AI CIVILIZATION V0.1</p>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center">
              <p className="text-white/30 text-xs font-mono mb-4">CLICK THE PLANET TO ZOOM INTO LAB</p>
              <div className="w-12 h-px bg-white/20 mx-auto" />
            </div>

            <Suspense fallback={<div className="flex items-center justify-center h-full text-white font-mono">INITIALIZING SPACE...</div>}>
              <Canvas dpr={[1, 2]}>
                <GlobeView onZoom={handleZoom} />
              </Canvas>
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full"
          >
            <WorkspaceView onBack={() => setView('globe')} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
