import React from 'react';

interface IadLogoProps {
  className?: string;
  showText?: boolean;
  color?: string;
}

export default function IadLogo({ className = 'h-10', showText = true, color = '#00A0E2' }: IadLogoProps) {
  const isWhite = ['#fff', '#ffffff', 'white'].includes(color.toLowerCase());
  const src = isWhite ? '/IAD_LOGO_BLANC.png' : '/IAD_LOGO_BLEU.png';

  return (
    <div className={`flex items-center justify-center ${className}`} id="iad-logo-container">
      <img
        src={src}
        alt={showText ? 'iad Immobilier' : 'iad'}
        className="h-full w-auto object-contain"
        id="iad-logo-image"
      />
    </div>
  );
}
