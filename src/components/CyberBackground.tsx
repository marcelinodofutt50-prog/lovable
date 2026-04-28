import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Points, PointMaterial, Stars, Float, Text } from "@react-three/drei";

// Constantes para otimização
const STREAM_COUNT = 30; // Reduzido para performance
const SHAPE_COUNT = 10;
const PARTICLE_COUNT = 1500;

function Grid({ color = "#00ff41", secondary = "#003311", speed = 1 }) {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * speed * 0.5) % 2;
    }
  });

  return (
    <group ref={gridRef}>
      <gridHelper args={[100, 50, color, secondary]} rotation={[Math.PI / 2, 0, 0]} position={[0, -4, 0]} />
      <gridHelper args={[100, 50, color, secondary]} rotation={[Math.PI / 2, 0, 0]} position={[0, 12, 0]} />
    </group>
  );
}

function FloatingShapes({ color = "#ff0000" }) {
  const shapes = useMemo(() => {
    return Array.from({ length: SHAPE_COUNT }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.3 + Math.random() * 0.7,
      speed: 0.1 + Math.random() * 0.4,
      type: Math.floor(Math.random() * 3)
    }));
  }, []);

  return (
    <group>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={2} floatIntensity={1}>
          <mesh position={shape.position} rotation={shape.rotation} scale={shape.scale}>
            {shape.type === 0 && <boxGeometry args={[1, 1, 1]} />}
            {shape.type === 1 && <octahedronGeometry args={[1]} />}
            {shape.type === 2 && <torusGeometry args={[0.7, 0.2, 12, 48]} />}
            <meshStandardMaterial 
              color={color} 
              wireframe 
              transparent 
              opacity={0.15}
              emissive={color}
              emissiveIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function DataStream({ color = "#00ff41" }) {
  const streams = useMemo(() => {
    return Array.from({ length: STREAM_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 60,
      y: 25,
      z: (Math.random() - 0.5) * 30,
      speed: 0.3 + Math.random() * 1.2,
      chars: Math.random().toString(36).substring(2, 10).toUpperCase()
    }));
  }, []);

  return (
    <group>
      {streams.map((stream, i) => (
        <StreamLine key={i} {...stream} color={color} />
      ))}
    </group>
  );
}

function StreamLine({ x, y: initialY, z, speed, chars, color }: any) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y -= speed;
      if (ref.current.position.y < -25) {
        ref.current.position.y = 25;
      }
    }
  });

  return (
    <group ref={ref} position={[x, initialY, z]}>
      {chars.split('').map((char: string, j: number) => (
        <Text
          key={j}
          position={[0, -j * 1.5, 0]}
          fontSize={0.8}
          color={color}
          fillOpacity={Math.max(0, 1 - (j / chars.length) - 0.2)}
          font="https://fonts.gstatic.com/s/robotomono/v12/L0tkDFI8S0CD15ZOCDGp-8nWxN23.woff"
        >
          {char}
        </Text>
      ))}
    </group>
  );
}

function Particles({ count = 1000, color = "#00ff41", speed = 1 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = (Math.random() - 0.5) * 100;
      p[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03 * speed;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01 * speed;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

export function CyberBackground({ type = "fsociety-mask", loadingProgress = 100 }: { type?: string, loadingProgress?: number }) {
  const config = useMemo(() => {
    const safeType = type || "fsociety-mask";
    
    // Hacker Category
    if (safeType.startsWith("hacker-") || ["fsociety-mask", "mr-robot", "system-root", "dark-web", "joker-hacker"].includes(safeType)) {
      const hue = safeType === "fsociety-mask" ? 0 : Math.random() * 30;
      return { 
        color: safeType === "fsociety-mask" ? "#ff0000" : `hsl(${hue}, 100%, 50%)`, 
        secondary: "#110000", particles: true, stars: true, speed: 0.6 + Math.random() * 0.4, shapes: true, data: true 
      };
    }
    
    // Cyber Category
    if (safeType.startsWith("cyber-") || ["cyberpunk", "matrix-v2", "neon-joker", "blood-dark", "red-blue", "blue-black", "dark-blue-black", "red-blue-black"].includes(safeType)) {
      let color = "#00ffff";
      let secondary = "#001111";
      
      if (safeType === "red-blue") { color = "#ff0000"; secondary = "#0000ff"; }
      else if (safeType === "blue-black") { color = "#0000ff"; secondary = "#000000"; }
      else if (safeType === "dark-blue-black") { color = "#000033"; secondary = "#000000"; }
      else if (safeType === "red-blue-black") { color = "#ff0000"; secondary = "#0000ff"; }
      else if (safeType === "cyberpunk") { color = "#f3f315"; secondary = "#330033"; }
      else {
        const h = 180 + Math.random() * 100;
        color = `hsl(${h}, 100%, 50%)`;
      }

      return { color, secondary, particles: true, stars: true, speed: 1.2 + Math.random() * 0.8, shapes: true, data: true };
    }

    // OSINT Category
    if (safeType.startsWith("osint-") || ["phantom-white", "midnight-cyan", "osint-world"].includes(safeType)) {
      return { 
        color: safeType === "phantom-white" ? "#ffffff" : "#00ffcc", 
        secondary: "#050505", particles: true, stars: true, speed: 0.4, shapes: true, data: false 
      };
    }

    // Retro Category
    if (safeType.startsWith("retro-") || ["kali", "shadow-runner", "ghost-protocol"].includes(safeType)) {
      return { color: "#00ff41", secondary: "#001100", particles: true, stars: false, speed: 1.5, shapes: false, data: true };
    }

    // Default Fallback
    return { color: "#00ff41", secondary: "#002211", particles: true, stars: false, speed: 1, shapes: true, data: true };
  }, [type, loadingProgress]);

  const intensity = loadingProgress / 100;

  return (
    <div className="fixed inset-0 -z-10 bg-[#000]">
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000" 
        style={{ opacity: 0.2 + (intensity * 0.4) }}
      >
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 60 }} 
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.2 + (intensity * 0.3)} />
          <pointLight position={[20, 20, 20]} intensity={intensity * 2} color={config.color} />
          <pointLight position={[-20, -20, -20]} intensity={intensity} color={config.secondary} />
          
          {config.stars && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={intensity} />}
          
          {config.data && intensity > 0.1 && <DataStream color={config.color} />}
          
          <Grid color={config.color} secondary={config.secondary} speed={config.speed * intensity} />
          
          {config.shapes && intensity > 0.2 && <FloatingShapes color={config.color} />}
          
          {config.particles && <Particles count={Math.floor(PARTICLE_COUNT * intensity)} color={config.color} speed={config.speed * intensity} />}
        </Canvas>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none opacity-40 z-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-30 bg-scanline-gradient animate-scanline opacity-[0.03]" />
    </div>
  );
}
