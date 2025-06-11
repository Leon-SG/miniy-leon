import React from 'react';

const ICONS = [
  { name: 'Facebook', url: '#', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12" /></svg> },
  { name: 'Instagram', url: '#', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1-5.25 5.25A5.25 5.25 0 0 1 12 5.75zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 7.25zm5.25.75a1 1 0 1 1-1 1a1 1 0 0 1 1-1z" /></svg> },
  { name: 'Tiktok', url: '#', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 2A3.5 3.5 0 0 0 14 5.5V17a2.5 2.5 0 1 1-2-2.45V7.5h2V5.5A1.5 1.5 0 0 1 17.5 4h.5V2h-0.5z" /></svg> },
  { name: 'X', url: '#', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.21L22 22h-6.5l-5.18-6.29L4 22H1l7.64-8.73L2 2h6.5l4.93 6.01L17.53 2zm-2.13 16h2.13l-5.5-6.67l-2.13 2.46L15.4 18z" /></svg> },
  { name: 'YouTube', url: '#', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9C16.2 5 12 5 12 5h-.1s-4.2 0-7.1.1c-.4.1-1.2.1-1.9.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.7.8 2.1.9C7.8 19 12 19 12 19s4.2 0 7.1-.1c.4-.1 1.2-.1 1.9-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2zM10 15V9l6 3-6 3z" /></svg> },
];

interface ModernSocialIconsProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

const ModernSocialIcons: React.FC<ModernSocialIconsProps> = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div className="w-full overflow-x-auto flex flex-col gap-3 pb-1 hide-scrollbar">
      {!isCollapsed && (
        <div className="flex gap-3">
          {ICONS.map(icon => (
            <a
              key={icon.name}
              href={icon.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full bg-black border-2 border-[#D4FF00] hover:bg-[#D4FF00] hover:text-black transition-colors w-12 h-12 min-w-[3rem] min-h-[3rem] shadow-md"
              style={{ color: '#D4FF00' }}
              title={icon.name}
            >
              {icon.svg}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full py-2 text-[#D4FF00] font-bold hover:underline"
      >
        {isCollapsed ? 'ℹ️ More Info' : '🛒 Start Shopping'}
      </button>
    </div>
  );
};

export default ModernSocialIcons; 