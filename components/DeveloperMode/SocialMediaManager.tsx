import React, { useState, useEffect, useCallback } from 'react';
import { BasicInfo } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  DotsSixVertical,
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  PinterestLogo,
  SnapchatLogo,
  WhatsappLogo,
  TelegramLogo,
  RedditLogo,
  DiscordLogo,
  TwitchLogo,
  BehanceLogo,
  DribbbleLogo
} from "@phosphor-icons/react";

interface SocialMediaManagerProps {
  basicInfo: BasicInfo;
  onUpdateBasicInfo: (updatedBasicInfo: BasicInfo) => void;
}

const DRAFT_KEY = 'miniy_draft_socialMediaSettings';

interface SocialPlatformConfig {
  key: keyof BasicInfo;
  label: string;
  placeholder: string;
  iconClass: string;
  activeColorClass: string; 
  darkActiveColorClass?: string; 
}

const socialPlatforms: SocialPlatformConfig[] = [
  { key: 'facebookPageUrl', label: 'Facebook Page URL', placeholder: 'https://facebook.com/yourpage', iconClass: 'ph-facebook-logo', activeColorClass: 'text-blue-600', darkActiveColorClass: 'dark:text-blue-400' },
  { key: 'instagramHandle', label: 'Instagram Handle', placeholder: '@yourhandle', iconClass: 'ph-instagram-logo', activeColorClass: 'text-pink-500', darkActiveColorClass: 'dark:text-pink-400' },
  { key: 'tiktokHandle', label: 'TikTok Handle', placeholder: '@yourtiktok', iconClass: 'ph-tiktok-logo', activeColorClass: 'text-black dark:text-white', darkActiveColorClass: '' }, // Dark handled by text-black dark:text-white
  { key: 'xHandle', label: 'X (Twitter) Handle', placeholder: '@yourxhandle', iconClass: 'ph-x-logo', activeColorClass: 'text-black dark:text-white', darkActiveColorClass: '' },
  { key: 'linkedinPageUrl', label: 'LinkedIn Page URL', placeholder: 'https://linkedin.com/company/yourco', iconClass: 'ph-linkedin-logo', activeColorClass: 'text-blue-700', darkActiveColorClass: 'dark:text-blue-500' },
  { key: 'youtubeChannelUrl', label: 'YouTube Channel URL', placeholder: 'https://youtube.com/c/yourchannel', iconClass: 'ph-youtube-logo', activeColorClass: 'text-red-600', darkActiveColorClass: 'dark:text-red-400' },
  { key: 'pinterestProfileUrl', label: 'Pinterest Profile URL', placeholder: 'https://pinterest.com/yourprofile', iconClass: 'ph-pinterest-logo', activeColorClass: 'text-red-700', darkActiveColorClass: 'dark:text-red-500' },
  { key: 'snapchatUsername', label: 'Snapchat Username', placeholder: 'yoursnapchat', iconClass: 'ph-snapchat-logo', activeColorClass: 'text-yellow-400', darkActiveColorClass: 'dark:text-yellow-300' },
  { key: 'whatsappNumber', label: 'WhatsApp Number', placeholder: '+1234567890 (include country code)', iconClass: 'ph-whatsapp-logo', activeColorClass: 'text-green-500', darkActiveColorClass: 'dark:text-green-400' },
  { key: 'telegramUsername', label: 'Telegram Username', placeholder: '@yourtelegram', iconClass: 'ph-telegram-logo', activeColorClass: 'text-sky-500', darkActiveColorClass: 'dark:text-sky-400' },
  { key: 'redditProfileUrl', label: 'Reddit Profile URL', placeholder: 'https://reddit.com/user/yourprofile', iconClass: 'ph-reddit-logo', activeColorClass: 'text-orange-500', darkActiveColorClass: 'dark:text-orange-400' },
  { key: 'discordServerInviteUrl', label: 'Discord Server Invite URL', placeholder: 'https://discord.gg/yourinvite', iconClass: 'ph-discord-logo', activeColorClass: 'text-indigo-500', darkActiveColorClass: 'dark:text-indigo-400' },
  { key: 'twitchChannelUrl', label: 'Twitch Channel URL', placeholder: 'https://twitch.tv/yourchannel', iconClass: 'ph-twitch-logo', activeColorClass: 'text-purple-600', darkActiveColorClass: 'dark:text-purple-400' },
  { key: 'behanceProfileUrl', label: 'Behance Profile URL', placeholder: 'https://behance.net/yourprofile', iconClass: 'ph-behance-logo', activeColorClass: 'text-blue-800', darkActiveColorClass: 'dark:text-blue-600' },
  { key: 'dribbbleProfileUrl', label: 'Dribbble Profile URL', placeholder: 'https://dribbble.com/yourprofile', iconClass: 'ph-dribbble-logo', activeColorClass: 'text-pink-600', darkActiveColorClass: 'dark:text-pink-400' },
];

const platformIcons: Record<string, React.ElementType> = {
  facebookPageUrl: FacebookLogo,
  instagramHandle: InstagramLogo,
  tiktokHandle: TiktokLogo,
  xHandle: TwitterLogo,
  linkedinPageUrl: LinkedinLogo,
  youtubeChannelUrl: YoutubeLogo,
  pinterestProfileUrl: PinterestLogo,
  snapchatUsername: SnapchatLogo,
  whatsappNumber: WhatsappLogo,
  telegramUsername: TelegramLogo,
  redditProfileUrl: RedditLogo,
  discordServerInviteUrl: DiscordLogo,
  twitchChannelUrl: TwitchLogo,
  behanceProfileUrl: BehanceLogo,
  dribbbleProfileUrl: DribbbleLogo,
};

const getSocialFields = (data: BasicInfo): Partial<BasicInfo> => {
  const relevantFields: (keyof BasicInfo)[] = socialPlatforms.map(p => p.key);
  const socialData: Partial<BasicInfo> = {};
  relevantFields.forEach(key => {
    socialData[key] = data[key];
  });
  return socialData;
};


const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({ basicInfo, onUpdateBasicInfo }) => {
  const [formData, setFormData] = useState<BasicInfo>(basicInfo);
  const { showToast } = useToast();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false); 
  const [connectModalContent, setConnectModalContent] = useState({ title: '', message: '' });
  const [draftActionTaken, setDraftActionTaken] = useState(false); 

  const [previewPlatform, setPreviewPlatform] = useState<'instagram' | 'x'>('instagram');
  const [previewMessage, setPreviewMessage] = useState('');

  // Initialize socialMediaOrder if not exists
  useEffect(() => {
    if (!formData.socialMediaOrder) {
      const defaultOrder = socialPlatforms.map(p => p.key);
      setFormData(prev => ({
        ...prev,
        socialMediaOrder: defaultOrder
      }));
    }
  }, [formData.socialMediaOrder]);

  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      if (window.confirm("You have an unsaved draft for Social Media settings. Would you like to restore it?")) {
        try {
          const parsedDraftSocialFields = JSON.parse(savedDraft) as Partial<BasicInfo>;
           setFormData(prev => ({
            ...prev, 
            ...parsedDraftSocialFields 
          }));
          showToast("Social Media draft restored.", "info");
          setDraftActionTaken(false);
        } catch (e) {
          console.error("Failed to parse Social Media draft:", e);
          localStorage.removeItem(DRAFT_KEY);
        }
      } else {
        localStorage.removeItem(DRAFT_KEY);
        setFormData(prev => ({ ...prev, ...getSocialFields(basicInfo) })); 
        setDraftActionTaken(true);
      }
    } else {
        setDraftActionTaken(false);
    }
  }, [showToast, basicInfo]);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]); 

  useEffect(() => {
    const activeDraft = localStorage.getItem(DRAFT_KEY);
    if (!activeDraft && !draftActionTaken) {
      setFormData(prev => ({
        ...prev, 
        ...getSocialFields(basicInfo) 
      }));
    }
  }, [basicInfo, draftActionTaken]);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value || undefined }; // Store empty string as undefined to clear field
      localStorage.setItem(DRAFT_KEY, JSON.stringify(getSocialFields(newFormData)));
      setDraftActionTaken(false);
      return newFormData;
    });
  };

  const handleDiscardDraft = () => {
    if (window.confirm("Are you sure you want to discard unsaved Social Media settings?")) {
      localStorage.removeItem(DRAFT_KEY);
      setFormData(prev => ({ ...prev, ...getSocialFields(basicInfo) })); 
      showToast("Social Media draft discarded.", "info");
      setDraftActionTaken(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentSocialData = getSocialFields(formData);
    const originalSocialData = getSocialFields(basicInfo);

    if (draftActionTaken && JSON.stringify(currentSocialData) === JSON.stringify(originalSocialData)) {
      showToast("No new changes to save.", "info");
      localStorage.removeItem(DRAFT_KEY);
      setDraftActionTaken(false);
      return;
    }
    
    onUpdateBasicInfo(formData); 
    localStorage.removeItem(DRAFT_KEY);
    showToast("Social Media settings saved!", "success");
    setDraftActionTaken(false);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const allKeys = socialPlatforms.map(p => p.key);
    const items = Array.from(formData.socialMediaOrder || allKeys);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // 先保留拖拽顺序，再补全遗漏的 key
    const newOrder = items.filter((key, idx) => items.indexOf(key) === idx && allKeys.includes(key));
    allKeys.forEach(key => {
      if (!newOrder.includes(key)) newOrder.push(key);
    });
    setFormData(prev => ({
      ...prev,
      socialMediaOrder: newOrder
    }));
  };

  // 计算排序后的 socialPlatforms
  const orderedPlatforms = (formData.socialMediaOrder && formData.socialMediaOrder.length === socialPlatforms.length)
    ? formData.socialMediaOrder.map(key => socialPlatforms.find(p => p.key === key)).filter(Boolean)
    : socialPlatforms;

  const hasUnsavedChanges = localStorage.getItem(DRAFT_KEY) !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Social Profiles Section */}
      <section className="p-6 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
        <h3 className="text-lg font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-5 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Social Media Profiles</h3>
        <p className="text-sm text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-6 -mt-3">Link your store's social media accounts. Drag and drop to reorder the platforms.</p>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="social-platforms">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {orderedPlatforms.map((platform, index) => (
                  <Draggable key={platform.key} draggableId={platform.key} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border mb-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center w-6 h-6 rounded cursor-move hover:bg-gray-100 dark:hover:bg-replit-dark-border-muted"
                          >
                            <DotsSixVertical className="text-TEXT_MUTED dark:text-replit-dark-text-disabled" size={22} />
                          </div>
                          <label htmlFor={platform.key} className="block text-sm font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{platform.label}</label>
                        </div>
                        <div className="flex items-center">
                          <span className={`p-2.5 bg-gray-50 dark:bg-replit-dark-border border border-r-0 border-BORDER_DEFAULT dark:border-replit-dark-border rounded-l-md text-PRIMARY_MAIN dark:text-replit-primary-blue`}>
                            {(() => {
                              const IconComponent = platformIcons[platform.key];
                              return IconComponent ? <IconComponent size={22} className="text-PRIMARY_MAIN dark:text-replit-primary-blue" /> : null;
                            })()}
                          </span>
                          <Input
                            id={platform.key}
                            name={platform.key}
                            value={(formData[platform.key] as string) || ''}
                            onChange={handleFormChange}
                            placeholder={platform.placeholder}
                            className="rounded-l-none flex-grow !py-[9px]"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      {/* Content Tools Section */}
      <section className="p-6 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
        <h3 className="text-lg font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-5 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Content Tools</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-1">Post Previewer (Simulated)</h4>
            <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-2">See a basic preview of how your message might look.</p>
            <div className="flex space-x-2 mb-2">
              <Button type="button" size="sm" variant={previewPlatform === 'instagram' ? 'primary' : 'ghost'} onClick={() => setPreviewPlatform('instagram')}>Instagram</Button>
              <Button type="button" size="sm" variant={previewPlatform === 'x' ? 'primary' : 'ghost'} onClick={() => setPreviewPlatform('x')}>X (Twitter)</Button>
            </div>
            <Input
              type="text"
              value={previewMessage}
              onChange={(e) => setPreviewMessage(e.target.value)}
              placeholder="Type your sample post message..."
            />
            {previewMessage && (
              <div className="mt-3 p-3 border border-BORDER_DEFAULT dark:border-replit-dark-border rounded-md bg-gray-50 dark:bg-replit-dark-border-muted">
                <div className="flex items-start space-x-2">
                  <span className={`p-1.5 rounded-full ${previewPlatform === 'instagram' ? 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500' : 'bg-black dark:bg-white'}`}>
                    <i className={`${previewPlatform === 'instagram' ? 'ph-instagram-logo' : 'ph-x-logo'} ${previewPlatform === 'instagram' ? 'text-white' : 'text-white dark:text-black'} text-sm`}></i>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">
                      {formData.storeName || "YourStore"} 
                      {previewPlatform === 'instagram' && formData.instagramHandle && ` (@${formData.instagramHandle.replace('@','')})`}
                      {previewPlatform === 'x' && formData.xHandle && ` (@${formData.xHandle.replace('@','')})`}
                    </p>
                    <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mt-0.5 whitespace-pre-wrap break-words">{previewMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-md">
            <h4 className="text-md font-medium text-blue-700 dark:text-blue-300 mb-1">Scheduling Tip</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400">Use third-party tools like Buffer, Hootsuite, or Later to schedule your social media posts in advance and save time!</p>
          </div>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6 border-t border-BORDER_DEFAULT dark:border-replit-dark-border">
        <div className="flex-grow">
         {hasUnsavedChanges && (
            <Button type="button" variant="ghost" size="sm" onClick={handleDiscardDraft} className="text-ERROR_RED hover:bg-ERROR_RED/10 dark:text-replit-dark-red dark:hover:bg-replit-dark-red/20">
              Discard Unsaved Changes
            </Button>
          )}
        </div>
        <Button type="submit" variant="primary" size="lg">
          Save Social Media Settings
        </Button>
      </div>

      <Modal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} title={connectModalContent.title} size="md">
        <div className="p-4 text-center">
          <LoadingSpinner text="Processing..." size="md" />
          <p className="mt-4 text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{connectModalContent.message}</p>
        </div>
      </Modal>
    </form>
  );
};

export default SocialMediaManager;
