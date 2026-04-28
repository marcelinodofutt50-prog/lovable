import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Ultra High quality Earth Night texture for that professional OSINT look
  const texture = useLoader(THREE.TextureLoader, "https://unpkg.com/three-globe/example/img/earth-night.jpg");
  const bumpMap = useLoader(THREE.TextureLoader, "https://unpkg.com/three-globe/example/img/earth-topology.png");
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Core Globe with Night Texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.8, 128, 128]} />
        <meshStandardMaterial 
          map={texture}
          bumpMap={bumpMap}
          bumpScale={0.05}
          emissive="#4ade80"
          emissiveIntensity={0.2}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* OSINT Grid Shell */}
      <mesh>
        <sphereGeometry args={[2.82, 64, 64]} />
        <meshBasicMaterial 
          wireframe 
          color="#4ade80" 
          transparent 
          opacity={0.05} 
        />
      </mesh>

      {/* Outer Atmosphere / Shield */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshPhongMaterial 
          transparent 
          opacity={0.05} 
          color="#4ade80" 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Cloud/Data layer */}
      <mesh rotation={[0, 1, 0]}>
        <sphereGeometry args={[2.88, 64, 64]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.03}
          alphaTest={0.5}
        />
      </mesh>
    </group>

  );
}

function SatelliteLink({ lat, lng, active, color = "#4ade80" }: { lat: number, lng: number, active: boolean, color?: string }) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const radius = 2.85;
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={active ? color : "#112211"} transparent opacity={active ? 1 : 0.2} />
      </mesh>
      {active && (
        <>
          <mesh scale={[4, 4, 4]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
          </mesh>
          <pointLight color={color} intensity={0.1} distance={1} />
        </>
      )}
    </group>
  );
}


export function WorldMap3D() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const satelliteNodes = useMemo(() => 
    Array.from({ length: 40 }).map(() => ({
      lat: (Math.random() - 0.5) * 160,
      lng: (Math.random() - 0.5) * 360,
      active: Math.random() > 0.4,
      color: Math.random() > 0.8 ? "#ff4444" : "#4ade80"
    })), []);


  if (!mounted) return <div className="w-full h-full bg-black/20 animate-pulse" />;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing">
      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Global_Surveillance</span>
            </div>
            <div className="text-[8px] text-white/30 tracking-tight">ENCRYPTED_STREAM_ID: 0x82A..FF1</div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-[9px] text-primary/60 font-mono tracking-widest uppercase">Orbit_Status: Active</div>
            <div className="text-[7px] text-white/20 font-mono">NODES_CONNECTED: {satelliteNodes.filter(n => n.active).length}</div>
          </div>
        </div>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 7.5], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff41" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#004111" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          autoRotate={false}
          minDistance={5}
          maxDistance={12}
          rotateSpeed={0.5}
        />

        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
          <Globe />
          {satelliteNodes.map((node, i) => (
            <SatelliteLink key={i} lat={node.lat} lng={node.lng} active={node.active} color={node.color} />
          ))}

        </Float>
      </Canvas>
    </div>
  );
}

