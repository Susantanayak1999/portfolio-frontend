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
      setStatus('✅ Saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('❌ Error saving data');
    }
  };

  // --- HERO HELPERS ---
  const updateHero = (field, value) => {
    setResume({ ...resume, hero: { ...resume.hero, [field]: value } });
  };

  // --- EXPERIENCE HELPERS ---
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
  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, { company: '', role: '', location: '', startDate: '', endDate: '', bullets: [''] }]
    });
  };
  const removeExperience = (index) => {
    const newExp = resume.experience.filter((_, i) => i !== index);
    setResume({ ...resume, experience: newExp });
  };

  // --- SKILLS HELPERS ---
  const updateSkill = (category, value) => {
    const skillArray = value.split(',').map(s => s.trim()).filter(Boolean);
    setResume({ ...resume, skills: { ...resume.skills, [category]: skillArray } });
  };

  // --- PROJECTS HELPERS ---
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
  const addProject = () => {
    setResume({
      ...resume,
      projects: [...resume.projects, { name: '', description: '', stack: [], liveUrl: '', repoUrl: '' }]
    });
  };
  const removeProject = (index) => {
    const newProj = resume.projects.filter((_, i) => i !== index);
    setResume({ ...resume, projects: newProj });
  };

  // --- EDUCATION HELPERS ---
  const updateEducation = (index, field, value) => {
    const newEdu = [...resume.education];
    newEdu[index][field] = value;
    setResume({ ...resume, education: newEdu });
  };
  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, { degree: '', institution: '', year: '' }]
    });
  };
  const removeEducation = (index) => {
    const newEdu = resume.education.filter((_, i) => i !== index);
    setResume({ ...resume, education: newEdu });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050508]">
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl w-96 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-white font-mono">Admin Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white text-black p-3 mb-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white text-black p-3 mb-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white p-3 rounded-xl font-bold transition">Login</button>
        </form>
      </div>
    );
  }

  if (!resume) return <div className="p-10 text-center text-white bg-[#050508] min-h-screen font-mono">Loading data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 min-h-screen bg-[#050508] text-slate-300 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white font-mono">Admin Dashboard</h1>
        <div>
          <a href="/" className="text-cyan-400 hover:text-cyan-300 font-semibold mr-4 transition">View Site</a>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-xl font-bold transition">Logout</button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-6">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Name</label>
            <input value={resume.hero.name} onChange={e => updateHero('name', e.target.value)} className="w-full bg-white text-black p-3 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Headline</label>
            <input value={resume.hero.headline} onChange={e => updateHero('headline', e.target.value)} className="w-full bg-white text-black p-3 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Summary</label>
            <textarea value={resume.hero.summary} onChange={e => updateHero('summary', e.target.value)} className="w-full bg-white text-black p-3 rounded-xl h-24 outline-none" />
          </div>
          
          <div className="border-t border-white/10 pt-4 mt-4">
            <label className="block text-sm font-medium mb-2 text-cyan-400">Upload Resume (PDF)</label>
            <input 
              type="file" accept=".pdf"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('resume', file);
                try {
                  setStatus('Uploading PDF...');
                  const uploadRes = await client.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                  updateHero('pdfUrl', uploadRes.data.fileUrl);
                  setStatus('✅ PDF Uploaded! Click Save to finalize.');
                } catch (err) {
                  setStatus('❌ Error uploading PDF');
                }
              }} 
              className="w-full bg-white text-black p-3 rounded-xl outline-none" 
            />
            {resume.hero.pdfUrl && <p className="text-sm text-green-400 mt-2 font-mono">Current PDF attached ✓</p>}
          </div>
        </div>
      </div>

      {/* EXPERIENCE SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-6 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Experience</h2>
          <button onClick={addExperience} className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-bold transition">+ Add Experience</button>
        </div>
        
        {resume.experience.map((exp, i) => (
          <div key={i} className="border border-white/10 p-6 mb-6 rounded-2xl bg-black/30 relative">
            <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-bold">Remove</button>
            <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
              <input value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} placeholder="Role" className="bg-white text-black p-2 rounded-lg outline-none" />
              <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company" className="bg-white text-black p-2 rounded-lg outline-none" />
              <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} placeholder="Start Date" className="bg-white text-black p-2 rounded-lg outline-none" />
              <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} placeholder="End Date" className="bg-white text-black p-2 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Bullet Points:</label>
              {exp.bullets.map((bullet, j) => (
                <input key={j} value={bullet} onChange={e => updateBullet(i, j, e.target.value)} className="w-full bg-white text-black p-2 rounded-lg mb-2 text-sm outline-none" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PROJECTS SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-6 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <button onClick={addProject} className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-bold transition">+ Add Project</button>
        </div>
        
        {resume.projects.map((proj, i) => (
          <div key={i} className="border border-white/10 p-6 mb-6 rounded-2xl bg-black/30 relative">
            <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-bold">Remove</button>
            <div className="space-y-4 mt-2">
              <input value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} placeholder="Project Name" className="w-full bg-white text-black p-2 rounded-lg outline-none" />
              <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="Description" className="w-full bg-white text-black p-2 rounded-lg h-24 outline-none" />
              <input value={proj.stack.join(', ')} onChange={e => updateProjectStack(i, e.target.value)} placeholder="Tech Stack (comma separated)" className="w-full bg-white text-black p-2 rounded-lg outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input value={proj.liveUrl} onChange={e => updateProject(i, 'liveUrl', e.target.value)} placeholder="Live URL" className="bg-white text-black p-2 rounded-lg outline-none" />
                <input value={proj.repoUrl} onChange={e => updateProject(i, 'repoUrl', e.target.value)} placeholder="Repo URL" className="bg-white text-black p-2 rounded-lg outline-none" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SKILLS SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
        <p className="text-sm text-cyan-400 mb-4">Separate skills with commas (e.g. React, Node, SQL)</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(resume.skills).map(category => (
            <div key={category}>
              <label className="block text-sm font-medium mb-2 text-slate-400 capitalize">{category}</label>
              <textarea value={resume.skills[category].join(', ')} onChange={e => updateSkill(category, e.target.value)} className="w-full bg-white text-black p-2 rounded-lg h-20 outline-none" />
            </div>
          ))}
        </div>
      </div>

      {/* EDUCATION SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-6 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Education</h2>
          <button onClick={addEducation} className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-bold transition">+ Add Education</button>
        </div>
        
        {resume.education.map((edu, i) => (
          <div key={i} className="border border-white/10 p-6 mb-6 rounded-2xl bg-black/30 relative">
            <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-bold">Remove</button>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="Degree" className="bg-white text-black p-2 rounded-lg col-span-2 outline-none" />
              <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" className="bg-white text-black p-2 rounded-lg outline-none" />
              <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="Year" className="bg-white text-black p-2 rounded-lg outline-none" />
            </div>
          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-white/10 p-4 flex justify-between items-center px-10 z-50">
        <span className="font-semibold text-cyan-400 font-mono">{status}</span>
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] transition hover:scale-105">
          Save All Changes
        </button>
      </div>

    </div>
  );
}