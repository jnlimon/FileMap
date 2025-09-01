import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  isVisible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ isVisible, x, y, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-48 transition-colors"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {children}
    </div>
  );
}

interface ContextMenuItemProps {
  onClick: () => void;
  icon?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ContextMenuItem({ onClick, icon, children, disabled = false, className = '' }: ContextMenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function ContextMenuSeparator() {
  return <div className="border-t border-gray-200 dark:border-gray-600 my-1" />;
}
