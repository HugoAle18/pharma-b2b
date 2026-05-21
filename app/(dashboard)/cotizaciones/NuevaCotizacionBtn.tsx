'use client'

import React from 'react';
import { Plus } from 'lucide-react';

export default function NuevaCotizacionBtn() {
  const handleClick = () => {
    window.dispatchEvent(new Event('open-cart'));
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0055b3] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
    >
      <Plus className="h-4 w-4" />
      Nueva cotización
    </button>
  );
}
