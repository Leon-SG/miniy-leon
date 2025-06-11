import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { SERVER_PLANS, DEPLOYMENT_REGIONS, BACKUP_FREQUENCIES } from '../../constants';

interface DeploymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (settings: DeploymentSettings) => void;
  currentStoreName?: string;
}

export interface DeploymentSettings {
  domainType: 'subdomain' | 'custom';
  subdomainName: string;
  customDomainName: string;
  serverPlan: string;
  elasticScaling: boolean;
  deploymentRegion: string;
  backupFrequency: string;
}

// 生成随机子域名的函数
const generateRandomSubdomain = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = Math.floor(Math.random() * 5) + 4; // 4-8个字符
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const DeploymentSettingsModal: React.FC<DeploymentSettingsModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
  currentStoreName = "my-store"
}) => {
  const [settings, setSettings] = useState<DeploymentSettings>({
    domainType: 'subdomain',
    subdomainName: generateRandomSubdomain(),
    customDomainName: '',
    serverPlan: SERVER_PLANS[0].value,
    elasticScaling: true,
    deploymentRegion: DEPLOYMENT_REGIONS[0].value,
    backupFrequency: BACKUP_FREQUENCIES[0].value,
  });

  useEffect(() => {
    if (isOpen) {
      setSettings(prev => ({
        ...prev,
        subdomainName: generateRandomSubdomain(),
      }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setSettings(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
      // Reset other domain field when type changes
      subdomainName: value === 'subdomain' ? generateRandomSubdomain() : '',
      customDomainName: value === 'custom' ? prev.customDomainName : '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation for subdomain name
    if (settings.domainType === 'subdomain') {
      const sanitizedSubdomain = settings.subdomainName.toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (sanitizedSubdomain !== settings.subdomainName || settings.subdomainName.length < 3) {
        alert("Subdomain name can only contain lowercase letters, numbers, and hyphens, and must be at least 3 characters long.");
        setSettings(prev => ({ ...prev, subdomainName: sanitizedSubdomain }));
        return;
      }
       settings.subdomainName = sanitizedSubdomain;
    }
    onDeploy(settings);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deploy Your Store" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Domain Configuration */}
        <section>
          <h3 className="text-md font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-2">Domain Configuration</h3>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">Choose Domain Type:</label>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <label className="flex items-center space-x-2 p-2 border border-BORDER_DEFAULT rounded-md hover:border-PRIMARY_MAIN cursor-pointer has-[:checked]:border-PRIMARY_MAIN has-[:checked]:ring-1 has-[:checked]:ring-PRIMARY_MAIN flex-1">
                <input
                  type="radio"
                  name="domainType"
                  value="subdomain"
                  checked={settings.domainType === 'subdomain'}
                  onChange={handleRadioChange}
                  className="form-radio h-4 w-4 text-PRIMARY_MAIN focus:ring-PRIMARY_MAIN"
                />
                <span className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">Free Subdomain</span>
              </label>
              <label className="flex items-center space-x-2 p-2 border border-BORDER_DEFAULT rounded-md hover:border-PRIMARY_MAIN cursor-pointer has-[:checked]:border-PRIMARY_MAIN has-[:checked]:ring-1 has-[:checked]:ring-PRIMARY_MAIN flex-1">
                <input
                  type="radio"
                  name="domainType"
                  value="custom"
                  checked={settings.domainType === 'custom'}
                  onChange={handleRadioChange}
                  className="form-radio h-4 w-4 text-PRIMARY_MAIN focus:ring-PRIMARY_MAIN"
                />
                <span className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">Custom Domain</span>
              </label>
            </div>

            {settings.domainType === 'subdomain' && (
              <div className="mt-3 flex items-center space-x-1">
                <Input
                  name="subdomainName"
                  value={settings.subdomainName}
                  onChange={handleChange}
                  placeholder="your-store-name"
                  className="rounded-r-none flex-grow"
                  maxLength={8}
                />
                <span className="px-3 py-2 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg text-TEXT_MUTED dark:text-replit-dark-text-disabled border border-l-0 border-BORDER_DEFAULT dark:border-replit-dark-border rounded-r-md text-sm">.miniy.app</span>
              </div>
            )}
            {settings.domainType === 'custom' && (
              <Input
                name="customDomainName"
                value={settings.customDomainName}
                onChange={handleChange}
                placeholder="e.g., www.yourstore.com"
                type="text"
                className="mt-3"
              />
            )}
          </div>
        </section>

        {/* Server & Performance */}
        <section>
          <h3 className="text-md font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-2">Server & Performance</h3>
          <div className="space-y-3">
            <Select
              label="Server Plan (Estimated Traffic)"
              name="serverPlan"
              value={settings.serverPlan}
              onChange={handleChange}
              options={SERVER_PLANS}
            />
            <div className="flex items-center pt-1">
              <input
                id="elasticScaling"
                name="elasticScaling"
                type="checkbox"
                checked={settings.elasticScaling}
                onChange={handleChange}
                className="h-4 w-4 text-PRIMARY_MAIN border-BORDER_DEFAULT rounded focus:ring-PRIMARY_MAIN"
              />
              <label htmlFor="elasticScaling" className="ml-2 block text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">
                Enable Elastic Scaling (Recommended for variable traffic)
              </label>
            </div>
          </div>
        </section>

        {/* Deployment Region & Backups */}
         <section>
          <h3 className="text-md font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-2">Region & Backups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Deployment Region"
              name="deploymentRegion"
              value={settings.deploymentRegion}
              onChange={handleChange}
              options={DEPLOYMENT_REGIONS}
            />
            <Select
              label="Automated Backups"
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
              options={BACKUP_FREQUENCIES}
            />
          </div>
        </section>


        <div className="flex justify-end space-x-3 pt-4 border-t border-BORDER_DEFAULT mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Deploy Now
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeploymentSettingsModal;
