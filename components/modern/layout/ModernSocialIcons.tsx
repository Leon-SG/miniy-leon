import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaInstagram, 
  FaTiktok, 
  FaTwitter, 
  FaYoutube, 
  FaFacebookF,
  FaPinterestP,
  FaLinkedinIn,
  FaSnapchatGhost,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

interface ModernSocialIconsProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const ModernSocialIcons: React.FC<ModernSocialIconsProps> = ({ isCollapsed, setIsCollapsed }) => {
  const socialLinks = [
    { icon: <FaInstagram className="w-5 h-5" />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaTiktok className="w-5 h-5" />, url: 'https://tiktok.com', label: 'TikTok' },
    { icon: <FaTwitter className="w-5 h-5" />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaYoutube className="w-5 h-5" />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <FaFacebookF className="w-5 h-5" />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaPinterestP className="w-5 h-5" />, url: 'https://pinterest.com', label: 'Pinterest' },
    { icon: <FaLinkedinIn className="w-5 h-5" />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <FaSnapchatGhost className="w-5 h-5" />, url: 'https://snapchat.com', label: 'Snapchat' },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-3">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-black border-2 border-[#D4FF00] text-[#D4FF00] flex items-center justify-center hover:bg-[#D4FF00] hover:text-black transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={social.label}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-8 h-8 rounded-full bg-black border-2 border-[#D4FF00] text-[#D4FF00] flex items-center justify-center hover:bg-[#D4FF00] hover:text-black transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isCollapsed ? "展开" : "折叠"}
      >
        {isCollapsed ? <FaChevronDown className="w-4 h-4" /> : <FaChevronUp className="w-4 h-4" />}
      </motion.button>
    </div>
  );
};

export default ModernSocialIcons; 