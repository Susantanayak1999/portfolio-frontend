import { useEffect, useState, useRef, Suspense } from 'react';
import client from './api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Icosahedron, Box, Torus, Sphere } from '@react-three/drei';
import gsap from 'gsap';

// --- 0. The 3D Tech Badge Component ---
function TechBadge({ label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotateX: 15, rotateY: -15, z: 20, boxShadow: "0 10px 20px rgba(6, 182, 212, 0.4)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-cyan-900/40 rounded-lg blur-sm transform translate-y-1 translate-x-1"></div>
      <div className="relative z-10 px-3 py-1.5 bg-[#12121a] border-t border-l border-white/20 border-b border-r border-black rounded-lg flex items-center justify-center">
        <span className="text-xs font-bold text-cyan-300 tracking-wider font-mono">{label}</span>
      </div>
    </motion.div>
  );
}

// --- 1. The Ultimate 3D Developer Core (Hero) ---
function DeveloperCore() {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    coreRef.current.rotation.y = t * 0.2;
    coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    ring1Ref.current.rotation.y = -t * 0.3;
    ring1Ref.current.rotation.x = t * 0.1;
    ring2Ref.current.rotation.z = t * 0.4;
    ring2Ref.current.rotation.y = t * 0.1;
    coreRef.current.position.x = state.pointer.x * 0.4;
    coreRef.current.position.y = state.pointer.y * 0.4;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={coreRef} scale={0.8}>
        <Icosahedron args={[1.5, 1]}>
          <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.3} emissive="#06b6d4" emissiveIntensity={0.2} />
        </Icosahedron>
        <Icosahedron args={[0.8, 0]}>
          <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
        </Icosahedron>
      </group>
      <group ref={ring1Ref} scale={0.8}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      </group>
      <group ref={ring2Ref} scale={0.8}>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.6, 0.01, 16, 100]} />
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// --- 2. Floating Tech Cubes ---
function FloatingTechCubes() {
  const cubes = [
    { pos: [-2.5, 1.5, -2], color: "#06b6d4", speed: 1.2, scale: 0.3 },
    { pos: [2.5, -1, -2], color: "#3b82f6", speed: 1.5, scale: 0.4 },
    { pos: [-2, -2, -1], color: "#a78bfa", speed: 1.8, scale: 0.2 },
    { pos: [2, 2, -3], color: "#60a5fa", speed: 1.1, scale: 0.35 },
  ];

  return (
    <>
      {cubes.map((cube, i) => (
        <Float key={i} speed={cube.speed} rotationIntensity={2} floatIntensity={2}>
          <mesh position={cube.pos} scale={cube.scale}>
            <Box args={[1, 1, 1]}><meshStandardMaterial color={cube.color} wireframe transparent opacity={0.8} /></Box>
          </mesh>
        </Float>
      ))}
    </>
  );
}

// --- 3. Background Starfield ---
function ParticleField() {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000 * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30; positions[i + 1] = (Math.random() - 0.5) * 30; positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  });
  useFrame((state, delta) => { ref.current.rotation.x -= delta / 40; ref.current.rotation.y -= delta / 50; });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#06b6d4" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
      </Points>
    </group>
  );
}

// --- 4. The Robot Presenter (Transition Screen) ---
function RobotPresenter({ onComplete }) {
  const containerRef = useRef(); const orbRef = useRef(); const textRef = useRef();
  useEffect(() => {
    const tl = gsap.timeline({ onComplete });
    gsap.set(containerRef.current, { opacity: 1 }); gsap.set(orbRef.current, { scale: 0, rotation: -180 }); gsap.set(textRef.current, { opacity: 0, y: 20 });
    tl.to(orbRef.current, { scale: 1, rotation: 0, duration: 1, ease: "expo.out" }).to(textRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.5").to(orbRef.current, { scale: 20, opacity: 0, duration: 0.8, delay: 1.5, ease: "power4.in" }).to(containerRef.current, { opacity: 0, duration: 0.2 });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020205]/95 backdrop-blur-xl">
      <div ref={orbRef} className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-dashed border-blue-400/50 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
        <div className="absolute inset-8 bg-cyan-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
        <div className="relative z-10 w-20 h-20 bg-gray-900 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.8)] overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-cyan-300 opacity-50 animate-[scan_1.5s_ease-in-out_infinite]"></div>
          <div className="flex gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div><div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-100"></div></div>
        </div>
      </div>
      <div ref={textRef} className="mt-12 text-center font-mono">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-widest uppercase">Booting Profile...</h2>
        <p className="text-cyan-400 text-sm md:text-base">&gt; Establishing connection to Susanta's Database</p>
        <p className="text-blue-400 text-xs mt-2 animate-pulse">Loading secure assets...</p>
      </div>
    </div>
  );
}

// --- 5. The UPGRADED 3D Robot Assistant ---
function RobotAssistant() {
  const robotRef = useRef(); const ringRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    robotRef.current.position.y = Math.sin(t * 2) * 0.1;
    robotRef.current.rotation.y = Math.sin(t * 0.5) * 0.2 + (state.pointer.x * 0.5);
    robotRef.current.rotation.x = (state.pointer.y * 0.5);
    ringRef.current.rotation.z = t * 0.5;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t) * 0.2;
  });
  return (
    <group ref={robotRef} scale={1.2}>
      <mesh><boxGeometry args={[1.2, 0.8, 0.8]} /><meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[0, 0, 0.41]}><planeGeometry args={[1, 0.6]} /><meshBasicMaterial color="#06b6d4" /></mesh>
      <mesh position={[-0.25, 0.1, 0.42]}><circleGeometry args={[0.1, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[0.25, 0.1, 0.42]}><circleGeometry args={[0.1, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <group ref={ringRef}><Torus args={[1, 0.02, 16, 64]}><meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1} transparent opacity={0.6} /></Torus></group>
      <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3]} /><meshStandardMaterial color="#3b82f6" /></mesh>
      <mesh position={[0, 0.7, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#60a5fa" /></mesh>
      <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.2]} /><meshStandardMaterial color="#1a1a24" /></mesh>
      <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.2]} /><meshStandardMaterial color="#1a1a24" /></mesh>
    </group>
  );
}

// --- 6. The Full Screen About Overlay (FIXED DOWNLOAD LOGIC) ---
function AboutScreen({ resume, onClose }) {
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloadState, setDownloadState] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleDownloadClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    setShowDownloadPopup(true); 
    setDownloadState('downloading');
    
    setTimeout(() => {
      setDownloadState('complete');
      // Point directly to the file in the frontend public folder
      setDownloadUrl('/resume.pdf'); 
    }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.5, type: "spring", bounce: 0.2 }} className="fixed inset-0 z-[150] bg-[#050508] overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="sticky top-0 w-full bg-[#050508]/90 backdrop-blur-xl border-b border-cyan-500/30 z-50 flex items-center justify-between px-6 py-4 shadow-[0_10px_30px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div><h2 className="text-lg md:text-xl font-bold text-white tracking-widest uppercase font-mono">Sys.Profile <span className="text-cyan-400">// Susanta_Nayak</span></h2></div>
        <button type="button" onClick={onClose} className="bg-white/5 hover:bg-cyan-500/20 text-white px-6 py-2 rounded-lg font-mono text-sm transition border border-white/10 hover:border-cyan-500 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>[ESC] CLOSE</button>
      </div>

      <div className="max-w-6xl mx-auto p-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-7 space-y-8">
            <div className="bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors duration-500 backdrop-blur-2xl">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-blue-600"></div>
              <h3 className="text-2xl font-bold text-white mb-8 font-mono flex items-center gap-3"><svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>&gt; Profile_Summary</h3>
              <div className="space-y-6 text-slate-300 leading-relaxed text-base md:text-lg relative z-10 whitespace-pre-wrap">
                {resume.about?.summary || "Loading profile..."}
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-8 rounded-3xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div><h3 className="text-xl font-bold text-white mb-1">Download Resume</h3><p className="text-slate-400 text-sm">Get the full offline PDF for offline reading.</p></div>
              
              <button 
                type="button" 
                onClick={handleDownloadClick} 
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 cursor-pointer"
              >
                Download PDF
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="lg:col-span-5 space-y-8">
            <div className="relative h-[220px] w-full rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>
              <div className="w-full h-full cursor-crosshair relative z-10"><Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}><ambientLight intensity={1.5} /><directionalLight position={[10, 10, 5]} intensity={3} color="#06b6d4" /><directionalLight position={[-10, -10, -5]} intensity={1.5} color="#3b82f6" /><Suspense fallback={null}><RobotAssistant /></Suspense></Canvas></div>
              <div className="absolute bottom-3 text-[10px] font-mono text-cyan-400/50 tracking-widest uppercase group-hover:text-cyan-400 transition-colors">[ Interactive AI Assistant Active ]</div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-2xl hover:border-cyan-500/30 transition">
              <h3 className="text-lg font-bold text-white mb-6 font-mono text-cyan-400">&gt; System_Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {[{ value: "2+", label: "Years Exp" }, { value: "500+", label: "Users Supported" }, { value: "L2/L3", label: "Prod Support" }, { value: "100%", label: "SLA Met" }].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-cyan-500/50 transition hover:bg-white/10 group"><p className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">{stat.value}</p><p className="text-xs text-slate-400 font-mono uppercase mt-1">{stat.label}</p></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showDownloadPopup && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="fixed z-[300] w-[calc(100%-2rem)] sm:w-80 bottom-1/2 translate-y-1/2 right-4 left-4 mx-auto sm:bottom-6 sm:top-auto sm:translate-y-0 sm:right-6 sm:left-auto sm:mx-0 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
            <div className="bg-cyan-500/10 px-5 py-3 border-b border-cyan-500/20 flex items-center justify-between"><div className="flex items-center gap-2"><svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span className="font-mono text-sm font-bold text-white uppercase tracking-wider">Receipt_Generator</span></div><button type="button" onClick={() => setShowDownloadPopup(false)} className="text-slate-400 hover:text-white transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
            <div className="p-5 font-mono text-sm">
              {downloadState === 'downloading' && (<><div className="flex justify-between mb-2 text-slate-400"><span>Customer:</span><span className="text-white">HR / Recruiter</span></div><div className="flex justify-between mb-2 text-slate-400"><span>Product:</span><span className="text-cyan-400">Susanta's Resume.pdf</span></div><div className="flex justify-between mb-4 text-slate-400"><span>Cost:</span><span className="text-green-400">FREE</span></div><div className="border-t border-dashed border-slate-600 pt-4 mb-4"><div className="flex justify-between mb-2"><span className="text-slate-400">Status:</span><span className="text-yellow-400 animate-pulse">Downloading...</span></div><div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "easeInOut" }} className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" /></div></div><div className="text-[10px] text-slate-500 text-center leading-tight mt-6">Downloading info about Susanta...</div></>)}
              {downloadState === 'complete' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center"><div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div><h4 className="text-white font-bold text-lg mb-2">Download Complete!</h4><p className="text-slate-400 text-xs mb-6">The file is ready. Do you want to open the secret?</p><a href={downloadUrl} target="_blank" rel="noreferrer" download="Susanta_Resume.pdf" onClick={() => setShowDownloadPopup(false)} className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">Open the Secret<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></motion.div>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- 7. Custom Cursor Glow ---
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => { const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', updateMousePosition); return () => window.removeEventListener('mousemove', updateMousePosition); }, []);
  return <motion.div className="fixed top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0 hidden md:block" animate={{ x: mousePosition.x - 128, y: mousePosition.y - 128 }} transition={{ type: "tween", ease: "backOut", duration: 0.5 }} />;
}

// --- 8. Main App Component ---
function App() {
  const [resume, setResume] = useState(null); const [error, setError] = useState(null); const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); const [showAbout, setShowAbout] = useState(false); const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => { const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight; const currentScroll = window.scrollY; setScrollProgress((currentScroll / totalScroll) * 100); };
    window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    client.get('/resume').then(res => setResume(res.data)).catch(err => { console.error("Error fetching data:", err); setError("Failed to connect to the backend."); });
  }, []);

  const handleAboutClick = () => { setIsTransitioning(true); setIsMobileMenuOpen(false); };
  const handleTransitionComplete = () => { setIsTransitioning(false); setShowAbout(true); };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-[#050508] text-red-500 font-bold">{error}</div>;
  if (!resume) return <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white text-xl">Loading Experience...</div>;

  return (
    <div className={`min-h-screen w-full bg-[#050508] text-slate-300 font-sans selection:bg-cyan-500 selection:text-white relative ${showAbout ? 'overflow-hidden h-screen' : ''}`}>
      <CustomCursor />
      <AnimatePresence>{isTransitioning && <RobotPresenter onComplete={handleTransitionComplete} />}</AnimatePresence>
      <AnimatePresence>{showAbout && <AboutScreen resume={resume} onClose={() => setShowAbout(false)} />}</AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none"><Canvas camera={{ position: [0, 0, 1] }}><ParticleField /></Canvas></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0"><div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div><div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div></div>
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent"><div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" style={{ width: `${scrollProgress}%` }} /></div>

      <nav className="fixed top-0 w-full bg-[#050508]/70 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-2xl font-black text-white tracking-tighter">{resume.hero.name.split(' ')[0]}<span className="text-cyan-400">.</span></a>
          <div className="hidden md:flex space-x-8 text-sm font-semibold">
            <button onClick={handleAboutClick} className="hover:text-cyan-400 transition-colors">About</button>
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Work</a>
            <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${resume.hero.email}`} className="hidden md:block bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-full font-semibold transition backdrop-blur-sm">Hire Me</a>
            <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />)}</svg></button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#050508] border-b border-white/10 overflow-hidden">
              <div className="flex flex-col px-6 py-4 space-y-4 text-sm font-semibold">
                <button onClick={() => { setIsMobileMenuOpen(false); handleAboutClick(); }} className="text-left text-slate-300 hover:text-cyan-400">About</button>
                <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">Services</a>
                <a href="#skills" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">Skills</a>
                <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">Work</a>
                <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">Experience</a>
                <a href={`mailto:${resume.hero.email}`} className="text-cyan-400 pt-2 border-t border-white/10">Hire Me</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[90vh] flex items-center pt-20 pb-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 text-sm font-semibold rounded-full border border-cyan-500/20 mb-8 backdrop-blur-md"><span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span> Available for new opportunities</motion.div>
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.05]">I build digital <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">experiences.</span></motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10">I'm <strong className="text-white">{resume.hero.name}</strong>. {resume.hero.headline}. {resume.hero.summary}</motion.p>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap gap-4 items-center">
                <button onClick={handleAboutClick} className="bg-white text-gray-950 hover:bg-gray-200 px-8 py-4 rounded-xl font-bold transition shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2 group">Wanna know about Susanta?<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg></button>
                <a href={`mailto:${resume.hero.email}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold transition backdrop-blur-md flex items-center gap-2">Let's Talk</a>
              </motion.div>
            </div>
            <div className="h-[400px] lg:h-[500px] w-full relative cursor-grab active:cursor-grabbing overflow-hidden">
              <Canvas camera={{ position: [0, 0, 9], fov: 45 }}><ambientLight intensity={0.5} /><directionalLight position={[10, 10, 5]} intensity={1.5} color="#06b6d4" /><directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" /><Suspense fallback={null}><DeveloperCore /><FloatingTechCubes /></Suspense></Canvas>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          {[{ value: "2+", label: "Years Exp" }, { value: "500+", label: "Users Supported" }, { value: "L2/L3", label: "Production" }, { value: "100%", label: "SLA Met" }].map((stat, i) => (
            <div key={i} className="text-center border-r border-white/10 last:border-0"><div className="text-4xl font-black text-white mb-2">{stat.value}</div><div className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">{stat.label}</div></div>
          ))}
        </div>

        {/* SERVICES SECTION (Dynamic) */}
        <section id="services" className="mb-32">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What I Bring to the Table</h2><p className="text-slate-400 max-w-2xl mx-auto text-lg">I don't just write code. I solve business problems, optimize performance, and ensure your product runs flawlessly.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resume.services?.map((service, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300 backdrop-blur-md group hover:-translate-y-2">
                <div className={`w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION (RESTORED YOUR CUSTOM CARDS) */}
        <section id="projects" className="mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Featured Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Project 1: Mixtape Kitchen */}
            <div className="group relative bg-[#0c0c14] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 transition duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[60px] group-hover:bg-cyan-500/30 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition">Mixtape Kitchen</h3>
                <div className="flex gap-4">
                  <a href="https://mixtape-kitchen.netlify.app" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition" title="View Live Site"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 flex-grow text-lg relative z-10">
                A full-stack restaurant web application featuring a dynamic menu, cart system, and table reservations. Architected with a React frontend, Node.js REST API, and MongoDB. Implemented secure JWT authentication, Razorpay Checkout for payments, Mailer OTP for verification, Google Maps API for location, and Google Cloud APIs for deployment and scaling.
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10" style={{ perspective: '1000px' }}>
                {["React.js", "Node.js", "MongoDB", "JWT", "Razorpay", "Google Maps", "Mailer OTP", "Google Cloud"].map((tech, j) => (
                  <TechBadge key={j} label={tech} />
                ))}
              </div>
            </div>

            {/* Project 2: Travelling Project */}
            <div className="group relative bg-[#0c0c14] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 transition duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[60px] group-hover:bg-cyan-500/30 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition">Travelling Project</h3>
                <div className="flex gap-4">
                  <a href="https://travelling-project-beta.vercel.app" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition" title="View Live Site"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8 flex-grow text-lg relative z-10">
                A modern travel and booking web application designed to help users explore destinations. Features a clean, responsive UI with smooth animations, dynamic routing, and optimized performance. Deployed and hosted on Vercel.
              </p>
              <div className="flex flex-wrap gap-3 mt-auto relative z-10" style={{ perspective: '1000px' }}>
                {["React.js", "Tailwind CSS", "Vercel", "Frontend"].map((tech, j) => (
                  <TechBadge key={j} label={tech} />
                ))}
              </div>
            </div>

          </div>

          {/* The "Want to see more" Call to Action */}
          <div className="mt-16 text-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] group-hover:bg-cyan-500/20 transition-all"></div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 relative z-10">Want to see more like this?</h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10">I have built several other full-stack applications, tools, and experiments. Explore my complete collection of repositories on GitHub.</p>
            <a href="https://github.com/Susantanayak1999" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-[0_0_30px_rgba(6,182,212,0.4)] relative z-10 hover:scale-105"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>View All Projects on GitHub</a>
          </div>
        </section>

        {/* EXPERIENCE SECTION (Dynamic) */}
        <section id="experience" className="mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Professional Journey</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {resume.experience.map((exp, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:border-white/20 transition hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4"><div><h4 className="text-2xl font-bold text-white">{exp.role}</h4><div className="text-lg text-cyan-400 font-medium">{exp.company}</div></div><div className="mt-2 md:mt-0 px-4 py-1.5 bg-[#050508] border border-white/10 rounded-full text-sm font-bold text-slate-300">{exp.startDate} – {exp.endDate}</div></div>
                <ul className="space-y-3 mt-6">{exp.bullets.map((bullet, j) => <li key={j} className="text-slate-400 leading-relaxed flex items-start"><span className="text-cyan-500 mr-3 mt-1 text-xl leading-none">•</span> {bullet}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION (Dynamic) */}
        <section id="skills" className="mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Technical Arsenal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(resume.skills).map(([category, skills]) => (
              <div key={category} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                <h4 className="text-xl font-bold text-white mb-6 capitalize border-b border-white/10 pb-4">{category}</h4>
                <div className="flex flex-wrap gap-3">{skills.map((skill, i) => <span key={i} className="bg-[#050508] text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-white/5 hover:border-cyan-500 transition cursor-default hover:scale-105">{skill}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <section className="border-t border-white/10 pt-16 pb-8 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">great.</span></h2>
          <p className="text-slate-400 mb-10 max-w-lg text-lg">Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
          <a href={`mailto:${resume.hero.email}`} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-16 inline-block hover:scale-105">Say Hello</a>
          <div className="flex gap-8 mb-8"><a href={resume.hero.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition font-medium">GitHub</a><a href={resume.hero.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition font-medium">LinkedIn</a><a href={`mailto:${resume.hero.email}`} className="text-slate-400 hover:text-white transition font-medium">Email</a></div>
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} {resume.hero.name}. Designed & Built from scratch.</div>
        </section>
      </main>
    </div>
  );
}

export default App;