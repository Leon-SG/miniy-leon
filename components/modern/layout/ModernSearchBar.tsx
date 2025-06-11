import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ModernSearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full flex items-center rounded-2xl bg-black border-2 border-[#D4FF00] px-4 py-2 shadow-md">
      <MagnifyingGlassIcon className="w-5 h-5 text-[#D4FF00] mr-2" />
      <input
        className="flex-1 bg-transparent outline-none text-base text-[#D4FF00] placeholder-[#B6FF5A] font-semibold"
        style={{ fontFamily: 'inherit' }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '搜索商品或分类...'}
        autoComplete="off"
      />
    </div>
  );
};

export default ModernSearchBar; 