import React from 'react';
import { CardContent, CardOption, VisualCardOption, ConfirmationDetails, ProductDisplayInfo } from '../types';
import Button from './common/Button';
import ColorSwatch from './common/ColorSwatch';
import { ClashGroteskDisplayIcon, InterDisplayIcon, PackageIcon, FileTextIcon } from '../constants';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon as SolidCheckCircleIcon, XCircleIcon as SolidXCircleIcon } from '@heroicons/react/24/solid';

interface AICardMessageProps {
  cardContent: CardContent;
  onAction: (actionId: string, value?: string | number | boolean) => void;
}

const AICardMessage: React.FC<AICardMessageProps> = ({ cardContent, onAction }) => {
  let statusBorderClass = 'border-BORDER_DEFAULT dark:border-replit-dark-border'; 
  let StatusIconComponent: React.FC<React.SVGProps<SVGSVGElement>> | null = null;
  let statusIconColor = 'text-TEXT_SECONDARY dark:text-replit-dark-text-secondary'; 
  let titleColorClass = 'text-TEXT_PRIMARY dark:text-replit-dark-text-main'; 
  let descriptionColorClass = 'text-TEXT_SECONDARY dark:text-replit-dark-text-secondary'; 
  let cardBgClass = 'bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg'; 

  const hasInteraction = !!(cardContent.options || cardContent.visualOptions || cardContent.confirmation);
  let visualStyleType: 'green' | 'blue' | 'yellow' | 'red' | 'defaultStyle' = 'defaultStyle';

  if (hasInteraction) {
    if (cardContent.status === 'error' || (cardContent.status === 'warning' && cardContent.confirmation)) {
      visualStyleType = 'red';
    } else {
      visualStyleType = 'yellow';
    }
  } else {
    if (cardContent.status === 'success') visualStyleType = 'green';
    else if (cardContent.status === 'info') visualStyleType = 'blue';
    else if (cardContent.status === 'warning') visualStyleType = 'yellow';
    else if (cardContent.status === 'error') visualStyleType = 'red';
    else visualStyleType = 'defaultStyle';
  }

  switch (visualStyleType) {
    case 'green':
      statusBorderClass = 'border-l-[3px] border-SUCCESS_GREEN dark:border-replit-dark-green';
      StatusIconComponent = SolidCheckCircleIcon;
      statusIconColor = 'text-SUCCESS_GREEN dark:text-replit-dark-green';
      break;
    case 'blue':
      statusBorderClass = 'border-l-[3px] border-INFO_BLUE dark:border-replit-dark-link-blue';
      StatusIconComponent = InformationCircleIcon;
      statusIconColor = 'text-INFO_BLUE dark:text-replit-dark-link-blue';
      break;
    case 'yellow':
      statusBorderClass = 'border-l-[3px] border-WARNING_YELLOW dark:border-replit-dark-yellow';
      StatusIconComponent = ExclamationTriangleIcon;
      statusIconColor = 'text-WARNING_YELLOW dark:text-replit-dark-yellow';
      break;
    case 'red':
      statusBorderClass = 'border-l-[3px] border-ERROR_RED dark:border-replit-dark-red';
      StatusIconComponent = SolidXCircleIcon;
      statusIconColor = 'text-ERROR_RED dark:text-replit-dark-red';
      break;
    case 'defaultStyle':
    default:
      // Use BORDER_DEFAULT dark:border-replit-dark-border from cardBgClass line
      break;
  }

  let titleIcon = null;
  const titleIconBaseClass = `w-4 h-4 ${statusIconColor} mr-2 mt-0.5 flex-shrink-0`;
  if (visualStyleType === 'defaultStyle') { // Only show generic icons if no status icon
    if (cardContent.products && cardContent.products.length > 0) {
      titleIcon = <PackageIcon className={titleIconBaseClass} />;
    } else if (cardContent.documentName) {
      titleIcon = <FileTextIcon className={titleIconBaseClass} />;
    }
  }


  return (
    <div className={`${cardBgClass} p-1.5 rounded border ${statusBorderClass} shadow-none min-w-0 max-w-[70%] ml-0 my-1.5`} style={{ fontSize: '12px', boxShadow: 'none', borderRadius: '7px', borderWidth: '1px' }}>
      {cardContent.imageUrl && (
        <img
          src={cardContent.imageUrl}
          alt={cardContent.title || 'Card image'}
          className="w-full h-auto max-h-24 object-contain rounded mb-1 border border-BORDER_DEFAULT dark:border-replit-dark-border"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="flex items-start">
        {StatusIconComponent && (
          <StatusIconComponent className={`w-4 h-4 ${statusIconColor} mr-1 mt-0.5 flex-shrink-0`} />
        )}
        {!StatusIconComponent && titleIcon && titleIcon}
        <div className="flex-grow min-w-0">
          <h4 className={`text-xs font-medium ${titleColorClass} mb-0.5 truncate`}>{cardContent.title}</h4>
        </div>
      </div>
      {cardContent.description && (
        <p className={`text-xs ${descriptionColorClass} mb-1 ${StatusIconComponent || titleIcon ? 'ml-[20px]' : ''}`}>{cardContent.description}</p>
      )}

      {cardContent.products && cardContent.products.length > 0 && (
        <div className={`my-1 space-y-1 p-1 bg-BACKGROUND_MAIN dark:bg-replit-dark-bg rounded border border-BORDER_DEFAULT dark:border-replit-dark-border ${StatusIconComponent || titleIcon ? 'ml-[20px]' : ''}`}>
          <p className={`text-xs font-medium ${descriptionColorClass} mb-1`}>Created Product(s):</p>
          {cardContent.products.map((product: ProductDisplayInfo) => (
            <div key={product.id} className={`flex items-center space-x-2 p-1 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded border border-BORDER_DEFAULT dark:border-replit-dark-border`}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-7 h-7 object-cover rounded-sm border border-BORDER_DEFAULT dark:border-replit-dark-border flex-shrink-0"
                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/product_placeholder/80/80')}
              />
              <div className="min-w-0 flex-grow">
                <p className={`text-xs font-medium ${titleColorClass} truncate`}>{product.name}</p>
                <p className="text-xs text-PRIMARY_MAIN dark:text-replit-primary-blue">{typeof product.price === 'number' && !isNaN(product.price) ? `$${product.price.toFixed(2)}` : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {cardContent.options && cardContent.options.length > 0 && (
        <div className={`space-y-1 mt-1 ${StatusIconComponent || titleIcon ? 'ml-[20px]' : ''}`}>
          {cardContent.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAction(option.actionId, option.value)}
              variant={option.variant === 'primary' ? 'primary' : (option.variant === 'danger' ? 'danger' : 'secondary')}
              size="sm"
              className="w-full justify-center !text-xs"
              title={option.label}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}

      {cardContent.visualOptions && cardContent.visualOptions.length > 0 && (
        <div className={`space-y-1 mt-1 ${StatusIconComponent || titleIcon ? 'ml-[20px]' : ''}`}>
          {cardContent.visualOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => onAction(option.actionId, option.value)}
              className={`w-full text-left p-1 rounded-md hover:bg-BORDER_DEFAULT/30 dark:hover:bg-replit-dark-border/30 transition-colors duration-150 flex items-center text-xs ${descriptionColorClass} border border-BORDER_DEFAULT dark:border-replit-dark-border focus:outline-none focus:ring-1 focus:ring-replit-primary-blue`}
              title={`Select ${option.label}`}
              aria-label={`Select ${option.label}`}
            >
              {option.color && <ColorSwatch color={option.color} size="sm" className="mr-2 flex-shrink-0" />}
              {option.fontFamily === 'Clash Grotesk' && <ClashGroteskDisplayIcon className="mr-1.5 flex-shrink-0 !w-4 !h-4" />}
              {option.fontFamily === 'Inter' && <InterDisplayIcon className="mr-1.5 flex-shrink-0 !w-4 !h-4" />}
              <span className="truncate flex-grow">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {cardContent.confirmation && (
        <div className={`mt-2 pt-1 border-t border-BORDER_DEFAULT dark:border-replit-dark-border space-y-1 sm:space-y-0 sm:flex sm:justify-end sm:space-x-2 ${StatusIconComponent || titleIcon ? 'ml-[20px]' : ''}`}>
          <Button
            onClick={() => onAction(cardContent.confirmation!.cancelActionId)}
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto !text-xs"
          >
            {cardContent.confirmation.cancelLabel}
          </Button>
          <Button
            onClick={() => onAction(cardContent.confirmation!.confirmActionId)}
            variant={cardContent.confirmation.confirmVariant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            className="w-full sm:w-auto !text-xs"
          >
            {cardContent.confirmation.confirmLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AICardMessage;