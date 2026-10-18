import { useState, useEffect } from 'react';
import client from './api/client';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
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
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 mb-4 rounded" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 mb-4 rounded" required />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        </form>
      </div>
    );
  }

  if (!resume) return <div className="p-10 text-center">Loading data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div>
          <a href="/" className="text-blue-600 hover:underline mr-4">View Site</a>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white p-6 rounded shadow mb-6 border">
        <h2 className="text-xl font-bold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={resume.hero.name} onChange={e => updateHero('name', e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input value={resume.hero.headline} onChange={e => updateHero('headline', e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea value={resume.hero.summary} onChange={e => updateHero('summary', e.target.value)} className="w-full border p-2 rounded h-24" />
          </div>

          {/* NEW: PDF UPLOAD SECTION */}
          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-medium mb-1">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('resume', file);

                try {
                  setStatus('Uploading PDF...');
                  const uploadRes = await client.post('/admin/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });

                  updateHero('pdfUrl', uploadRes.data.fileUrl);
                  setStatus('✅ PDF Uploaded! Click Save to finalize.');
                } catch (err) {
                  setStatus('❌ Error uploading PDF');
                }
              }}
              className="w-full border p-2 rounded bg-gray-50"
            />
            {resume.hero.pdfUrl && (
              <p className="text-sm text-green-600 mt-2 font-semibold">Current PDF attached ✓</p>
            )}
          </div>
        </div>
      </div>

      {/* EXPERIENCE SECTION */}
      <div className="bg-white p-6 rounded shadow mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Experience</h2>
          <button onClick={addExperience} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">+ Add Experience</button>
        </div>

        {resume.experience.map((exp, i) => (
          <div key={i} className="border p-4 mb-4 rounded bg-gray-50 relative">
            <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-red-500 text-sm font-bold hover:underline">Remove</button>
            <div className="grid grid-cols-2 gap-4 mb-2 mt-4">
              <input value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} placeholder="Role" className="border p-2 rounded" />
              <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company" className="border p-2 rounded" />
              <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} placeholder="Start Date" className="border p-2 rounded" />
              <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} placeholder="End Date" className="border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bullet Points:</label>
              {exp.bullets.map((bullet, j) => (
                <input key={j} value={bullet} onChange={e => updateBullet(i, j, e.target.value)} className="w-full border p-2 rounded mb-2 text-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SKILLS SECTION */}
      <div className="bg-white p-6 rounded shadow mb-6 border">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        <p className="text-sm text-gray-500 mb-4">Separate skills with commas (e.g. React, Node, SQL)</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(resume.skills).map(category => (
            <div key={category}>
              <label className="block text-sm font-medium mb-1 capitalize">{category}</label>
              <textarea
                value={resume.skills[category].join(', ')}
                onChange={e => updateSkill(category, e.target.value)}
                className="w-full border p-2 rounded h-20"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTS SECTION */}
      <div className="bg-white p-6 rounded shadow mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          <button onClick={addProject} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">+ Add Project</button>
        </div>

        {resume.projects.map((proj, i) => (
          <div key={i} className="border p-4 mb-4 rounded bg-gray-50 relative">
            <button onClick={() => removeProject(i)} className="absolute top-2 right-2 text-red-500 text-sm font-bold hover:underline">Remove</button>
            <div className="space-y-2 mb-2 mt-4">
              <input value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} placeholder="Project Name" className="border p-2 rounded w-full" />
              <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="Description" className="border p-2 rounded w-full h-20" />
              <input value={proj.stack.join(', ')} onChange={e => updateProjectStack(i, e.target.value)} placeholder="Tech Stack (comma separated)" className="border p-2 rounded w-full" />
              <div className="grid grid-cols-2 gap-4">
                <input value={proj.liveUrl} onChange={e => updateProject(i, 'liveUrl', e.target.value)} placeholder="Live URL" className="border p-2 rounded" />
                <input value={proj.repoUrl} onChange={e => updateProject(i, 'repoUrl', e.target.value)} placeholder="Repo URL" className="border p-2 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDUCATION SECTION */}
      <div className="bg-white p-6 rounded shadow mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Education</h2>
          <button onClick={addEducation} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">+ Add Education</button>
        </div>

        {resume.education.map((edu, i) => (
          <div key={i} className="border p-4 mb-4 rounded bg-gray-50 relative">
            <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-red-500 text-sm font-bold hover:underline">Remove</button>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="Degree" className="border p-2 rounded col-span-2" />
              <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" className="border p-2 rounded" />
              <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="Year" className="border p-2 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t flex justify-between items-center px-10 z-50">
        <span className="font-semibold text-gray-700">{status}</span>
        <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md">
          Save All Changes
        </button>
      </div>

    </div>
  );
}