import { useState, useEffect } from 'react';
import client from './api/client';

// 👇 REPLACE THIS WITH YOUR ACTUAL GITHUB TOKEN AND DETAILS 👇
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_OWNER = "Susantanayak1999"; 
const GITHUB_REPO = "susanta_portfolio_new"; 

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('admin@susanta.com');
  const [password, setPassword] = useState('SuperSecretPassword123!');
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState('');
  const [buildStatus, setBuildStatus] = useState(''); // New state for GitHub build

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

  // --- Trigger GitHub Action ---
  const triggerGitHubAction = async () => {
    if (!resume.hero.latexCode) {
      alert("Please paste your LaTeX code first and click 'Save All Changes'.");
      return;
    }

    setBuildStatus('Triggering GitHub Action...');
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/build-resume.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: {
              latex_code: resume.hero.latexCode
            }
          })
        }
      );

      if (response.ok) {
        setBuildStatus('✅ GitHub is compiling your PDF! It will appear on your site in ~1 minute.');
      } else {
        const errorData = await response.json();
        setBuildStatus(`❌ Error: ${errorData.message}`);
      }
    } catch (err) {
      setBuildStatus('❌ Network error triggering GitHub.');
    }
  };

  // --- Helpers ---
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
        {/* HERO SECTION */}
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
                      const uploadRes = await client.post('/admin/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
                      updateHero('pdfUrl', uploadRes.data.fileUrl);
                      setStatus('✅ PDF Uploaded! Click Save to finalize.');
                    } catch (err) {
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
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6 font-mono">About Section</h2>
          <textarea value={resume.about?.summary || ''} onChange={e => updateAbout('summary', e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-3 h-40 rounded-xl" />
        </div>

        {/* SERVICES */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono">Services</h2>
            <button onClick={addService} className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm">+ Add</button>
          </div>
          {resume.services?.map((service, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeService(i)} className="absolute top-4 right-4 text-red-500 text-xs font-mono">Remove</button>
              <input value={service.title} onChange={e => updateService(i, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Title" />
              <textarea value={service.description} onChange={e => updateService(i, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg h-20" placeholder="Description" />
            </div>
          ))}
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono">Experience</h2>
            <button onClick={addExperience} className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg text-sm">+ Add</button>
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-red-500 text-xs font-mono">Remove</button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Role" />
                <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Company" />
                <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Start Date" />
                <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="End Date" />
              </div>
              {exp.bullets.map((bullet, j) => (
                <input key={j} value={bullet} onChange={e => updateBullet(i, j, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg text-sm" />
              ))}
            </div>
          ))}
        </div>

        {/* PROJECTS */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono">Projects</h2>
            <button onClick={addProject} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm">+ Add</button>
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-red-500 text-xs font-mono">Remove</button>
              <input value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Project Name" />
              <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg h-20" placeholder="Description" />
              <input value={proj.stack.join(', ')} onChange={e => updateProjectStack(i, e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Tech Stack (comma separated)" />
              <div className="grid grid-cols-2 gap-4">
                <input value={proj.liveUrl} onChange={e => updateProject(i, 'liveUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Live URL" />
                <input value={proj.repoUrl} onChange={e => updateProject(i, 'repoUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Repo URL" />
              </div>
            </div>
          ))}
        </div>

        {/* SKILLS */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6 font-mono">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(resume.skills).map(category => (
              <div key={category}>
                <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">{category}</label>
                <textarea value={resume.skills[category].join(', ')} onChange={e => updateSkill(category, e.target.value)} className="w-full bg-[#0a0a0f] border border-white/10 text-white p-2 rounded-lg h-24" />
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-mono">Education</h2>
            <button onClick={addEducation} className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg text-sm">+ Add</button>
          </div>
          {resume.education.map((edu, i) => (
            <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 mb-4 rounded-2xl relative">
              <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-red-500 text-xs font-mono">Remove</button>
              <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 mb-2 rounded-lg" placeholder="Degree" />
              <div className="grid grid-cols-2 gap-4">
                <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Institution" />
                <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-2 rounded-lg" placeholder="Year" />
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 border-t border-white/10 p-4 flex justify-between items-center px-10 z-50">
        <span className="font-mono text-cyan-400 font-bold">{status}</span>
        <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Save All Changes</button>
      </div>
    </div>
  );
}