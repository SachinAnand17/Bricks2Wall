'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface GlassSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface GlassSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: GlassSelectOption[];
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  variant?: 'light' | 'dark' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}

export default function GlassSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  menuClassName = '',
  variant = 'light',
  size = 'md',
  disabled = false,
  id,
}: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart dropdown opening direction detection so it never gets clipped or hidden
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 240 && spaceAbove > 240) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  // Size styling
  const sizeStyles = {
    sm: 'h-8 px-2.5 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-3.5 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'h-12 px-4 text-sm rounded-2xl gap-2.5',
  }[size];

  // Variant styling
  const variantStyles = {
    light:
      'bg-white/90 backdrop-blur-md border border-[#C8A45D]/40 hover:border-[#C8A45D] text-navy-midnight shadow-sm',
    dark:
      'bg-[#0B1827]/85 backdrop-blur-md border border-white/20 hover:border-[#C8A45D] text-white shadow-sm',
    glass:
      'bg-canvas-ivory/80 backdrop-blur-md border border-canvas-grey hover:border-[#C8A45D] text-navy-midnight shadow-sm',
  }[variant];

  // Menu popup variant styling
  const menuVariantStyles = {
    light:
      'bg-white/95 backdrop-blur-xl border border-[#C8A45D]/40 text-navy-midnight shadow-2xl',
    dark:
      'bg-[#0B1827]/95 backdrop-blur-xl border border-[#C8A45D]/50 text-white shadow-2xl',
    glass:
      'bg-white/95 backdrop-blur-xl border border-[#C8A45D]/40 text-navy-midnight shadow-2xl',
  }[variant];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${isOpen ? 'z-[100]' : 'z-10'} ${className}`}>
      {/* Trigger Button with Translucent Glass Effect & Rounded Borders */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8A45D]/40 ${sizeStyles} ${variantStyles} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${isOpen ? 'ring-2 ring-[#C8A45D]/40 border-[#C8A45D]' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 text-[#C8A45D] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Translucent Glass Dropdown Menu with High Z-Index so it never gets overwritten or clipped */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 ${
            openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } w-full min-w-[200px] z-[9999] rounded-2xl p-1.5 overflow-hidden shadow-2xl transition-all duration-150 animate-in fade-in zoom-in-95 ${menuVariantStyles} ${menuClassName}`}
        >
          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-all duration-150 text-left ${
                    isSelected
                      ? 'bg-[#FAF6EE] text-[#9E782F] font-bold border border-[#C8A45D]/30 shadow-xs'
                      : variant === 'dark'
                      ? 'text-white/85 hover:bg-white/10 hover:text-white'
                      : 'text-navy-midnight hover:bg-[#FAF6EE]/80 hover:text-[#9E782F]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#B38A38] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
