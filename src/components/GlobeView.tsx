"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeViewProps {
  onZoom: () => void;
}

export default function GlobeView({ onZoom }: GlobeViewProps) {
  const globeRef = useRef<THREE.Mesh>(null);
  
  // Create random points on the sphere to represent "Agent Cities"
  const agentCities = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const phi = Math.acos(-1 + (2 * i) / 50);
      const theta = Math.sqrt(50 * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi) * 2.05;
      const y = Math.sin(theta) * Math.sin(phi) * 2.05;
      const z = Math.cos(phi) * 2.05;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={globeRef as any}>
          {/* The main planet */}
          <Sphere args={[2, 64, 64]} onClick={onZoom}>
            <MeshDistortMaterial
              color="#101020"
              roughness={0.1}
              metalness={0.8}
              distort={0.2}
              speed={2}
            />
          </Sphere>
          
          {/* Wireframe overlay for a "Grid" feel */}
          <Sphere args={[2.01, 32, 32]}>
            <meshBasicMaterial wireframe color="#4040ff" opacity={0.1} transparent />
          </Sphere>

          {/* Agent Cities */}
          {agentCities.map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
              <pointLight distance={0.5} intensity={0.5} color="#00ffff" />
            </mesh>
          ))}
        </group>
      </Float>
    </>
  );
}
