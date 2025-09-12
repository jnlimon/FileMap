import React from 'react';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm transition-colors">
      <div className="ml-64 flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FileMap</h1>
      </div>
    </header>
  );
}
