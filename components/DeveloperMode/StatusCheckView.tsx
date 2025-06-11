
import React, { useState, useEffect } from 'react';
import { ServiceStatusItem, ServiceCurrentStatus } from '../../types';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { ArrowPathIcon } from '../../constants';
import { CheckCircleIcon as SolidCheckCircleIcon, ExclamationTriangleIcon as SolidExclamationTriangleIcon, XCircleIcon as SolidXCircleIcon, InformationCircleIcon as SolidInformationCircleIcon } from '@heroicons/react/24/solid';

const MOCKED_SERVICES_CONFIG: { id: string; name: string }[] = [
  { id: 'api_gateway', name: 'API Gateway' },
  { id: 'database_service', name: 'Database Service' },
  { id: 'payment_processor', name: 'Payment Processor API' },
  { id: 'inventory_sync', name: 'Inventory Sync Service' },
  { id: 'email_delivery', name: 'Email Delivery Service' },
  { id: 'ai_model_endpoint', name: 'AI Model Endpoint' },
  { id: 'cdn_service', name: 'Content Delivery Network (CDN)'},
  { id: 'auth_service', name: 'Authentication Service'},
];

const getRandomStatus = (): ServiceCurrentStatus => {
  const statuses: ServiceCurrentStatus[] = ['Operational', 'Operational', 'Operational', 'Operational', 'Degraded', 'Offline'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getStatusDetails = (status: ServiceCurrentStatus): string | undefined => {
    switch (status) {
        case 'Degraded':
            const degradedDetails = ["High latency reported.", "Partial outage.", "Experiencing intermittent errors."];
            return degradedDetails[Math.floor(Math.random() * degradedDetails.length)];
        case 'Offline':
            const offlineDetails = ["Service unreachable.", "Maintenance in progress.", "Critical error detected."];
            return offlineDetails[Math.floor(Math.random() * offlineDetails.length)];
        default:
            return undefined;
    }
}

const StatusCheckView: React.FC = () => {
  const [services, setServices] = useState<ServiceStatusItem[]>(() =>
    MOCKED_SERVICES_CONFIG.map(service => ({
      ...service,
      status: 'Operational',
      lastChecked: new Date(),
      details: undefined,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAllChecks = async () => {
    setIsLoading(true);
    setServices(prevServices =>
      prevServices.map(service => ({
        ...service,
        status: 'Checking',
        lastChecked: new Date(),
        details: undefined,
      }))
    );

    // Simulate API calls for each service
    const promises = services.map(service =>
      new Promise<ServiceStatusItem>(resolve => {
        setTimeout(() => {
          const newStatus = getRandomStatus();
          resolve({
            ...service,
            status: newStatus,
            details: getStatusDetails(newStatus),
            lastChecked: new Date(),
          });
        }, Math.random() * 1500 + 500); // Random delay between 0.5s and 2s
      })
    );

    const updatedServices = await Promise.all(promises);
    
    const finalServicesState: ServiceStatusItem[] = MOCKED_SERVICES_CONFIG.map(configService => {
        const updated = updatedServices.find(us => us.id === configService.id);
        if (updated) {
            return updated;
        } else {
            const fallbackService: ServiceStatusItem = {
                id: configService.id,
                name: configService.name,
                status: 'Offline', 
                details: 'Failed to update status.',
                lastChecked: new Date()
            };
            return fallbackService;
        }
    });

    setServices(finalServicesState);
    setIsLoading(false);
  };
  
  const getStatusIcon = (status: ServiceCurrentStatus) => {
    switch (status) {
      case 'Operational':
        return <SolidCheckCircleIcon className="w-5 h-5 text-SUCCESS_GREEN dark:text-replit-dark-green" />;
      case 'Degraded':
        return <SolidExclamationTriangleIcon className="w-5 h-5 text-yellow-500 dark:text-replit-dark-yellow" />;
      case 'Offline':
        return <SolidXCircleIcon className="w-5 h-5 text-ERROR_RED dark:text-replit-dark-red" />;
      case 'Checking':
        return <LoadingSpinner size="sm" color="text-blue-500 dark:text-replit-primary-blue" />;
      default:
        return <SolidInformationCircleIcon className="w-5 h-5 text-TEXT_MUTED dark:text-replit-dark-text-disabled" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-4">
        <div>
            <h2 className="text-2xl font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">System Status Dashboard</h2>
            <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mt-1">Monitor the health of your store's backend services (Simulated).</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleRunAllChecks} 
          disabled={isLoading}
          leftIcon={isLoading ? <LoadingSpinner size="sm" color="text-white" /> : <ArrowPathIcon className="w-5 h-5" />}
          className="mt-3 sm:mt-0"
        >
          {isLoading ? 'Running Checks...' : 'Run All Checks'}
        </Button>
      </div>

      <div className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-xl border border-BORDER_DEFAULT dark:border-replit-dark-border">
        <ul role="list" className="divide-y divide-BORDER_DEFAULT dark:divide-replit-dark-border">
          {services.map(service => (
            <li key={service.id} className="px-4 py-3 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-replit-dark-bg/20 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="mr-3 flex-shrink-0">{getStatusIcon(service.status)}</span>
                  <p className="text-sm font-medium text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate mr-2">{service.name}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 w-full sm:w-auto">
                    <div className="min-w-0 flex-1 sm:min-w-[180px]">
                        <p className={`text-sm font-semibold truncate ${
                            service.status === 'Operational' ? 'text-SUCCESS_GREEN dark:text-replit-dark-green' :
                            service.status === 'Degraded' ? 'text-yellow-500 dark:text-replit-dark-yellow' :
                            service.status === 'Offline' ? 'text-ERROR_RED dark:text-replit-dark-red' :
                            'text-blue-500 dark:text-replit-primary-blue'
                            }`}>
                            {service.status}
                        </p>
                        {service.details && <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled truncate">{service.details}</p>}
                    </div>
                    <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mt-1 sm:mt-0 sm:text-right w-full sm:w-auto flex-shrink-0">
                        Last checked: {service.lastChecked ? service.lastChecked.toLocaleTimeString() : 'N/A'}
                    </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
       <p className="text-xs text-center text-TEXT_MUTED dark:text-replit-dark-text-disabled">
            Note: This is a simulated status dashboard for demonstration purposes.
        </p>
    </div>
  );
};

export default StatusCheckView;
// End of file
