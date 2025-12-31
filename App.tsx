
import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Cpu, 
  Send, 
  Sparkles, 
  Zap,
  Plus,
  Terminal,
  Paperclip,
  X,
  Mic,
  MicOff,
  MoreVertical,
  MessageSquare,
  Activity,
  Shield,
  Layers,
  ChevronLeft,
  Command,
  FileCode,
  Copy,
  Layout
} from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { geminiService, FilePart } from './services/gemini.ts';
import { Message, Conversation } from './types.ts';
import SidebarRight from './components/SidebarRight.tsx';
import FeatureCard from './components/FeatureCard.tsx';
import CodeSandbox from './components/CodeSandbox.tsx';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('cm_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(window.innerWidth > 1024); 
  const [activeTab, setActiveTab] = useState<'chat' | 'sandbox'>('chat');
  const [useArabicFont, setUseArabicFont] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FilePart[]>([]);
  const [sandboxFiles, setSandboxFiles] = useState<Record<string, string>>({});

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (currentConvId) {
      const conv = conversations.find(c => c.id === currentConvId);
      if (conv) setMessages(conv.messages);
    } else {
      setMessages([]);
    }
  }, [currentConvId, conversations]);

  useEffect(() => {
    localStorage.setItem('cm_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, attachedFiles]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const h = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${h}px`;
    }
  }, [input]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: `NODE_${conversations.length + 1}`,
      messages: [],
      timestamp: new Date()
    };
    setConversations([newConv, ...conversations]);
    setCurrentConvId(newId);
    setMessages([]);
    setShowWelcome(false);
    setActiveTab('chat');
    if (window.innerWidth < 1024) setIsLeftSidebarOpen(false);
  };

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;
    const currentInput = input;
    setInput('');
    setShowWelcome(false);

    let activeId = currentConvId;
    if (!activeId) {
      const newId = Date.now().toString();
      const newConv: Conversation = {
        id: newId,
        title: currentInput.substring(0, 15).toUpperCase() || "NEW_NODE",
        messages: [],
        timestamp: new Date()
      };
      setConversations([newConv, ...conversations]);
      activeId = newId;
      setCurrentConvId(newId);
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: currentInput || "[PAYLOAD]", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await geminiService.generateResponse(
        currentInput, 
        messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        attachedFiles
      );
      
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || 'NODE_ERROR', timestamp: new Date() };
      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        setConversations(convs => convs.map(c => c.id === activeId ? { ...c, messages: updated } : c));
        return updated;
      });
      setAttachedFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex h-screen w-full bg-[#010409] text-brand-neon ${useArabicFont ? 'font-arabic' : 'font-mono'} overflow-hidden relative`}>
      
      {/* Sidebar - Mobile Responsive */}
      <aside className={`fixed lg:static h-full border-r border-brand-neon/20 glass-card p-6 flex flex-col gap-6 z-50 transition-all duration-300 ${isLeftSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:w-0 overflow-hidden lg:p-0'}`}>
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Terminal className="text-brand-neon" size={24} />
            <h1 className="font-orbitron font-black text-lg text-brand-neon">CODEMASR</h1>
          </div>
          <button onClick={() => setIsLeftSidebarOpen(false)} className="p-2 text-brand-neon/40">
            <X size={20} />
          </button>
        </div>

        <button onClick={startNewChat} className="w-full py-3 border border-brand-neon text-brand-neon rounded font-black text-[10px] tracking-widest hover:bg-brand-neon/10 transition-all">
          + NEW_THREAD
        </button>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => { setCurrentConvId(conv.id); setActiveTab('chat'); setShowWelcome(false); if(window.innerWidth < 1024) setIsLeftSidebarOpen(false); }}
              className={`px-4 py-3 rounded cursor-pointer border text-[10px] font-black truncate ${currentConvId === conv.id ? 'bg-brand-neon/10 border-brand-neon shadow-inner' : 'border-transparent text-gray-500 hover:text-brand-neon'}`}>
              {`> ${conv.title}`}
            </div>
          ))}
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-black/40">
        <header className="h-16 border-b border-brand-neon/20 glass-card flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
          <button onClick={() => setIsLeftSidebarOpen(true)} className={`p-2 rounded border border-brand-neon/30 ${isLeftSidebarOpen ? 'hidden' : 'block'}`}>
            <MoreVertical size={18} />
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab(activeTab === 'chat' ? 'sandbox' : 'chat')} className="p-2 border border-brand-neon/20 text-brand-neon">
              {activeTab === 'chat' ? <Code2 size={18} /> : <MessageSquare size={18} />}
            </button>
            <div onClick={() => setIsRightSidebarOpen(true)} className="w-8 h-8 rounded border border-brand-neon overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar" ref={scrollRef}>
          {activeTab === 'chat' ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-40">
              {showWelcome && (
                <div className="border border-brand-neon/20 p-8 text-center bg-brand-neon/[0.02]">
                  <h1 className="text-2xl font-black font-orbitron text-brand-neon mb-2">NEURAL_OS_V4.5</h1>
                  <p className="text-[10px] text-brand-neon/40 uppercase tracking-widest">Awaiting Hamo command...</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[90%] p-4 border-l-2 ${msg.role === 'user' ? 'bg-brand-neon/[0.03] border-brand-neon' : 'bg-gray-900/50 border-gray-600 text-gray-300'}`}>
                    <div className="text-[8px] font-black uppercase opacity-30 mb-2">{msg.role === 'user' ? 'HAMO' : 'SYSTEM'}</div>
                    <pre className="whitespace-pre-wrap text-xs font-mono leading-relaxed">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-[10px] animate-pulse text-brand-neon/60 font-black">SYSTEM: RECOMPILING...</div>}
            </div>
          ) : (
            <CodeSandbox initialFiles={sandboxFiles} />
          )}
        </div>

        {/* Input Bar - Fixed for Mobile */}
        <div className="p-4 sm:p-8 absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative border-2 border-brand-neon bg-black p-2 flex items-end gap-2">
              <textarea 
                ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder="TYPE_COMMAND..." 
                className="flex-1 bg-transparent border-none outline-none p-2 text-sm text-brand-neon font-mono resize-none custom-scrollbar min-h-[40px]"
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <button onClick={handleSend} disabled={isLoading} className="bg-brand-neon text-black px-4 py-2 font-black text-xs hover:bg-white transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <SidebarRight isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} onClearHistory={() => setMessages([])} onChangeFont={() => setUseArabicFont(!useArabicFont)} currentFont={useArabicFont ? 'Arabic' : 'Neural'} />
    </div>
  );
};

export default App;
