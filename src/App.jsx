import { useEffect, useState, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import client from './api/client';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Icosahedron, Box, Torus, Sphere, Octahedron, Sparkles, Cylinder } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import gsap from 'gsap';
import { io } from 'socket.io-client';
import { Tilt } from 'react-tilt';
import { TypeAnimation } from 'react-type-animation';
import { X, Code2, Layout, Server, Terminal, Database, Cpu, Cloud, GitBranch, Phone, Mail, User, CheckCircle } from 'lucide-react';
import { fallbackResume } from './fallbackData';

// --- 1. The Interactive Contact HUD (For Navbar) ---
function ContactHUD({ resume, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute top-full mt-4 right-0 w-72 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_10px_40px_rgba(6,182,212,0.2)] overflow-hidden z-[100]"
    >
      <div className="bg-cyan-500/10 px-4 py-2 border-b border-cyan-500/20 flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">Initiate_Contact</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-2">
        <a href={`mailto:${resume.hero.email || 'iamsusantanayak99@gmail.com'}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Email Direct</div>
            <div className="text-[10px] text-slate-400 font-mono truncate w-48">{resume.hero.email || 'iamsusantanayak99@gmail.com'}</div>
          </div>
        </a>

        <a href={resume.hero.linkedin || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">LinkedIn Network</div>
            <div className="text-[10px] text-slate-400 font-mono">Connect & Message</div>
          </div>
        </a>

        <div className="h-px bg-white/10 my-2 mx-3"></div>

        <a href={`tel:${resume.hero.phone || '+919348001084'}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Direct Line</div>
            <div className="text-[10px] text-slate-400 font-mono">{resume.hero.phone || '+91-9348001084'}</div>
          </div>
        </a>
      </div>
    </motion.div>
  );
}

// --- 2. The Custom Connection Form Modal ---
function ConnectionFormModal({ resume, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', purpose: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Send data to your Node.js backend
      const response = await client.post('/email/send', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        purpose: formData.purpose,
      });

      if (response.status === 200) {
        setStatus('success');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert("Failed to send message. Please try again.");
      setStatus('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#050508]/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-[#0a0a0f] border border-cyan-500/30 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden relative"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono tracking-wider uppercase">Initialize_Connection</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2 font-mono">CONNECTION_STARTED</h4>
              <p className="text-slate-400 text-sm mb-6">
                Message sent successfully directly to Susanta! He will reach out to you shortly.
              </p>
              <button onClick={onClose} className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-xl font-bold font-mono text-sm transition">
                [ CLOSE_WINDOW ]
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-2">YOUR_NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#050508] border border-white/10 text-white p-3 pl-10 rounded-xl outline-none focus:border-cyan-500 transition-colors font-mono text-sm" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-2">YOUR_EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#050508] border border-white/10 text-white p-3 pl-10 rounded-xl outline-none focus:border-cyan-500 transition-colors font-mono text-sm" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-2">PHONE_NUMBER</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#050508] border border-white/10 text-white p-3 pl-10 rounded-xl outline-none focus:border-cyan-500 transition-colors font-mono text-sm" placeholder="+1 234 567 890" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-2">PURPOSE</label>
                <textarea required value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} className="w-full bg-[#050508] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors font-mono text-sm h-24" placeholder="I'd like to discuss a Frontend role..." />
              </div>
              <button type="submit" disabled={status === 'sending'} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                {status === 'sending' ? (
                  <span className="font-mono text-sm animate-pulse">Establishing Link...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    <span className="font-mono text-sm">SEND CONNECTION REQUEST</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- 3. The Robot Say Hello Sequence ---
function SayHelloSequence({ resume, onClose }) {
  const [step, setStep] = useState(1); // 1: Walking, 2: Watch, 3: Auto-Tap, 4: Form

  useEffect(() => {
    const walkTimer = setTimeout(() => setStep(2), 2000);
    const tapTimer = setTimeout(() => setStep(3), 3500);
    const modalTimer = setTimeout(() => setStep(4), 4500);

    return () => {
      clearTimeout(walkTimer);
      clearTimeout(tapTimer);
      clearTimeout(modalTimer);
    };
  }, []);

  if (step === 4) {
    return <ConnectionFormModal resume={resume} onClose={onClose} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-[#050508]/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        className="relative w-64 h-80 flex flex-col items-center justify-center z-10"
      >
        <div className="w-1 h-10 bg-gradient-to-t from-cyan-500 to-transparent"></div>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,1)] mb-2"
        ></motion.div>

        <div className="w-32 h-24 bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-3xl relative flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="w-24 h-8 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
          <motion.div
            animate={step >= 2 ? { y: [0, 5, 0], scaleY: [1, 0.2, 1] } : { scaleY: [1, 0.1, 1] }}
            transition={step >= 2 ? { duration: 0.5 } : { repeat: Infinity, duration: 3, repeatDelay: 2 }}
            className="absolute w-8 h-2 bg-[#050508] rounded-full"
          ></motion.div>
        </div>

        <div className="w-40 h-32 bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-3xl relative flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-6 h-24 bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-full"></div>
          <motion.div
            initial={{ rotate: 0 }}
            animate={step >= 2 ? { rotate: -110, y: -30, x: -20 } : { rotate: [0, 5, 0] }}
            transition={step >= 2 ? { duration: 0.8, type: "spring" } : { repeat: Infinity, duration: 1 }}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-6 h-24 bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-full origin-top flex flex-col items-center justify-end pb-2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={step >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`w-12 h-8 rounded-sm flex items-center justify-center transition-all duration-300 ${step === 3 ? 'bg-green-400 shadow-[0_0_30px_rgba(34,197,94,1)] scale-110' : 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]'}`}
            >
              {step === 3 ? (
                <CheckCircle className="w-5 h-5 text-black animate-pulse" />
              ) : (
                <span className="text-[10px] font-bold text-black font-mono animate-pulse">TAP</span>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={step === 3 ? { opacity: 1, rotate: -60, x: -40, y: -40 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 w-12 h-12 border-2 border-cyan-500/50 rounded-full bg-[#0a0a0f] z-20 pointer-events-none"
          />

          <div className="w-16 h-16 border-4 border-cyan-400/30 rounded-full flex items-center justify-center bg-[#050508] opacity-50">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-full"></div>
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          <motion.div
            animate={step === 1 ? { rotate: [0, 20, 0, -20, 0] } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-8 h-20 bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-b-2xl origin-top"
          />
          <motion.div
            animate={step === 1 ? { rotate: [0, -20, 0, 20, 0] } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-8 h-20 bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-b-2xl origin-top"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center font-mono z-10"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              {step === 3 ? "Connection Initialized!" : "Analyzing Request..."}
            </h3>
            <p className="text-cyan-400 text-sm animate-pulse">
              {step === 3 ? "Opening secure comms channel..." : "Tapping wrist device to connect..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- 4. The Boot Sequence Loader ---
function BootLoader({ onComplete }) {
  const containerRef = useRef(null);
  const [text, setText] = useState("");

  const bootLines = [
    "> INITIALIZING KERNEL...",
    "> MOUNTING /DEV/ROBOT_CORE...",
    "> BYPASSING FIREWALL...",
    "> DECRYPTING ASSETS...",
    "> CONNECTION ESTABLISHED."
  ];

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let displayText = "";

    const typeInterval = setInterval(() => {
      if (currentLine < bootLines.length) {
        if (currentChar < bootLines[currentLine].length) {
          displayText += bootLines[currentLine][currentChar];
          setText(displayText);
          currentChar++;
        } else {
          displayText += "\n";
          currentLine++;
          currentChar = 0;
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    const timer = setTimeout(() => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onComplete
        });
      }
    }, 3500);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#020205] flex flex-col items-center justify-center overflow-hidden font-mono">
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-around">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => (
          <div
            key={col}
            className="text-cyan-500 text-xs md:text-sm whitespace-pre writing-vertical animate-[floatUp_10s_linear_infinite]"
            style={{ animationDelay: `-${Math.random() * 5}s` }}
          >
            {Array(20).fill("01011010 11001010 10100101").join("\n")}
          </div>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)] animate-[scan_3s_ease-in-out_infinite]"></div>

      <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50"></div>
      <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50"></div>

      <div className="relative z-10 w-full max-w-lg p-8 border border-cyan-500/30 bg-[#050508]/80 backdrop-blur-md rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-xs text-slate-400">root@susanta-system:~</span>
        </div>

        <div className="text-cyan-400 text-sm md:text-base leading-loose whitespace-pre-wrap h-40">
          {text}
          <span className="w-2 h-4 bg-cyan-400 inline-block animate-pulse ml-1 align-middle"></span>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>SYS.BOOT</span>
            <span className="animate-pulse">LOADING...</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-[loadBar_3.5s_ease-in-out_forwards]"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-slate-600 text-[10px] tracking-widest uppercase">
        Susanta // Cyberdyne Systems
      </div>
    </div>
  );
}

// --- 5. The 3D Tech Badge ---
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

// --- 6. Background Starfield ---
function ParticleField() {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000 * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 30;
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

// --- 7. The Robotic HUD Overlay ---
function RoboticHUD() {
  const hudRef = useRef(null);
  useEffect(() => {
    gsap.to(".scan-line", { top: "100%", duration: 2.5, repeat: -1, ease: "linear", yoyo: true });
    gsap.to(".target-reticle", { rotation: 360, duration: 10, repeat: -1, ease: "linear" });
  }, []);

  return (
    <div ref={hudRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl border border-cyan-500/20">
      <div className="scan-line absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50"></div>
      <div className="target-reticle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] border border-dashed border-cyan-500/30 rounded-full"></div>
      <div className="absolute top-8 left-12 font-mono text-[10px] text-cyan-400/70 flex flex-col gap-1">
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> SYS.BOOT: OK</span>
        <span>LATENCY: 12ms</span>
        <span>MEM: 64%</span>
      </div>
      <div className="absolute bottom-8 right-12 font-mono text-[10px] text-cyan-400/70 text-right flex flex-col gap-1">
        <span>MODEL: NAYAK_A.I.</span>
        <span>STATUS: ACTIVE</span>
        <span className="text-yellow-400/80">AWAITING_INPUT...</span>
      </div>
    </div>
  );
}

// --- 8. The 3D Robot Assistant ---
function DeveloperCore() {
  const robotRef = useRef();
  const headRef = useRef();
  const coreRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    robotRef.current.position.y = Math.sin(t * 2) * 0.15;
    robotRef.current.rotation.y = (state.pointer.x * Math.PI) / 4;
    robotRef.current.rotation.x = (-state.pointer.y * Math.PI) / 6;
    headRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;
    coreRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
  });

  return (
    <group ref={robotRef} scale={1.2}>
      {/* HEAD */}
      <group ref={headRef} position={[0, 1, 0]}>
        <mesh><boxGeometry args={[1.2, 0.8, 1]} /><meshStandardMaterial color="#1a1a24" metalness={0.9} roughness={0.1} /></mesh>
        <mesh position={[0, 0.1, 0.51]}><planeGeometry args={[0.9, 0.3]} /><meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} /></mesh>
        <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.1]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} /></mesh>
        <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.1]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} /></mesh>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.02, 0.02, 0.4]} /><meshStandardMaterial color="#a78bfa" /></mesh>
        <mesh position={[0, 0.7, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} /></mesh>
      </group>
      {/* BODY */}
      <group position={[0, -0.2, 0]}>
        <mesh><boxGeometry args={[1.4, 1.2, 0.8]} /><meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.2} /></mesh>
        <group ref={coreRef} position={[0, 0.2, 0.41]}>
          <Torus args={[0.25, 0.05, 16, 32]}><meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} metalness={1} /></Torus>
          <sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={3} />
        </group>
        <mesh position={[-0.85, 0, 0]}><capsuleGeometry args={[0.15, 0.8, 4, 16]} /><meshStandardMaterial color="#1a1a24" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[0.85, 0, 0]}><capsuleGeometry args={[0.15, 0.8, 4, 16]} /><meshStandardMaterial color="#1a1a24" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[-0.5, -0.4, -0.4]} rotation={[Math.PI / 4, 0, 0]}><cylinderGeometry args={[0.1, 0.15, 0.4]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} /></mesh>
        <mesh position={[0.5, -0.4, -0.4]} rotation={[Math.PI / 4, 0, 0]}><cylinderGeometry args={[0.1, 0.15, 0.4]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} /></mesh>
      </group>
      <Sparkles count={40} scale={4} size={3} speed={0.5} opacity={0.4} color="#06b6d4" />
    </group>
  );
}

// --- 9. Robot Presenter (Transition Screen) ---
function RobotPresenter({ onComplete }) {
  const containerRef = useRef(); const orbRef = useRef(); const textRef = useRef();
  useEffect(() => {
    const tl = gsap.timeline({ onComplete });
    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(orbRef.current, { scale: 0, rotation: -180 });
    gsap.set(textRef.current, { opacity: 0, y: 20 });
    tl.to(orbRef.current, { scale: 1, rotation: 0, duration: 1, ease: "expo.out" })
      .to(textRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
      .to(orbRef.current, { scale: 20, opacity: 0, duration: 0.8, delay: 1.5, ease: "power4.in" })
      .to(containerRef.current, { opacity: 0, duration: 0.2 });
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

// --- 10. 3D Robot Assistant (Inside Modal) ---
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

// --- 11. The Full Screen About Overlay ---
function AboutScreen({ resume, onClose }) {
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloadState, setDownloadState] = useState('idle');
  const downloadUrl = resume.hero.pdfUrl || '#';

  const handleDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDownloadPopup(true);
    setDownloadState('downloading');
    setTimeout(() => { setDownloadState('complete'); }, 2500);
  };

  const triggerActualDownload = async () => {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Susanta_Nayak_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setShowDownloadPopup(false);
    } catch (error) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'Susanta_Nayak_Resume.pdf');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDownloadPopup(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.5, type: "spring", bounce: 0.2 }} className="fixed inset-0 z-[150] bg-[#050508] overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="sticky top-0 w-full bg-[#050508]/90 backdrop-blur-xl border-b border-cyan-500/30 z-50 flex items-center justify-between px-6 py-4 shadow-[0_10px_30px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div><h2 className="text-lg md:text-xl font-bold text-white tracking-widest uppercase font-mono">Sys.Profile <span className="text-cyan-400">// {resume.hero.name || 'Susanta_Nayak'}</span></h2></div>
        <button type="button" onClick={onClose} className="bg-white/5 hover:bg-cyan-500/20 text-white px-6 py-2 rounded-lg font-mono text-sm transition border border-white/10 hover:border-cyan-500 flex items-center gap-2"><X className="w-4 h-4" />[ESC] CLOSE</button>
      </div>

      <div className="max-w-6xl mx-auto p-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-7 flex flex-col">
            <div className="relative bg-[#050508] border border-cyan-500/40 rounded-2xl overflow-hidden group shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col flex-grow">

              <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)] z-20 opacity-50" />

              <div className="bg-[#0a0a0f] border-b border-cyan-500/30 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-4">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                  <h3 className="text-cyan-400 font-mono font-bold tracking-widest text-sm uppercase">Profile_Summary.exe</h3>
                </div>
                <button onClick={handleDownloadClick} className="w-full sm:w-auto bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 px-4 py-2 rounded-lg font-mono text-[10px] md:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] group/btn">
                  <Database className="w-3.5 h-3.5" />
                  [ DOWNLOAD_PDF ]
                  <svg className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              </div>

              <div className="p-6 md:p-8 relative flex-grow">
                <motion.div animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />

                <div className="space-y-5 relative z-10 font-sans">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300 leading-relaxed text-sm md:text-base">
                    I am a results-driven <strong className="text-white">Software Engineer</strong> with over 2 years of experience specializing in building robust, scalable, and user-centric web applications. My expertise sits at the intersection of <strong className="text-cyan-400">Frontend Engineering</strong> and <strong className="text-cyan-400">L2/L3 Production Support</strong>.
                  </motion.p>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative bg-[#0a0a0f] border border-white/10 p-4 md:p-5 rounded-xl overflow-hidden group/block hover:border-cyan-500/50 transition-colors">
                    <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                    <h4 className="text-cyan-400 font-mono text-xs mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span> CURRENT_DEPLOYMENT</h4>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                      Currently at <strong className="text-white">Razorpay (via iEnergizer)</strong>, I debug complex payment gateway integrations, analyze webhooks, and perform Root Cause Analysis (RCA) for enterprise merchants, consistently hitting 100% SLA targets.
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="relative bg-purple-900/10 border border-purple-500/20 p-4 md:p-5 rounded-xl overflow-hidden group/block hover:border-purple-500/50 transition-colors">
                    <div className="absolute left-0 top-0 w-1 h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
                    <h4 className="text-purple-400 font-mono text-xs mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></span> AI_ACCELERATED_WORKFLOW</h4>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                      I leverage <strong className="text-purple-300">AI-assisted development (LLMs, Copilot)</strong> to accelerate debugging, analyze root causes, and write cleaner, production-ready code. This allows me to turn critical 2 AM incidents into quick resolutions and ship features 35% faster.
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="relative bg-white/[0.03] border border-white/10 p-4 md:p-5 rounded-xl overflow-hidden group/block hover:border-white/30 transition-colors">
                    <div className="absolute left-0 top-0 w-1 h-full bg-slate-500"></div>
                    <h4 className="text-slate-400 font-mono text-xs mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> ACADEMIC_&_CERTIFICATIONS</h4>
                    <ul className="text-slate-300 leading-relaxed text-sm md:text-base list-disc list-inside space-y-1">
                      <li>Full Stack UI Development Certification — <strong className="text-white">Naresh IT</strong></li>
                      <li>B.Sc. Chemistry — <strong className="text-white">Utkal University</strong> (Self-taught Full Stack Engineer)</li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative h-[220px] w-full rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] flex items-center justify-center group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>
              <div className="w-full h-full cursor-crosshair relative z-10"><Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}><ambientLight intensity={1.5} /><directionalLight position={[10, 10, 5]} intensity={3} color="#06b6d4" /><directionalLight position={[-10, -10, -5]} intensity={1.5} color="#3b82f6" /><Suspense fallback={null}><RobotAssistant /></Suspense></Canvas></div>
              <div className="absolute bottom-3 text-[10px] font-mono text-cyan-400/50 tracking-widest uppercase group-hover:text-cyan-400 transition-colors">[ Interactive AI Assistant Active ]</div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-2xl hover:border-cyan-500/30 transition flex flex-col flex-grow justify-center">
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
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="fixed z-[300] w-[calc(100%-2rem)] sm:w-96 bottom-6 right-6 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
            <div className="bg-cyan-500/10 px-5 py-3 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2"><Terminal className="w-5 h-5 text-cyan-400" /><span className="font-mono text-sm font-bold text-white uppercase tracking-wider">Data_Extraction_Module</span></div>
              <button type="button" onClick={() => setShowDownloadPopup(false)} className="text-slate-400 hover:text-white transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 font-mono text-sm">
              {downloadState === 'downloading' && (
                <>
                  <div className="flex justify-between mb-2 text-slate-400"><span>Target:</span><span className="text-white">HR / Recruiter</span></div>
                  <div className="flex justify-between mb-2 text-slate-400"><span>Payload:</span><span className="text-cyan-400">Susanta_Nayak_Resume.pdf</span></div>
                  <div className="flex justify-between mb-4 text-slate-400"><span>Encryption:</span><span className="text-green-400">Bypassed</span></div>
                  <div className="border-t border-dashed border-slate-600 pt-4 mb-4">
                    <div className="flex justify-between mb-2"><span className="text-slate-400">Status:</span><span className="text-yellow-400 animate-pulse">Extracting Data...</span></div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "linear" }} className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" /></div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-center leading-tight mt-6">Decrypting blocks...</div>
                </>
              )}
              {downloadState === 'complete' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.2)]"><svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <h4 className="text-white font-bold text-lg mb-2 font-mono">EXTRACTION_COMPLETE</h4>
                  <p className="text-slate-400 text-xs mb-6 font-sans">File payload secured. Awaiting human authorization to open.</p>
                  <button onClick={triggerActualDownload} className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition font-mono text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">[ INITIATE_DOWNLOAD ]<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- 12. Custom Cursor ---
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => { const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', updateMousePosition); return () => window.removeEventListener('mousemove', updateMousePosition); }, []);
  return <motion.div className="fixed top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0 hidden md:block" animate={{ x: mousePosition.x - 128, y: mousePosition.y - 128 }} transition={{ type: "tween", ease: "backOut", duration: 0.5 }} />;
}

// --- 13. Cinematic Overlays ---
function CinematicOverlays() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03] mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 pointer-events-none z-[4] opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 2px, #06b6d4 3px)' }} />
    </>
  );
}

// --- 14. Animated Stat Counter ---
function StatCounter({ end, suffix = "", label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let animationFrameId;
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          const duration = 2000;
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutProgress * end));
            if (progress < 1) { animationFrameId = requestAnimationFrame(step); }
            else { setCount(end); }
          };
          animationFrameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(element);
    return () => { observer.disconnect(); if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center group py-2">
      <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors tabular-nums">{count}{suffix}</div>
      <div className="text-[10px] md:text-xs font-semibold text-cyan-400 tracking-wider uppercase text-center">{label}</div>
    </div>
  );
}

// --- 15. BOLD Project Card ---
function ProjectCard({ title, desc, tech, liveUrl, repoUrl, previewGradient = "bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-indigo-900/40", status = "live", problem, solution, result }) {
  return (
    <Tilt options={{ max: 12, scale: 1.02, speed: 400, glare: true, "max-glare": 0.3 }} className="h-full">
      <div className="group relative bg-[#0c0c14] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/60 transition duration-500 flex flex-col h-full overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 blur-[80px] group-hover:bg-cyan-500/40 transition-all duration-700" />
        <div className={`relative h-32 -mx-8 -mt-8 mb-6 rounded-t-3xl overflow-hidden border-b border-white/10 ${previewGradient}`}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl font-black text-white/20 tracking-tighter font-mono">{title.split(' ')[0]}</span></div>
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded-full border border-green-500/40"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /><span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">{status}</span></div>
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition">{title}</h3>
          <div className="flex gap-3">
            {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition" title="Live"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>}
            {repoUrl && <a href={repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition" title="Repo"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
          </div>
        </div>
        <p className="text-slate-400 leading-relaxed mb-4 flex-grow relative z-10">{desc}</p>
        {(problem || solution || result) && (
          <div className="grid grid-cols-3 gap-2 mb-5 relative z-10">
            {[{ k: "Problem", v: problem }, { k: "Solution", v: solution }, { k: "Result", v: result }].filter(x => x.v).map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-2"><div className="text-[9px] font-mono text-cyan-400/70 uppercase tracking-wider">{item.k}</div><div className="text-xs text-white font-semibold mt-0.5 leading-tight">{item.v}</div></div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-auto relative z-10" style={{ perspective: '1000px' }}>{tech.map((t, j) => <TechBadge key={j} label={t} />)}</div>
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-400 to-blue-600 group-hover:w-full transition-all duration-700" />
      </div>
    </Tilt>
  );
}

// --- 16. Auto-Scrolling Architecture Carousel ---
function ArchitectureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const architectures = [
    {
      title: "Mixtape_Kitchen", status: "PRODUCTION_READY", client: "React + Vite", server: "Node + Express", db: "MongoDB Atlas", flows: [
        { name: "Admin_Flow", desc: "JWT-Protected CMS Dashboard", icon: Layout, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/20" },
        { name: "Payment_Gateway", desc: "Razorpay Checkout + Webhooks", icon: Database, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/20" },
        { name: "Security_Layer", desc: "JWT Auth + OTP Verification", icon: Server, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/20" },
      ]
    },
    {
      title: "Portfolio_CMS", status: "LIVE_ENGINE", client: "React + Framer", server: "Node + Socket.io", db: "MongoDB + Cloudinary", flows: [
        { name: "Admin_Panel", desc: "Real-time Database Updates", icon: Layout, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/20" },
        { name: "File_Uploads", desc: "Multer + Cloudinary CDN", icon: Cloud, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/20" },
        { name: "Auth_Flow", desc: "JWT Auth + Protected Routes", icon: Server, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/20" },
      ]
    },
    {
      title: "Travelling_Project", status: "DEPLOYED_VERCEL", client: "React + Tailwind", server: "Static Routing", db: "No Database (API)", flows: [
        { name: "UI_Animations", desc: "Framer Motion Transitions", icon: Layout, color: "text-pink-400", border: "border-pink-500/20", bg: "bg-pink-500/20" },
        { name: "Dynamic_Routes", desc: "React Router DOM", icon: GitBranch, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/20" },
        { name: "Deployment", desc: "Vercel Edge Network", icon: Cloud, color: "text-white", border: "border-white/20", bg: "bg-white/20" },
      ]
    },
    {
      title: "Educare365", status: "ENTERPRISE_APP", client: "React + TypeScript", server: "Node + Express", db: "MongoDB Atlas", flows: [
        { name: "Role_Based", desc: "Admin / Teacher / Student Dashboards", icon: Layout, color: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-500/20" },
        { name: "REST_API", desc: "Clean Data Flow & Error Handling", icon: Database, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/20" },
        { name: "Security_Layer", desc: "JWT Auth + Bcrypt Hashing", icon: Server, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/20" },
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => { setActiveIndex((prev) => (prev + 1) % architectures.length); }, 5000);
    return () => clearInterval(timer);
  }, [architectures.length]);
  const current = architectures[activeIndex];

  return (
    <div className="mt-12 bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] transition-all duration-1000"></div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 border-b border-white/10 pb-4 gap-4">
        <div className="flex items-center gap-3"><Terminal className="w-5 h-5 text-cyan-400 shrink-0" /><h3 className="text-lg md:text-xl font-bold text-white font-mono transition-all duration-500">System_Architecture // <span className="text-cyan-400">{current.title}</span></h3></div>
        <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-mono border border-green-500/20 rounded w-fit">{current.status}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 relative z-10 font-mono text-xs md:text-sm text-center">
          <div className="px-6 py-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 w-full md:w-48 shadow-[0_0_15px_rgba(6,182,212,0.1)] relative"><span className="block mb-1 opacity-50 text-[10px]">CLIENT_APP</span>{current.client}<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#050508] px-2 text-[9px] text-slate-400 border border-white/10 rounded">End User</div></div>
          <div className="text-slate-600 flex flex-col items-center shrink-0"><span className="text-[10px] text-cyan-500/70 mb-1">HTTPS</span><span className="text-2xl leading-none">➔</span></div>
          <div className="px-6 py-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 w-full md:w-48 shadow-[0_0_15px_rgba(59,130,246,0.1)]"><span className="block mb-1 opacity-50 text-[10px]">REST_API</span>{current.server}</div>
          <div className="text-slate-600 flex flex-col items-center shrink-0"><span className="text-[10px] text-blue-500/70 mb-1">Mongoose</span><span className="text-2xl leading-none">➔</span></div>
          <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 w-full md:w-48 shadow-[0_0_15px_rgba(16,185,129,0.1)]"><span className="block mb-1 opacity-50 text-[10px]">DATABASE</span>{current.db}</div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={`flows-${activeIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5 relative z-10">
          {current.flows.map((flow, idx) => (
            <div key={idx} className={`flex items-center gap-3 bg-white/5 border ${flow.border} rounded-lg p-3 hover:bg-white/10 transition-colors`}>
              <div className={`w-8 h-8 rounded ${flow.bg} flex items-center justify-center ${flow.color} shrink-0`}><flow.icon className="w-4 h-4" /></div>
              <div className="text-left"><div className={`text-[10px] font-mono ${flow.color} uppercase tracking-wider`}>{flow.name}</div><div className="text-xs text-slate-300 truncate">{flow.desc}</div></div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {architectures.map((_, idx) => (
          <button key={idx} onClick={() => setActiveIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'}`} aria-label={`Go to slide ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}

// --- 17. Main App Component ---
function App() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(fallbackResume);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRobotSequence, setShowRobotSequence] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isContactOpen && !e.target.closest('.contact-wrapper')) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isContactOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (showAbout) setShowAbout(false);
      if (selectedExperience) setSelectedExperience(null);
      if (showContactModal) setShowContactModal(false);
      if (showRobotSequence) setShowRobotSequence(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showAbout, selectedExperience, showContactModal, showRobotSequence]);

  useEffect(() => {
    // We don't show a loading screen anymore. We just fetch in the background.
    client.get('/resume')
      .then(res => {
        // Once the backend wakes up, we replace the fallback with the real data
        if (res.data) setResume(res.data);
      })
      .catch(err => {
        console.error("Backend asleep or error. Using fallback data.", err);
        // We do nothing here. The site stays on the fallback data.
      });

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const socketUrl = isLocal ? 'http://localhost:5000' : 'https://susanta-portfolio-api.onrender.com';
    const socket = io(socketUrl);

    socket.on('resumeUpdated', (newResumeData) => {
      if (newResumeData) setResume(newResumeData);
    });

    return () => socket.disconnect();
  }, []);

  const handleAboutClick = () => {
    const scrollY = window.scrollY;
    window.history.pushState({ modal: 'about', scrollY }, '');
    setIsTransitioning(true);
    setIsMobileMenuOpen(false);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setShowAbout(true);
  };

  const closeAbout = () => {
    setShowAbout(false);
    if (window.history.state?.scrollY !== undefined) {
      setTimeout(() => {
        window.scrollTo({ top: window.history.state.scrollY, behavior: 'instant' });
      }, 10);
    }
    if (window.history.state?.modal === 'about') {
      window.history.back();
    }
  };

  const handleDownloadResume = () => {
    if (resume?.hero?.pdfUrl) { window.open(resume.hero.pdfUrl, '_blank'); }
    else { handleAboutClick(); }
  };

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] text-red-500 font-mono">
  //       <h1 className="text-2xl font-bold mb-4">CONNECTION_FAILED</h1>
  //       <p className="text-slate-400 mb-6">{error}</p>
  //       <button onClick={() => window.location.reload()} className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-400 transition">
  //         [ RETRY_CONNECTION ]
  //       </button>
  //     </div>
  //   );
  // }

  // if (!resume) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] text-white">
  //       <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
  //       <p className="font-mono text-cyan-400 text-sm animate-pulse">Waking up server... This may take up to 50 seconds.</p>
  //     </div>
  //   );
  // }

  const currentlyBuilding = resume.currentlyBuilding || [
    { label: "Active Project", value: "AI-Powered Portfolio CMS", icon: "⚡" },
    { label: "Learning", value: "Next.js 15 + TypeScript", icon: "📚" },
    { label: "Open To", value: "Frontend / Full-Stack Roles", icon: "🎯" },
  ];
  const certifications = resume.certifications || [
    { title: "Star Performer Award", org: "iEnergizer Services Pvt. Ltd.", icon: "🏆" },
    { title: "Full Stack UI Cert", org: "Naresh IT", icon: "🎓" },
    { title: "Production Support L2/L3", org: "Razorpay", icon: "🛡️" },
  ];

  const displayExperience = resume.experience.map(exp => {
    if (!exp.shortBullets) {
      const isProductSupport = exp.role.toLowerCase().includes('consultant') || exp.role.toLowerCase().includes('support');
      return {
        ...exp,
        role: isProductSupport ? "Product Support Engineer" : (exp.role || "Software Developer"),
        shortBullets: isProductSupport ? [
          "Diagnosed and resolved L2/L3 production incidents for high-volume enterprise merchants, ensuring strict SLA compliance.",
          "Executed deep-dive Root Cause Analyses (RCA) using Querybook, Coralogix, and custom SQL queries.",
          "Engineered internal troubleshooting playbooks that reduced repeat incident volume by 30%."
        ] : [
          "Architected and deployed full-stack web applications using React.js, Node.js, and MongoDB.",
          "Integrated secure payment gateways (Razorpay) and implemented JWT-based authentication systems.",
          "Optimized frontend performance, reducing UI reload times by 60% through advanced state management."
        ],
        detailedBullets: isProductSupport ? [
          "Diagnosed and resolved L2/L3 production incidents for high-volume enterprise merchants, ensuring strict SLA compliance.",
          "Executed deep-dive Root Cause Analyses (RCA) using Querybook, Coralogix, and custom SQL queries to isolate payment gateway failures.",
          "Engineered internal troubleshooting playbooks that reduced repeat incident volume by 30% across the support team.",
          "Collaborated directly with core engineering teams to patch systemic issues in REST APIs, webhooks, and callback payloads.",
          "Provided technical consultation to enterprise clients during critical payment outages, restoring merchant workflows rapidly."
        ] : [
          "Architected and deployed full-stack web applications using React.js, Node.js, and MongoDB.",
          "Integrated secure payment gateways (Razorpay Checkout) and implemented JWT-based authentication and authorization.",
          "Optimized frontend performance, reducing UI reload times by 60% through advanced state management and component memoization.",
          "Built responsive, cross-browser compatible UIs using Tailwind CSS and Framer Motion, improving user engagement by 35%.",
          "Designed and maintained RESTful APIs, ensuring clean data flow and robust error handling between client and server."
        ]
      };
    }
    return exp;
  });

  return (
    <div className={`min-h-screen w-full bg-[#050508] text-slate-300 font-sans selection:bg-cyan-500 selection:text-white relative ${showAbout ? 'overflow-hidden h-screen' : ''}`}>

      {/* BOOT LOADER */}
      <AnimatePresence>
        {isBooting && <BootLoader onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      <CustomCursor />
      <CinematicOverlays />

      <AnimatePresence>{isTransitioning && <RobotPresenter onComplete={handleTransitionComplete} />}</AnimatePresence>
      <AnimatePresence>{showAbout && <AboutScreen resume={resume} onClose={closeAbout} />}</AnimatePresence>
      <AnimatePresence>{showContactModal && <ConnectionFormModal resume={resume} onClose={() => setShowContactModal(false)} />}</AnimatePresence>

      {/* ROBOT SAY HELLO SEQUENCE */}
      <AnimatePresence>
        {showRobotSequence && (
          <SayHelloSequence
            resume={resume}
            onClose={() => setShowRobotSequence(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none"><Canvas camera={{ position: [0, 0, 1] }}><ParticleField /></Canvas></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" style={{ width: `${scrollProgress}%` }} />
      </div>

      <nav className="fixed top-0 w-full bg-[#050508]/70 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="text-2xl font-black text-white tracking-tighter">{resume.hero.name.split(' ')[0]}<span className="text-cyan-400">.</span></a>

          <div className="hidden md:flex space-x-8 text-sm font-semibold">
            <button onClick={handleAboutClick} className="hover:text-cyan-400 transition-colors">About</button>
            <button onClick={() => { navigate('/services'); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">Services</button>
            <button onClick={() => { navigate('/skills'); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">Skills</button>
            <button onClick={() => { navigate('/work'); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">Work</button>
            <button onClick={() => { navigate('/experience'); document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">Experience</button>
          </div>

          <div className="flex items-center gap-4 relative contact-wrapper">
            <button
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="hidden md:flex bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-full font-semibold transition backdrop-blur-sm items-center gap-2 group"
            >
              Hire Me
              <svg className={`w-4 h-4 transition-transform duration-300 ${isContactOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <AnimatePresence>
              {isContactOpen && <ContactHUD resume={resume} isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}
            </AnimatePresence>

            <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />)}
              </svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#050508] border-b border-white/10 overflow-hidden">
              <div className="flex flex-col px-6 py-4 space-y-4 text-sm font-semibold">
                <button onClick={() => { setIsMobileMenuOpen(false); handleAboutClick(); }} className="text-left text-slate-300 hover:text-cyan-400">About</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/services'); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-slate-300 hover:text-cyan-400">Services</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/skills'); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-slate-300 hover:text-cyan-400">Skills</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/work'); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-slate-300 hover:text-cyan-400">Work</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/experience'); document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-slate-300 hover:text-cyan-400">Experience</button>
                <button onClick={() => { setIsMobileMenuOpen(false); setIsContactOpen(true); }} className="text-cyan-400 pt-2 border-t border-white/10 text-left">Hire Me</button>
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 text-sm font-semibold rounded-full border border-cyan-500/20 mb-6 backdrop-blur-md">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span> Available for new opportunities
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-mono text-sm md:text-base text-cyan-400 mb-4 flex items-center gap-2">
                <span className="text-green-400">➜</span>
                <span className="text-slate-500">~</span>
                <TypeAnimation sequence={['whoami', 1200, 'npm run build:career', 1500, 'curl api.openai.com/v1/chat', 1500, 'llm.generate("Optimize production code")', 1500, 'echo "Available for hire ✓"', 2000]} wrapper="span" speed={45} repeat={Infinity} className="text-cyan-300" />
                <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 leading-[1.05]">
                I build payment-grade <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">web apps.</span>
              </motion.h1>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-[10px] md:text-xs font-mono font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]"><Cpu className="w-3.5 h-3.5" /> AI_INTEGRATION_READY</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-[10px] md:text-xs font-mono font-bold"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LLM_API_ACTIVE</div>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10">
                I'm <strong className="text-white">{resume.hero.name}</strong>. {resume.hero.headline}. I turn complex payment systems into experiences users trust, leveraging <strong className="text-purple-400">AI models</strong> to accelerate development and debugging.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 items-center relative z-20 mt-4 w-full sm:w-auto">
                <button onClick={handleAboutClick} className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-sm rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="relative z-10 flex items-center gap-2 tracking-wide uppercase">View My Profile<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg></span>
                </button>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:bg-white/5 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center gap-3"
                >
                  <span className="relative z-10 flex items-center gap-2 tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-400 group-hover:animate-pulse"></span>
                    Let's Connect
                  </span>
                </button>
              </motion.div>
            </div>

            <div className="h-[400px] lg:h-[500px] w-full relative cursor-crosshair overflow-hidden rounded-3xl">
              <RoboticHUD />
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} color="#06b6d4" />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
                <Suspense fallback={null}>
                  <DeveloperCore />
                  <EffectComposer>
                    <Bloom intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
                    <ChromaticAberration offset={[0.001, 0.001]} blendFunction={BlendFunction.NORMAL} />
                    <Vignette eskil={false} offset={0.1} darkness={1.2} />
                  </EffectComposer>
                </Suspense>
              </Canvas>
            </div>
          </div>
        </section>

        {/* HERO STATS & WHY HIRE ME */}
        <div className="mb-32 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col justify-center">
            <div className="grid grid-cols-2 h-full gap-y-8 gap-x-4">
              <div className="border-r border-b border-white/10 pb-6"><StatCounter end={2} suffix="+" label="Years Exp" /></div>
              <div className="border-b border-white/10 pb-6"><StatCounter end={500} suffix="+" label="Users Supported" /></div>
              <div className="border-r border-white/10 pt-6"><div className="flex flex-col items-center justify-center group py-2"><div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">L2/L3</div><div className="text-[10px] md:text-xs font-semibold text-cyan-400 tracking-wider uppercase text-center">Production</div></div></div>
              <div className="pt-6"><StatCounter end={100} suffix="%" label="SLA Met" /></div>
            </div>
          </div>

          <div className="relative bg-[#0a0a0f] border border-cyan-500/30 rounded-3xl p-6 md:p-8 overflow-hidden group hover:border-cyan-400 transition-colors shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3"><Terminal className="w-4 h-4 text-cyan-400" /><h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest">Ready_To_Deploy.exe</h4></div>
              <ul className="space-y-3 font-mono text-xs md:text-sm text-slate-300 mb-6 relative z-10">
                <li className="flex items-start gap-2"><span className="text-cyan-500 mt-0.5">▸</span> Builds payment-grade React frontends with AI-accelerated workflows.</li>
                <li className="flex items-start gap-2"><span className="text-cyan-500 mt-0.5">▸</span> Resolves L2/L3 incidents using AI-assisted RCA & log analysis.</li>
                <li className="flex items-start gap-2"><span className="text-cyan-500 mt-0.5">▸</span> Integrates LLM APIs and generative features into modern apps.</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-2 relative z-10 mt-auto">
              <a href={`mailto:${resume.hero.email || 'iamsusantanayak99@gmail.com'}`} className="bg-cyan-500 hover:bg-cyan-400 text-black py-2.5 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Mail className="w-3.5 h-3.5" />EMAIL</a>
              <a href={resume.hero.linkedin || '#'} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                LINKEDIN
              </a>
            </div>
          </div>
        </div>

        {/* SERVICES SECTION */}
        <section id="services" className="mb-32">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What I Bring to the Table</h2><p className="text-slate-400 max-w-2xl mx-auto text-lg">I don't just write code. I solve business problems, optimize performance, and leverage AI to ship faster.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition duration-300 backdrop-blur-md group hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-[30px] group-hover:bg-cyan-500/20 transition-all"></div>
              <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div>
              <h3 className="text-lg font-bold text-white mb-3">Frontend Engineering</h3><p className="text-slate-400 leading-relaxed text-sm">Building fast, responsive, and accessible user interfaces using React, Next.js, and Tailwind CSS.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition duration-300 backdrop-blur-md group hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[30px] group-hover:bg-blue-500/20 transition-all"></div>
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg></div>
              <h3 className="text-lg font-bold text-white mb-3">Backend & APIs</h3><p className="text-slate-400 leading-relaxed text-sm">Architecting robust server-side logic, REST APIs, and secure databases using Node.js, Express, and MongoDB.</p>
            </div>
            <div className="relative bg-[#0a0a0f] border border-purple-500/30 p-6 rounded-3xl hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition duration-300 group hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] group-hover:bg-purple-500/20 transition-all"></div>
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]"><Cpu className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">AI & Automation<span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 uppercase tracking-wider">New</span></h3>
              <p className="text-slate-400 leading-relaxed text-sm">Integrating LLM APIs (OpenAI), building RAG pipelines, and using AI assistants to accelerate debugging and code generation.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition duration-300 backdrop-blur-md group hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
              <h3 className="text-lg font-bold text-white mb-3">Production Support</h3><p className="text-slate-400 leading-relaxed text-sm">Debugging complex L2/L3 issues, analyzing logs, and doing Root Cause Analysis to keep systems online.</p>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard title="Mixtape Kitchen" desc="A full-stack restaurant web application featuring a dynamic menu, cart system, and table reservations. Architected with a React frontend, Node.js REST API, and MongoDB. Secure JWT auth, Razorpay Checkout, Mailer OTP verification, and Google Maps API." tech={["React.js", "Node.js", "MongoDB", "JWT", "Razorpay", "Google Maps", "Mailer OTP", "Google Cloud"]} liveUrl="https://mixtape-kitchen.netlify.app" repoUrl="https://github.com/Susantanayak1999" problem="Manual restaurant ops" solution="Full-stack booking + payments" result="Live on Netlify" previewGradient="bg-gradient-to-br from-orange-600/30 via-cyan-600/20 to-blue-900/40" />
            <ProjectCard title="Travelling Project" desc="A modern travel and booking web application designed to help users explore destinations. Features a clean, responsive UI with smooth animations, dynamic routing, and optimized performance. Deployed and hosted on Vercel." tech={["React.js", "Tailwind CSS", "Vercel", "Frontend"]} liveUrl="https://travelling-project-beta.vercel.app" repoUrl="https://github.com/Susantanayak1999" problem="Static travel discovery" solution="Animated destination routing" result="Deployed on Vercel" previewGradient="bg-gradient-to-br from-emerald-600/30 via-cyan-600/20 to-blue-900/40" />
            <ProjectCard title="Portfolio CMS" desc="A self-hosted headless CMS powering this very site. React + Vite frontend, Express REST API, MongoDB, and a JWT-protected admin panel with Multer file uploads and Socket.io real-time updates. Update every section without touching a line of code." tech={["React", "Node.js", "Express", "MongoDB", "JWT", "Socket.io", "Multer", "Vercel"]} liveUrl="https://personal-portfolio-orcin-nine.vercel.app" repoUrl="https://github.com/Susantanayak1999" problem="Manual updates" solution="Admin CMS + realtime" result="Zero-code edits" previewGradient="bg-gradient-to-br from-purple-600/30 via-cyan-600/20 to-blue-900/40" />
            <ProjectCard title="Educare365" desc="An education management platform with role-based dashboards, attendance tracking, and document sharing. Built with React, TypeScript, and a Node/Express backend with MongoDB. Focused on accessibility and clean data flows." tech={["React", "TypeScript", "Node.js", "MongoDB", "REST API", "JWT"]} liveUrl="https://github.com/Susantanayak1999" repoUrl="https://github.com/Susantanayak1999" problem="Scattered student data" solution="Role-based dashboards" result="Consolidated records" previewGradient="bg-gradient-to-br from-rose-600/30 via-cyan-600/20 to-indigo-900/40" />
          </div>

          <ArchitectureCarousel />

          <div className="mt-16 text-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] group-hover:bg-cyan-500/20 transition-all"></div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 relative z-10">Want to see more like this?</h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10">I have built several other full-stack applications, tools, and experiments. Explore my complete collection of repositories on GitHub.</p>
            <a href={resume.hero.github || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-[0_0_30px_rgba(6,182,212,0.4)] relative z-10 hover:scale-105"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>View All Projects on GitHub</a>
          </div>
        </section>

        <section className="mb-32">
          <div className="bg-gradient-to-br from-cyan-950/40 via-[#0a0a0f] to-blue-950/40 border border-cyan-500/20 rounded-3xl p-5 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/10 blur-[100px]" />
            <div className="flex items-center gap-3 mb-8 relative z-10"><span className="relative flex h-3 w-3 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span><h2 className="text-xl md:text-3xl font-bold text-white font-mono break-all">Currently_Building<span className="text-cyan-400">.log</span></h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {currentlyBuilding.map((item, i) => (
                <div key={i} className="bg-[#050508]/60 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-cyan-500/40 transition"><div className="text-2xl mb-2">{item.icon}</div><div className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest mb-1">{item.label}</div><div className="text-white font-bold break-words">{item.value}</div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-32">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {certifications.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition"><div className="text-3xl">{item.icon}</div><div><div className="text-white font-bold text-sm">{item.title}</div><div className="text-cyan-400/70 text-xs font-mono">{item.org}</div></div></div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="mb-32 relative">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Professional Journey</h2><p className="text-slate-400 font-mono text-sm tracking-widest uppercase">&gt; System_Log: Career_Execution</p></div>
          <div className="max-w-5xl mx-auto space-y-6 px-2 md:px-0">
            {displayExperience.map((exp, i) => {
              const isCurrent = i === 0;
              const displayBullets = exp.shortBullets || exp.bullets || [];
              const detailedBullets = exp.detailedBullets || exp.bullets || [];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group relative">
                  <div className={`relative bg-[#0a0a0f] border ${isCurrent ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/10 hover:border-cyan-500/30'} rounded-2xl overflow-hidden transition-all duration-500 backdrop-blur-xl`}>
                    <div className="bg-white/[0.03] border-b border-white/10 px-3 md:px-4 py-3 flex flex-wrap items-center justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                        <div className="flex gap-1.5 shrink-0"><div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div></div>
                        <div className="font-mono text-[10px] md:text-sm text-slate-300 flex items-center gap-1 md:gap-2 break-all"><span className="text-cyan-400 shrink-0">~/career</span><span className="text-slate-600 shrink-0">$</span><span className="text-white">cat {exp.company.toLowerCase().replace(/\s+/g, '_')}.log</span></div>
                      </div>
                      <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase border ${isCurrent ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>{isCurrent ? (<><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span> Active</>) : (<><span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Archived</>)}</div>
                    </div>
                    <div className="p-4 md:p-8 relative">
                      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none ${isCurrent ? 'bg-cyan-500/10' : 'bg-blue-500/5 group-hover:bg-cyan-500/10'} transition-all duration-700`}></div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10 gap-2 md:gap-4"><div><h4 className="text-xl md:text-3xl font-bold text-white tracking-tight break-words"><span className="text-cyan-500 mr-2 font-mono">#</span>{exp.role}</h4><div className="text-slate-400 font-mono mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs md:text-sm"><span className="text-blue-400 break-words">@ {exp.company}</span><span className="hidden sm:inline text-slate-600">|</span><span className="px-2 py-0.5 bg-white/5 rounded border border-white/5 w-fit">{exp.startDate} – {exp.endDate}</span></div></div></div>
                      <div className="space-y-3 relative z-10 border-l-2 border-cyan-500/20 pl-3 md:pl-6 ml-1 md:ml-2">
                        {displayBullets.slice(0, 3).map((bullet, j) => (
                          <motion.div key={j} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 + (j * 0.1) }} className="text-slate-300 leading-relaxed text-xs md:text-base flex items-start group-hover:text-white transition-colors duration-300 break-words"><span className="text-cyan-500 mr-2 md:mr-3 font-mono text-[10px] md:text-xs mt-1 opacity-70 group-hover:opacity-100 shrink-0">[{String(j + 1).padStart(2, '0')}]</span><span className="w-full">{bullet}</span></motion.div>
                        ))}
                      </div>
                      <div className="mt-6 relative z-10"><button onClick={() => setSelectedExperience({ ...exp, detailedBullets })} className="text-cyan-400 font-mono text-xs md:text-sm hover:text-cyan-300 transition flex items-center gap-2 group/btn"><span className="opacity-50 group-hover/btn:opacity-100 transition">&gt;</span>[ READ_MORE ]<span className="w-4 h-px bg-cyan-400/30 group-hover/btn:w-8 group-hover/btn:bg-cyan-400 transition-all"></span></button></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="mb-32 relative">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Technical Arsenal</h2><p className="text-slate-400 font-mono text-sm tracking-widest uppercase">&gt; Sys.Dump: Skill_Modules_Loaded</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(resume.skills || {}).map(([category, skills], idx) => {
              const lowerCat = category.toLowerCase();
              let BgIcon = Code2; let iconColor = "text-cyan-500"; let iconPos = "right-[-5%] top-[-10%]";
              if (lowerCat.includes('front')) { BgIcon = Layout; iconColor = "text-blue-500"; iconPos = "right-[-10%] top-[-10%]"; }
              else if (lowerCat.includes('back')) { BgIcon = Server; iconColor = "text-indigo-500"; iconPos = "right-[-5%] bottom-[-10%]"; }
              else if (lowerCat.includes('tool')) { BgIcon = Terminal; iconColor = "text-emerald-500"; iconPos = "right-[-10%] bottom-[-15%]"; }
              else if (lowerCat.includes('lang')) { BgIcon = Code2; iconColor = "text-cyan-500"; iconPos = "right-[-5%] top-[-10%]"; }
              return (
                <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="group relative bg-[#0a0a0f]/90 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                  <BgIcon className={`absolute w-64 h-64 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0 ${iconColor} ${iconPos}`} strokeWidth={1} />
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[60px] group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4"><div className="flex items-center gap-3"><div className="w-2 h-6 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div><h4 className="text-xl font-bold text-white capitalize font-mono tracking-tight">{category}</h4></div><div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span><span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 backdrop-blur-md">{skills.length} MODULES</span></div></div>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {/* Inject Missing Skills from Resume */}
                    {lowerCat.includes('lang') && (
                      <>
                        {["C#", ".NET (Beginner)"].map((lang, i) => (
                          <motion.div key={`lang-${i}`} whileHover={{ scale: 1.05, y: -2 }} className="relative px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 cursor-default group/skill overflow-hidden">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></div>
                            <span className="text-sm font-medium text-slate-300 font-mono">{lang}</span>
                          </motion.div>
                        ))}
                      </>
                    )}
                    {lowerCat.includes('back') && (
                      <>
                        {["Node.js", "MongoDB", "SQL"].map((back, i) => (
                          <motion.div key={`back-${i}`} whileHover={{ scale: 1.05, y: -2 }} className="relative px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 cursor-default group/skill overflow-hidden">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></div>
                            <span className="text-sm font-medium text-slate-300 font-mono">{back}</span>
                          </motion.div>
                        ))}
                      </>
                    )}
                    {lowerCat.includes('front') && (
                      <>
                        {["React.js"].map((front, i) => (
                          <motion.div key={`front-${i}`} whileHover={{ scale: 1.05, y: -2 }} className="relative px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 cursor-default group/skill overflow-hidden">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></div>
                            <span className="text-sm font-medium text-slate-300 font-mono">{front}</span>
                          </motion.div>
                        ))}
                      </>
                    )}
                    {skills.map((skill, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.05, y: -2 }} className="relative px-4 py-2 bg-[#050508]/80 backdrop-blur-sm border border-white/10 rounded-lg flex items-center gap-2 cursor-default group/skill overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/15 to-cyan-500/0 translate-x-[-100%] group-hover/skill:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="w-1.5 h-1.5 bg-slate-600 group-hover/skill:bg-cyan-400 group-hover/skill:shadow-[0_0_8px_rgba(6,182,212,1)] transition-all rounded-sm"></div>
                        <span className="text-sm font-medium text-slate-300 group-hover/skill:text-white transition-colors z-10 font-mono">{skill}</span>
                      </motion.div>
                    ))}
                    {lowerCat.includes('tool') && (
                      <>
                        {["OpenAI API", "Prompt Engineering", "LLM Integration", "RAG Pipelines"].map((aiSkill, i) => (
                          <motion.div key={`ai-${i}`} whileHover={{ scale: 1.05, y: -2 }} className="relative px-4 py-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/40 rounded-lg flex items-center gap-2 cursor-default group/skill overflow-hidden shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 translate-x-[-100%] group-hover/skill:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="w-1.5 h-1.5 bg-purple-400 group-hover/skill:bg-white group-hover/skill:shadow-[0_0_8px_rgba(255,255,255,1)] transition-all rounded-sm"></div>
                            <span className="text-sm font-medium text-purple-100 group-hover/skill:text-white transition-colors z-10 font-mono">{aiSkill}</span>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-colors duration-300"></div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/10 pt-16 pb-8 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">great.</span></h2>
          <p className="text-slate-400 mb-10 max-w-lg text-lg">Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>

          <button
            onClick={() => setShowRobotSequence(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-16 inline-block hover:scale-105"
          >
            Say Hello
          </button>

          <div className="flex gap-8 mb-8">
            <a href={resume.hero.github || '#'} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition font-medium">GitHub</a>
            <a href={resume.hero.linkedin || '#'} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition font-medium">LinkedIn</a>
            <a href={`mailto:${resume.hero.email || 'iamsusantanayak99@gmail.com'}`} className="text-slate-400 hover:text-white transition font-medium">Email</a>
          </div>
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} {resume.hero.name}. Designed & Built from scratch.</div>
        </section>
      </main>

      {/* EXPERIENCE MODAL */}
      <AnimatePresence>
        {selectedExperience && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#050508]/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0a0a0f] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden relative">
              <div className="p-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02]"><div><h3 className="text-2xl font-bold text-white mb-1"><span className="text-cyan-500 font-mono mr-2">#</span>{selectedExperience.role}</h3><p className="text-cyan-400 font-mono text-sm">@ {selectedExperience.company}</p></div><button onClick={() => setSelectedExperience(null)} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"><X className="w-5 h-5" /></button></div>
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5"><span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Duration:</span><span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs rounded-full font-mono">{selectedExperience.startDate} – {selectedExperience.endDate}</span></div>
                {selectedExperience.detailedBullets.map((bullet, j) => (
                  <div key={j} className="text-slate-300 leading-relaxed text-sm md:text-base flex items-start"><span className="text-cyan-500 mr-3 font-mono text-xs mt-1 opacity-70">[{String(j + 1).padStart(2, '0')}]</span> <span>{bullet}</span></div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 bg-white/[0.02] text-center"><button onClick={() => setSelectedExperience(null)} className="text-xs font-mono text-slate-500 hover:text-white transition">[ CLOSE_WINDOW ]</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} onClick={handleDownloadResume} className="fixed bottom-6 right-6 z-[90] group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.9)] transition-all" aria-label="Download Resume">
        <svg className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0a0a0f] border border-cyan-500/30 text-cyan-400 text-xs font-mono px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">Download_Resume.pdf</span>
      </motion.button>
    </div>
  );
}

export default App;