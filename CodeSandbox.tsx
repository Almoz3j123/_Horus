
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileCode, 
  Trash2, 
  Plus, 
  X, 
  FolderOpen,
  Cpu,
  Monitor,
  Activity
} from 'lucide-react';

interface CodeSandboxProps {
  initialFiles?: Record<string, string>;
}

const CodeSandbox: React.FC<CodeSandboxProps> = ({ initialFiles }) => {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles || {
    'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>Hamo Neural Node</title>
  <style>
    body { background: #010409; color: #00ff41; font-family: monospace; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .box { border: 2px solid #00ff41; padding: 2rem; box-shadow: 0 0 40px rgba(0,255,65,0.2); font-size: 2rem; }
  </style>
</head>
<body>
  <div class="box">SYSTEM_STABLE: V4.5</div>
</body>
</html>`
  });

  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [srcDoc, setSrcDoc] = useState('');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  useEffect(() => {
    if (initialFiles && Object.keys(initialFiles).length > 0) {
      setFiles(initialFiles);
      const keys = Object.keys(initialFiles);
      setActiveFile(keys.includes('index.html') ? 'index.html' : keys[0]);
      runCode(initialFiles);
    }
  }, [initialFiles]);

  const runCode = (currentFiles: Record<string, string> = files) => {
    const html = currentFiles['index.html'] || '<html><body>NODE_ERROR: NO_INDEX_FOUND</body></html>';
    const css = Object.keys(currentFiles).filter(f => f.endsWith('.css')).map(f => `<style>${currentFiles[f]}</style>`).join('\n');
    const js = Object.keys(currentFiles).filter(f => f.endsWith('.js')).map(f => `<script>${currentFiles[f]}</script>`).join('\n');

    let combined = html;
    if (html.includes('</head>')) combined = combined.replace('</head>', `${css}</head>`);
    else combined = `<head>${css}</head>${combined}`;
    
    if (combined.includes('</body>')) combined = combined.replace('</body>', `${js}</body>`);
    else combined = `${combined}${js}`;

    setSrcDoc(combined);
  };

  const downloadProject = () => {
    const element = document.createElement("a");
    runCode();
    const file = new Blob([srcDoc], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "neural_node_project.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addFile = () => {
    const name = prompt('INJECT_FILENAME (EX: script.js):');
    if (name && !files[name]) {
      setFiles({ ...files, [name]: '' });
      setActiveFile(name);
    }
  };

  return (
    <div className="flex flex-col h-full gap-5 animate-in fade-in zoom-in-95 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between border-2 border-brand-neon/30 bg-black/90 p-5 rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.15)] gap-4">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-brand-neon/10 border border-brand-neon shadow-[0_0_15px_rgba(0,255,65,0.2)]">
            <Cpu className="text-brand-neon" size={24} />
          </div>
          <div>
            <h2 className="font-orbitron font-black text-brand-neon uppercase tracking-[0.3em] text-xs">NEURAL_FORGE_IDE</h2>
            <div className="flex items-center gap-3 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse"></div>
               <p className="text-[9px] text-brand-neon/60 font-mono uppercase tracking-widest">ENV: HAMO_STABLE_V4.5</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-brand-neon/5 border border-brand-neon/20 p-1">
            <button onClick={() => setViewMode('editor')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'editor' ? 'bg-brand-neon text-black' : 'text-brand-neon/40 hover:text-brand-neon'}`}>CODE</button>
            <button onClick={() => setViewMode('split')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'split' ? 'bg-brand-neon text-black' : 'text-brand-neon/40 hover:text-brand-neon'}`}>SPLIT</button>
            <button onClick={() => setViewMode('preview')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-brand-neon text-black' : 'text-brand-neon/40 hover:text-brand-neon'}`}>LIVE</button>
          </div>
          <button onClick={addFile} className="p-3 border border-brand-neon/20 hover:border-brand-neon text-brand-neon/60 hover:text-brand-neon transition-all hover:bg-brand-neon/10"><Plus size={20}/></button>
          <button onClick={downloadProject} className="p-3 border border-brand-neon/20 hover:border-brand-neon text-brand-neon/60 hover:text-brand-neon transition-all hover:bg-brand-neon/10"><Download size={20}/></button>
          <button onClick={() => runCode()} className="bg-brand-neon text-black px-8 h-12 font-black uppercase text-[10px] tracking-[0.3em] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] active:scale-95">DEPLOY</button>
        </div>
      </div>

      <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
        <div className="hidden xl:flex w-64 flex-col border border-brand-neon/20 bg-black/60 shrink-0 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-brand-neon/20 flex items-center gap-3 bg-brand-neon/5"><FolderOpen size={14} className="text-brand-neon/60" /><span className="text-[10px] font-black uppercase tracking-widest text-brand-neon/80">PROJECT_ROOT</span></div>
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            {Object.keys(files).map(name => (
              <div key={name} onClick={() => setActiveFile(name)} className={`flex items-center justify-between px-5 py-3 cursor-pointer group transition-all ${activeFile === name ? 'bg-brand-neon/10 text-brand-neon border-r-2 border-brand-neon' : 'text-gray-600 hover:text-brand-neon/70'}`}>
                <div className="flex items-center gap-3"><FileCode size={14} className={activeFile === name ? 'text-brand-neon' : 'text-gray-600'} /><span className="text-[10px] font-bold tracking-wider truncate uppercase">{name}</span></div>
                {name !== 'index.html' && <button onClick={(e) => { e.stopPropagation(); const {[name]: _, ...rest} = files; setFiles(rest); if(activeFile === name) setActiveFile('index.html'); }} className="opacity-0 group-hover:opacity-100 hover:text-red-500"><Trash2 size={12} /></button>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 h-full overflow-hidden">
          <div className={`flex flex-col border border-brand-neon/20 bg-black relative shadow-2xl ${viewMode === 'preview' ? 'hidden' : 'flex'}`}>
            <div className="flex items-center bg-brand-neon/[0.03] border-b border-brand-neon/20 overflow-x-auto custom-scrollbar shrink-0">
              {Object.keys(files).map(name => (
                <div key={name} className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-all border-r border-brand-neon/10 text-[9px] font-black uppercase tracking-widest ${activeFile === name ? 'bg-[#020617] text-brand-neon border-b-2 border-b-brand-neon' : 'text-gray-600 hover:text-brand-neon hover:bg-brand-neon/5'}`} onClick={() => setActiveFile(name)}>
                  <FileCode size={14} /><span>{name}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 relative flex overflow-hidden">
              <div className="w-12 bg-black border-r border-brand-neon/5 py-6 flex flex-col items-center text-[10px] text-brand-neon/15 font-mono select-none shrink-0">{Array.from({length: 80}).map((_, i) => (<div key={i} className="h-6 leading-6">{i + 1}</div>))}</div>
              <textarea value={files[activeFile]} onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })} className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-brand-neon/90 focus:outline-none resize-none custom-scrollbar leading-6" spellCheck={false}/>
            </div>
            <div className="p-3 bg-brand-neon/5 border-t border-brand-neon/10 flex justify-between px-6"><span className="text-[8px] text-brand-neon/30 font-black uppercase tracking-widest">UTF-8 | HAMO_IDE</span></div>
          </div>

          <div className={`relative border border-brand-neon/30 bg-white shadow-2xl ${viewMode === 'editor' ? 'hidden' : 'flex'} flex-col overflow-hidden`}>
            <div className="bg-gray-200 px-5 py-3 flex items-center justify-between border-b shrink-0">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
              <div className="flex-1 flex justify-center mx-4"><div className="bg-white/80 px-4 py-1 rounded text-[9px] font-mono text-gray-400 border border-gray-300 w-full max-w-sm truncate text-center">localhost:3000/hamo/index.html</div></div>
              <Monitor size={14} className="text-gray-400"/>
            </div>
            <iframe srcDoc={srcDoc} title="Preview" sandbox="allow-scripts allow-modals allow-popups allow-forms" className="flex-1 bg-white border-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSandbox;
