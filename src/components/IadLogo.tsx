import React from 'react';

interface IadLogoProps {
  className?: string;
  showText?: boolean;
  color?: string;
}

export default function IadLogo({ className = 'h-10', showText = true, color = '#00A0E2' }: IadLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} id="iad-logo-container">
      {/* Handcrafted precise iad logo SVG */}
      <svg 
        viewBox="0 0 200 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-full w-auto"
        id="iad-logo-svg"
      >
        {/* The 'iA' shape: left leg, loop, connecting curve */}
        <path 
          d="M35 55C35 43.9543 43.9543 35 55 35C66.0457 35 75 43.9543 75 55V60H65V55C65 49.4772 60.5228 45 55 45C49.4772 45 45 49.4772 45 55V60H35V55Z" 
          fill={color} 
        />
        <circle cx="55" cy="22" r="6" fill={color} />
        
        {/* The 'D' shape: loop connected */}
        <path 
          d="M85 20H100C113.807 20 125 31.1929 125 45C125 58.8071 113.807 70 100 70H85V20ZM95 30V60H100C108.284 60 115 53.2843 115 45C115 36.7157 108.284 30 100 30H95Z" 
          fill={color} 
        />
        
        {/* Stylized connecting bar linking iA and D */}
        <path 
          d="M60 40C68 32 80 32 88 40" 
          stroke={color} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      </svg>
      {showText && (
        <span 
          className="text-[9px] tracking-[0.25em] font-bold text-gray-800 -mt-2 font-sans" 
          id="iad-logo-text"
          style={{ color }}
        >
          IMMOBILIER
        </span>
      )}
    </div>
  );
}
