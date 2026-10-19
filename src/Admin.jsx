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
      alert('Login failed. Check credentials.');
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
      setStatus('✅ Saved successfully! Live site updated.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('❌ Error saving data');
    }
  };

  // --- HERO ---
  const updateHero = (field, value) => setResume({ ...resume, hero: { ...resume.hero, [field]: value } });

  // --- ABOUT ---
  const updateAbout = (field, value) => setResume({ ...resume, about: { ...resume.about, [field]: value } });

  // --- SERVICES ---
  const updateService = (index, field, value) => {
    const newServices = [...resume.services];
    newServices[index][field] = value;
    setResume({ ...resume, services: newServices });
  };
  const addService = () => setResume({ ...resume, services: [...resume.services, { title: '', description: '' }] });
  const removeService = (index) => setResume({ ...resume, services: resume.services.filter((_, i) => i !== index) });

  // --- EXPERIENCE ---
  const updateExperience = (index, field, value) => {
    const newExp = [...resume.experience];
    newExp[index][field] = value;
    setResume({ ...resume, experience: newExp });
  };
  const updateBullet = (expIndex, bulletIndex, value) => {
    const newExp = [...resume.experience];
    newExp[expIndex].bullets[bulletIndex] = value;
    setResume({ ...resume, experience: newExp });
  };
  const addExperience = () => setResume({ ...resume, experience: [...resume.experience, { company: '', role: '', location: '', startDate: '', endDate: '', bullets: [''] }] });
  const removeExperience = (index) => setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== index) });

  // --- SKILLS ---
  const updateSkill = (category, value) => {
    const skillArray = value.split(',').map(s => s.trim()).filter(Boolean);
    setResume({ ...resume, skills: { ...resume.skills, [category]: skillArray } });
  };

  // --- PROJECTS ---
  const updateProject = (index, field, value) => {
    const newProj = [...resume.projects];
    newProj[index][field] = value;
    setResume({ ...resume, projects: newProj });
  };
  const updateProjectStack = (index, value) => {
    const newProj = [...resume.projects];
    newProj[index].stack = value.split(',').map(s => s.trim()).filter(Boolean);
    setResume({ ...resume, projects: newProj });
  };
  const addProject = () => setResume({ ...resume, projects: [...resume.projects, { name: '', description: '', stack: [], liveUrl: '', repoUrl: '' }] });
  const removeProject = (index) => setResume({ ...resume, projects: resume.projects.filter((_, i) => i !== index) });

  // --- EDUCATION ---
  const updateEducation = (index, field, value) => {
    const newEdu = [...resume.education];
    newEdu[index][field] = value;
    setResume({ ...resume, education: newEdu });
  };
  const addEducation = () => setResume({ ...resume, education: [...resume.education, { degree: '', institution: '', year: '' }] });
  const removeEducation = (index) => setResume({ ...resume, education: resume.education.filter((_, i) => i !== index) });

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050508] font-sans">
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-10 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.1)] w-96 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
          <h2 className="text-3xl font-bold mb-8 text-center text-white font-mono tracking-tight">System_Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">EMAIL_ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">SECRET_KEY</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-4 rounded-xl font-bold mt-4 transition shadow-[0_0_20px_rgba(6,182,212,0.3)]">Authenticate</button>
          </div>
        </form>
      </div>
    );
  }

  if (!resume) return <div className="p-10 text-center text-cyan-400 bg-[#050508] min-h-screen font-mono animate-pulse">Establishing secure connection...</div>;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-300 font-sans pb-32">
      
      {/* TOP NAVBAR */}
      <div className="sticky top-0 w-full bg-[#050508]/90 backdrop-blur-xl border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold text-white font-mono tracking-widest uppercase">Admin Console</h1>
        </div>
        <div className="flex gap-4">
          <a href="/" target="_blank" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg font-mono text-sm transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> Live Site
          </a>
          <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-5 py-2 rounded-lg font-mono text-sm transition">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10">

        {/* HERO SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
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
              <label className="block text-xs font-mono text-cyan-400 mb-2">RESUME_PDF_UPLOAD</label>
              <div className="flex items-center gap-4">
                <input type="file" accept=".pdf" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateHero('pdfUrl', reader.result); // Save as Base64 string
                    setStatus('✅ PDF processed! Click Save to finalize.');
                  };
                  reader.readAsDataURL(file);
                }} 
                  className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 transition-all cursor-pointer" 
                />
              </div>
              {resume.hero.pdfUrl && <p className="text-xs text-green-400 mt-3 font-mono flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> PDF Attached Successfully</p>}
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2"><span className="text-blue-400">&gt;</span> About Section</h2>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">PROFILE_SUMMARY</label>
            <textarea value={resume.about?.summary || ''} onChange={e => updateAbout('summary', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 rounded-xl h-40 outline-none focus:border-cyan-500 transition-colors" />
          </div>
        </div>

        {/* SERVICES SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-indigo-400">&gt;</span> Services</h2>
            <button onClick={addService} className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-lg text-sm font-mono transition">+ Add Service</button>
          </div>
          
          {resume.services?.map((service, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeService(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">TITLE</label>
                  <input value={service.title} onChange={e => updateService(i, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">DESCRIPTION</label>
                  <textarea value={service.description} onChange={e => updateService(i, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg h-20 outline-none focus:border-cyan-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EXPERIENCE SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-purple-400">&gt;</span> Experience</h2>
            <button onClick={addExperience} className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono transition">+ Add Job</button>
          </div>
          
          {resume.experience.map((exp, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">ROLE</label>
                  <input value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">COMPANY</label>
                  <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">START DATE</label>
                  <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">END DATE</label>
                  <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">BULLET POINTS</label>
                {exp.bullets.map((bullet, j) => (
                  <input key={j} value={bullet} onChange={e => updateBullet(i, j, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg mb-2 text-sm outline-none" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PROJECTS SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-emerald-400">&gt;</span> Projects</h2>
            <button onClick={addProject} className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-mono transition">+ Add Project</button>
          </div>
          
          {resume.projects.map((proj, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">PROJECT NAME</label>
                  <input value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">DESCRIPTION</label>
                  <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg h-20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">TECH STACK (comma separated)</label>
                  <input value={proj.stack.join(', ')} onChange={e => updateProjectStack(i, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">LIVE URL</label>
                    <input value={proj.liveUrl} onChange={e => updateProject(i, 'liveUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">REPO URL</label>
                    <input value={proj.repoUrl} onChange={e => updateProject(i, 'repoUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SKILLS SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2"><span className="text-yellow-400">&gt;</span> Skills</h2>
          <p className="text-xs text-slate-400 mb-4">Separate skills with commas (e.g. React, Node, SQL)</p>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(resume.skills).map(category => (
              <div key={category}>
                <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">{category}</label>
                <textarea value={resume.skills[category].join(', ')} onChange={e => updateSkill(category, e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-2 rounded-lg h-24 outline-none focus:border-cyan-500" />
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2"><span className="text-orange-400">&gt;</span> Education</h2>
            <button onClick={addEducation} className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-lg text-sm font-mono transition">+ Add Edu</button>
          </div>
          
          {resume.education.map((edu, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-mono">Remove</button>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-slate-500 mb-1">DEGREE</label>
                  <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">INSTITUTION</label>
                  <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">YEAR</label>
                  <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-white/10 p-4 flex justify-between items-center px-10 z-50">
        <span className="font-mono text-cyan-400 font-bold">{status}</span>
        <button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-10 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] transition hover:scale-105">
          Save All Changes
        </button>
      </div>

    </div>
  );
}