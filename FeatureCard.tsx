
import React from 'react';
import { FeatureCardProps } from '../types';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, active }) => {
  return (
    <div className={`p-4 transition-all duration-300 cursor-pointer border-l-2 ${
      active 
        ? 'bg-brand-neon/10 border-brand-neon shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
        : 'bg-transparent border-gray-800 hover:bg-brand-neon/5 hover:border-brand-neon/50'
    }`}>
      <div className="flex items-center gap-3 mb-1">
        <div className={`${active ? 'text-brand-neon' : 'text-gray-600'}`}>
          {icon}
        </div>
        <h3 className={`font-black text-[10px] tracking-widest uppercase ${active ? 'text-brand-neon' : 'text-gray-500'}`}>{title}</h3>
      </div>
      <p className="text-[10px] text-gray-600 leading-relaxed font-mono truncate">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
