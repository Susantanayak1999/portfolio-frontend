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
      setStatus('✅ Saved successfully! Real-time update sent.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('❌ Error saving data');
    }
  };

  // --- Helpers ---
  const updateHero = (field, value) => setResume({ ...resume, hero: { ...resume.hero, [field]: value } });
  const updateAbout = (field, value) => setResume({ ...resume, about: { ...resume.about, [field]: value } });
  
  // Services
  const updateService = (i, f, v) => { const s = [...(resume.services || [])]; s[i][f] = v; setResume({ ...resume, services: s }); };
  const addService = () => setResume({ ...resume, services: [...(resume.services || []), { title: '', description: '' }] });
  const removeService = (i) => setResume({ ...resume, services: (resume.services || []).filter((_, idx) => idx !== i) });

  // Experience (Supports shortBullets and detailedBullets)
  const updateExperience = (i, f, v) => { const e = [...resume.experience]; e[i][f] = v; setResume({ ...resume, experience: e }); };
  const updateExpArray = (ei, field, bi, v) => { 
    const e = [...resume.experience]; 
    if (!e[ei][field]) e[ei][field] = [];
    e[ei][field][bi] = v; 
    setResume({ ...resume, experience: e }); 
  };
  const addExpBullet = (ei, field) => {
    const e = [...resume.experience];
    if (!e[ei][field]) e[ei][field] = [];
    e[ei][field].push('');
    setResume({ ...resume, experience: e });
  };
  const removeExpBullet = (ei, field, bi) => {
    const e = [...resume.experience];
    e[ei][field] = e[ei][field].filter((_, idx) => idx !== bi);
    setResume({ ...resume, experience: e });
  };
  const addExperience = () => setResume({ ...resume, experience: [...resume.experience, { company: '', role: '', location: '', startDate: '', endDate: '', shortBullets: [''], detailedBullets: [''] }] });
  const removeExperience = (i) => setResume({ ...resume, experience: resume.experience.filter((_, idx) => idx !== i) });

  // Skills
  const updateSkill = (cat, val) => setResume({ ...resume, skills: { ...resume.skills, [cat]: val.split(',').map(s => s.trim()).filter(Boolean) } });

  // Projects (Supports problem, solution, result, gradient)
  const updateProject = (i, f, v) => { const p = [...resume.projects]; p[i][f] = v; setResume({ ...resume, projects: p }); };
  const updateProjectStack = (i, v) => { const p = [...resume.projects]; p[i].stack = v.split(',').map(s => s.trim()).filter(Boolean); setResume({ ...resume, projects: p }); };
  const addProject = () => setResume({ ...resume, projects: [...resume.projects, { name: '', description: '', stack: [], liveUrl: '', repoUrl: '', problem: '', solution: '', result: '', previewGradient: 'bg-gradient-to-br from-cyan-600/30 to-blue-900/40' }] });
  const removeProject = (i) => setResume({ ...resume, projects: resume.projects.filter((_, idx) => idx !== i) });

  // Education
  const updateEducation = (i, f, v) => { const e = [...resume.education]; e[i][f] = v; setResume({ ...resume, education: e }); };
  const addEducation = () => setResume({ ...resume, education: [...resume.education, { degree: '', institution: '', year: '' }] });
  const removeEducation = (i) => setResume({ ...resume, education: resume.education.filter((_, idx) => idx !== i) });

  // NEW: Certifications
  const updateCert = (i, f, v) => { const c = [...(resume.certifications || [])]; c[i][f] = v; setResume({ ...resume, certifications: c }); };
  const addCert = () => setResume({ ...resume, certifications: [...(resume.certifications || []), { title: '', org: '', icon: '🏆' }] });
  const removeCert = (i) => setResume({ ...resume, certifications: (resume.certifications || []).filter((_, idx) => idx !== i) });

  // NEW: Currently Building
  const updateBuilding = (i, f, v) => { const b = [...(resume.currentlyBuilding || [])]; b[i][f] = v; setResume({ ...resume, currentlyBuilding: b }); };
  const addBuilding = () => setResume({ ...resume, currentlyBuilding: [...(resume.currentlyBuilding || []), { label: '', value: '', icon: '⚡' }] });
  const removeBuilding = (i) => setResume({ ...resume, currentlyBuilding: (resume.currentlyBuilding || []).filter((_, idx) => idx !== i) });

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

  if (!resume) return <div className="p-10 text-center text-cyan-400 bg-[#050508] min-h-screen font-mono">Loading Database...</div>;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-300 font-sans pb-32">
      <div className="sticky top-0 w-full bg-[#050508]/90 border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md">
        <h1 className="text-xl font-bold text-white font-mono">Admin Console</h1>
        <div className="flex gap-4">
          <a href="/" target="_blank" className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition">Live Site</a>
          <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-8">
        
        {/* HERO SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
          <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2"><span className="text-cyan-400">&gt;</span> Hero Section</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">NAME</label>
              <input value={resume.hero.name} onChange={e => updateHero('name', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">HEADLINE</label>
              <input value={resume.hero.headline} onChange={e => updateHero('headline', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">SUMMARY</label>
              <textarea value={resume.hero.summary} onChange={e => updateHero('summary', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl h-28 outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div className="border-t border-white/10 pt-5 mt-5">
              <label className="block text-xs font-mono text-cyan-400 mb-2">UPLOAD RESUME (PDF)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('resume', file);
                    try {
                      setStatus('Uploading PDF to Cloudinary...');
                      const uploadRes = await client.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                      updateHero('pdfUrl', uploadRes.data.fileUrl);
                      setStatus('✅ PDF Uploaded! Click Save to finalize.');
                    } catch (err) {
                      console.error(err);
                      setStatus('❌ Error uploading PDF');
                    }
                  }} 
                  className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 transition-all cursor-pointer" 
                />
              </div>
              {resume.hero.pdfUrl && <p className="text-xs text-green-400 mt-3 font-mono flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> PDF Attached Successfully</p>}
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2"><span className="text-cyan-400">&gt;</span> About Summary</h2>
          <textarea value={resume.about?.summary || ''} onChange={e => updateAbout('summary', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 h-40 rounded-xl outline-none focus:border-cyan-500" />
        </div>

        {/* CURRENTLY BUILDING */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-cyan-400">&gt;</span> Currently Building</h2>
            <button onClick={addBuilding} className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm hover:bg-cyan-500/30 transition">+ Add Item</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(resume.currentlyBuilding || []).map((item, i) => (
              <div key={i} className="bg-[#0a0a0f] border border-white/5 p-5 rounded-2xl relative">
                <button onClick={() => removeBuilding(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
                <input value={item.icon} onChange={e => updateBuilding(i, 'icon', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Icon (Emoji)" />
                <input value={item.label} onChange={e => updateBuilding(i, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Label (e.g. Active Project)" />
                <input value={item.value} onChange={e => updateBuilding(i, 'value', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Value (e.g. AI Portfolio CMS)" />
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-cyan-400">&gt;</span> Certifications & Awards</h2>
            <button onClick={addCert} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm hover:bg-emerald-500/30 transition">+ Add</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(resume.certifications || []).map((item, i) => (
              <div key={i} className="bg-[#0a0a0f] border border-white/5 p-5 rounded-2xl relative">
                <button onClick={() => removeCert(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
                <input value={item.icon} onChange={e => updateCert(i, 'icon', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Icon (Emoji)" />
                <input value={item.title} onChange={e => updateCert(i, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Title" />
                <input value={item.org} onChange={e => updateCert(i, 'org', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Organization" />
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-purple-400">&gt;</span> Experience</h2>
            <button onClick={addExperience} className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg text-sm hover:bg-purple-500/30 transition">+ Add Role</button>
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-6 rounded-2xl relative">
              <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-mono">Remove</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg" placeholder="Role (e.g. Product Support Engineer)" />
                <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg" placeholder="Company" />
                <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg" placeholder="Start Date (e.g. Nov 2025)" />
                <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg" placeholder="End Date (e.g. Present)" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-cyan-400">Short Bullets (Shows on main card)</label>
                    <button onClick={() => addExpBullet(i, 'shortBullets')} className="text-xs text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20">+ Add</button>
                  </div>
                  {(exp.shortBullets || []).map((bullet, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <input value={bullet} onChange={e => updateExpArray(i, 'shortBullets', j, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg text-sm" />
                      <button onClick={() => removeExpBullet(i, 'shortBullets', j)} className="text-red-500 px-2 hover:bg-red-500/10 rounded">X</button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-purple-400">Detailed Bullets (Shows in popup)</label>
                    <button onClick={() => addExpBullet(i, 'detailedBullets')} className="text-xs text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20">+ Add</button>
                  </div>
                  {(exp.detailedBullets || []).map((bullet, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <input value={bullet} onChange={e => updateExpArray(i, 'detailedBullets', j, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg text-sm" />
                      <button onClick={() => removeExpBullet(i, 'detailedBullets', j)} className="text-red-500 px-2 hover:bg-red-500/10 rounded">X</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PROJECTS */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-emerald-400">&gt;</span> Projects</h2>
            <button onClick={addProject} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm hover:bg-emerald-500/30 transition">+ Add Project</button>
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-6 rounded-2xl relative">
              <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-mono">Remove</button>
              <input value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 mb-3 rounded-lg font-bold" placeholder="Project Name" />
              <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 mb-3 rounded-lg h-24 text-sm" placeholder="Description" />
              <input value={(proj.stack || []).join(', ')} onChange={e => updateProjectStack(i, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 mb-3 rounded-lg text-sm" placeholder="Tech Stack (comma separated)" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input value={proj.liveUrl} onChange={e => updateProject(i, 'liveUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg text-sm" placeholder="Live URL" />
                <input value={proj.repoUrl} onChange={e => updateProject(i, 'repoUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg text-sm" placeholder="Repo URL" />
              </div>

              {/* New Fields for Portfolio Cards */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input value={proj.problem || ''} onChange={e => updateProject(i, 'problem', e.target.value)} className="w-full bg-cyan-900/10 border border-cyan-500/20 text-cyan-300 p-3 rounded-lg text-sm" placeholder="Problem" />
                <input value={proj.solution || ''} onChange={e => updateProject(i, 'solution', e.target.value)} className="w-full bg-blue-900/10 border border-blue-500/20 text-blue-300 p-3 rounded-lg text-sm" placeholder="Solution" />
                <input value={proj.result || ''} onChange={e => updateProject(i, 'result', e.target.value)} className="w-full bg-emerald-900/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-lg text-sm" placeholder="Result" />
              </div>
              
              <input value={proj.previewGradient || ''} onChange={e => updateProject(i, 'previewGradient', e.target.value)} className="w-full bg-white/5 border border-white/10 text-slate-400 p-3 rounded-lg text-sm font-mono" placeholder="Gradient Class (e.g. bg-gradient-to-br from-cyan-600/30 to-blue-900/40)" />
            </div>
          ))}
        </div>

        {/* SKILLS */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2"><span className="text-cyan-400">&gt;</span> Skills</h2>
          <p className="text-xs text-slate-400 mb-4 font-mono">Note: Type skills separated by commas. To change the category name, edit the label.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(resume.skills || {}).map(category => (
              <div key={category} className="bg-[#0a0a0f] p-4 rounded-xl border border-white/5">
                <label className="block text-sm font-bold text-cyan-400 mb-2 font-mono uppercase tracking-widest">{category}</label>
                <textarea value={(resume.skills[category] || []).join(', ')} onChange={e => updateSkill(category, e.target.value)} className="w-full bg-[#050508] border border-white/10 text-white p-3 rounded-lg h-24 text-sm outline-none focus:border-cyan-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-orange-400">&gt;</span> Education</h2>
            <button onClick={addEducation} className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg text-sm hover:bg-orange-500/30 transition">+ Add</button>
          </div>
          {resume.education.map((edu, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
              <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 mb-3 rounded-lg" placeholder="Degree" />
              <div className="grid grid-cols-2 gap-4">
                <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg" placeholder="Institution" />
                <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg" placeholder="Year" />
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-md border-t border-white/10 p-4 flex justify-between items-center px-10 z-50">
        <span className="font-mono text-cyan-400 font-bold">{status}</span>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-[0_0_20px_rgba(34,197,94,0.4)]">Save & Publish</button>
      </div>
    </div>
  );
}