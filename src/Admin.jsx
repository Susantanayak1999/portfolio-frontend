import { useState, useEffect } from 'react';
import client from './api/client';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('admin@susanta.com');
  const [password, setPassword] = useState('SuperSecretPassword123!');
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (token) {
      client.get('/resume').then(res => setResume(res.data));
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert('Login failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setResume(null);
  };

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      await client.put('/admin/resume', resume);
      setStatus('✅ Saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('❌ Error saving data');
    }
  };

  // Helpers
  const updateHero = (field, value) => setResume({ ...resume, hero: { ...resume.hero, [field]: value } });
  const updateAbout = (field, value) => setResume({ ...resume, about: { ...resume.about, [field]: value } });
  const updateService = (i, f, v) => { const s = [...resume.services]; s[i][f] = v; setResume({ ...resume, services: s }); };
  const addService = () => setResume({ ...resume, services: [...resume.services, { title: '', description: '' }] });
  const removeService = (i) => setResume({ ...resume, services: resume.services.filter((_, idx) => idx !== i) });
  const updateExperience = (i, f, v) => { const e = [...resume.experience]; e[i][f] = v; setResume({ ...resume, experience: e }); };
  const updateBullet = (ei, bi, v) => { const e = [...resume.experience]; e[ei].bullets[bi] = v; setResume({ ...resume, experience: e }); };
  const addExperience = () => setResume({ ...resume, experience: [...resume.experience, { company: '', role: '', location: '', startDate: '', endDate: '', bullets: [''] }] });
  const removeExperience = (i) => setResume({ ...resume, experience: resume.experience.filter((_, idx) => idx !== i) });
  const updateSkill = (cat, val) => setResume({ ...resume, skills: { ...resume.skills, [cat]: val.split(',').map(s => s.trim()).filter(Boolean) } });
  const updateProject = (i, f, v) => { const p = [...resume.projects]; p[i][f] = v; setResume({ ...resume, projects: p }); };
  const updateProjectStack = (i, v) => { const p = [...resume.projects]; p[i].stack = v.split(',').map(s => s.trim()).filter(Boolean); setResume({ ...resume, projects: p }); };
  const addProject = () => setResume({ ...resume, projects: [...resume.projects, { name: '', description: '', stack: [], liveUrl: '', repoUrl: '' }] });
  const removeProject = (i) => setResume({ ...resume, projects: resume.projects.filter((_, idx) => idx !== i) });
  const updateEducation = (i, f, v) => { const e = [...resume.education]; e[i][f] = v; setResume({ ...resume, education: e }); };
  const addEducation = () => setResume({ ...resume, education: [...resume.education, { degree: '', institution: '', year: '' }] });
  const removeEducation = (i) => setResume({ ...resume, education: resume.education.filter((_, idx) => idx !== i) });

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050508] font-sans">
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-10 rounded-3xl w-96 backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-white font-mono">System_Login</h2>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 mb-4 rounded-xl" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 mb-6 rounded-xl" required />
          <button type="submit" className="w-full bg-cyan-600 text-white p-4 rounded-xl font-bold">Authenticate</button>
        </form>
      </div>
    );
  }

  if (!resume) return <div className="p-10 text-center text-cyan-400 bg-[#050508] min-h-screen font-mono">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-300 font-sans pb-32">
      <div className="sticky top-0 w-full bg-[#050508]/90 border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white font-mono">Admin Console</h1>
        <div className="flex gap-4">
          <a href="/" target="_blank" className="bg-white/5 text-white px-4 py-2 rounded-lg text-sm">Live Site</a>
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6 font-mono">Hero Section</h2>
          <input value={resume.hero.name} onChange={e => updateHero('name', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 mb-4 rounded-xl" />
          <input value={resume.hero.headline} onChange={e => updateHero('headline', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 mb-4 rounded-xl" />
          <textarea value={resume.hero.summary} onChange={e => updateHero('summary', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 mb-6 rounded-xl h-24" />

         // Find this section inside Hero Section:
          <div className="border-t border-white/10 pt-5 mt-5">
            <label className="block text-xs font-mono text-cyan-400 mb-2">PASTE LATEX CODE HERE</label>
            <textarea
              value={resume.hero.latexCode || ''}
              onChange={e => updateHero('latexCode', e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 h-64 rounded-xl font-mono text-sm outline-none focus:border-cyan-500 transition-colors"
              placeholder="\documentclass{article}..."
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6 font-mono">About Section</h2>
          <textarea value={resume.about?.summary || ''} onChange={e => updateAbout('summary', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 h-40 rounded-xl" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 border-t border-white/10 p-4 flex justify-between items-center px-10 z-50">
        <span className="font-mono text-cyan-400 font-bold">{status}</span>
        <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Save All Changes</button>
      </div>
    </div>
  );
}