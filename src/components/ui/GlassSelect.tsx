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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Synchronous direction check on toggle so menu opens naturally with zero jumping
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Default natural downward opening; only flip upward if space below is genuinely tight
      setOpenUpwards(spaceBelow < 200 && spaceAbove > 220);
      const currentIndex = options.findIndex((o) => o.value === value);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
    setIsOpen((prev) => !prev);
  };

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

  // Keyboard navigation for natural dropdown feel (Arrows, Enter, Escape, Tab)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1 < options.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        handleSelect(options[focusedIndex].value);
      }
    }
  };

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
      'bg-white border border-[#C8A45D]/40 hover:border-[#C8A45D] text-navy-midnight shadow-sm',
    dark:
      'bg-[#0B1827] border border-white/20 hover:border-[#C8A45D] text-white shadow-sm',
    glass:
      'bg-canvas-ivory border border-canvas-grey hover:border-[#C8A45D] text-navy-midnight shadow-sm',
  }[variant];

  // Menu popup variant styling - Fully opaque solid backgrounds with crisp luxury shadows
  const menuVariantStyles = {
    light:
      'bg-white border border-[#C8A45D]/40 text-navy-midnight shadow-[0_16px_40px_rgba(16,36,58,0.22)]',
    dark:
      'bg-[#0B1827] border border-[#C8A45D]/50 text-white shadow-[0_16px_40px_rgba(0,0,0,0.7)]',
    glass:
      'bg-white border border-[#C8A45D]/40 text-navy-midnight shadow-[0_16px_40px_rgba(16,36,58,0.22)]',
  }[variant];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-block w-full ${isOpen ? 'z-50' : 'z-10'} ${className}`}
    >
      {/* Trigger Button with Translucent Glass Effect & Rounded Borders */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
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

      {/* Solid Opaque Dropdown Menu with High Z-Index so it never gets clipped or split */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          className={`absolute left-0 ${
            openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } min-w-full w-max max-w-[min(26rem,calc(100vw-2rem))] z-[9999] rounded-2xl p-1.5 overflow-hidden shadow-2xl transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${menuVariantStyles} ${menuClassName}`}
        >
          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isFocused = focusedIndex === idx;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs sm:text-sm rounded-xl font-medium transition-colors text-left cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#FAF6EE] text-[#9E782F] font-bold border border-[#C8A45D]/40 shadow-xs'
                      : isFocused
                      ? variant === 'dark'
                        ? 'bg-white/10 text-white'
                        : 'bg-[#FAF6EE] text-[#9E782F]'
                      : variant === 'dark'
                      ? 'text-white/85 hover:bg-white/10 hover:text-white'
                      : 'text-navy-midnight hover:bg-[#FAF6EE] hover:text-[#9E782F]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#B38A38] shrink-0 ml-3" />
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
