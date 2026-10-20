import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResumeViewer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Read the URL from the address bar
  const pdfUrl = searchParams.get('url') || '/resume.pdf'; 

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col">
      {/* HEADER */}
      <div className="bg-[#0a0a0f] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <h2 className="font-bold font-mono tracking-widest text-sm text-cyan-400">SUSANTA_RESUME.PDF</h2>
        <div className="w-10"></div>
      </div>

      {/* PDF VIEWER */}
      <div className="flex-grow p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl h-[60vh] md:h-[75vh] bg-gray-900 rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col items-center justify-center">
          {/* Using an object tag is more reliable on mobile than iframe for PDFs */}
          <object 
            data={pdfUrl} 
            type="application/pdf" 
            className="w-full h-full"
          >
            <div className="text-center p-8">
              <p className="text-slate-400 mb-4">Your browser does not support viewing PDFs directly.</p>
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
                Click here to view the PDF
              </a>
            </div>
          </object>
        </div>

        {/* DOWNLOAD BUTTON */}
        <a 
          href={pdfUrl} 
          target="_blank"
          rel="noreferrer"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Open / Download PDF
        </a>
      </div>
    </div>
  );
}