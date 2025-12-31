
import React from 'react';
import { 
  Type, 
  CheckCircle, 
  X, 
  Trash2, 
  ExternalLink, 
  MessageCircle, 
  ShieldCheck,
  Zap,
  Cpu,
  Terminal,
  Skull
} from 'lucide-react';
import { MenuItemProps } from '../types';

interface SidebarRightProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  onChangeFont: () => void;
  currentFont: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-5 py-4 transition-all border-b border-brand-neon/10 ${
      active 
      ? 'bg-brand-neon/5 text-brand-neon' 
      : 'text-gray-500 hover:bg-brand-neon/5 hover:text-brand-neon'
    } group`}
  >
    <div className="flex items-center gap-3">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className={`w-1 h-1 bg-brand-neon transition-all ${active ? 'opacity-100 shadow-[0_0_5px_#00ff41]' : 'opacity-0'}`}></div>
  </button>
);

const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, onClose, onClearHistory, onChangeFont, currentFont }) => {
  return (
    <aside className={`fixed right-0 top-0 h-full w-85 bg-[#010409] border-l border-brand-neon/20 flex flex-col z-50 transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 p-2 text-brand-neon/40 hover:text-brand-neon transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col items-center text-center p-12 mt-12 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-neon blur-2xl opacity-10"></div>
          <div className="relative w-40 h-40 border border-brand-neon p-2 bg-black overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.1)]">
            <img 
              src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=500&auto=format&fit=crop" 
              alt="Hamo" 
              className="w-full h-full object-cover grayscale brightness-125 contrast-125 hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-neon text-black p-2 shadow-xl border border-black">
            <ShieldCheck size={18} />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-black font-orbitron text-brand-neon tracking-[0.2em] uppercase hacker-glow">
            HAMO <span className="opacity-50">ALMOZ3J</span>
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/30">
            <Skull size={12} className="text-brand-neon" />
            <span className="text-[9px] text-brand-neon font-black uppercase tracking-widest">SYSTEM_ARCHITECT_ROOT</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-5 py-2">
          <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">CONTROL_MODULES</span>
        </div>
        
        <MenuItem 
          label={`FONT_ENGINE: ${currentFont}`} 
          icon={<Type size={18} />} 
          onClick={onChangeFont} 
          active={currentFont === 'Arabic'}
        />
        
        <MenuItem 
          label="TELEGRAM_GATEWAY" 
          icon={<MessageCircle size={18} />} 
          onClick={() => window.open('https://t.me/Z_Y_Y_S', '_blank')} 
        />
        
        <MenuItem 
          label="PURGE_SYSTEM_CACHE" 
          icon={<Trash2 size={18} />} 
          onClick={onClearHistory} 
        />
        
        <MenuItem 
          label="PROJECT_REPOSITORY" 
          icon={<Terminal size={18} />} 
          onClick={() => window.open('https://t.me/Z_Y_Y_S', '_blank')} 
        />
      </div>

      <div className="p-10 border-t border-brand-neon/10 text-center space-y-4">
        <div className="flex justify-center gap-6">
           <a href="https://t.me/Z_Y_Y_S" target="_blank" className="text-gray-700 hover:text-brand-neon transition-all hover:scale-125">
              <MessageCircle size={20} />
           </a>
           <a href="#" className="text-gray-700 hover:text-brand-neon transition-all hover:scale-125">
              <Zap size={20} />
           </a>
        </div>
        <p className="text-[8px] text-gray-800 uppercase tracking-[0.5em] font-black">ENCRYPTED_CONNECTION_SECURE</p>
      </div>
    </aside>
  );
};

export default SidebarRight;
