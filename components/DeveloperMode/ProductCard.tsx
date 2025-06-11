import React from 'react';
import { Product } from '../../types';
import Button from '../common/Button';
import { EditIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '../../constants';
import ToggleSwitch from '../common/ToggleSwitch'; // Import the new ToggleSwitch

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onMove: (productId: string, direction: 'up' | 'down') => void;
  onToggleFeature: (productId: string) => void;
  onTogglePublish: (productId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onMove, 
  onToggleFeature,
  onTogglePublish,
  isFirst, 
  isLast 
}) => {
  return (
    <div className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-xl border border-BORDER_DEFAULT dark:border-replit-dark-border">
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0 border border-BORDER_DEFAULT dark:border-replit-dark-border mb-3 sm:mb-0"
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/placeholder_prod/100/100')}
        />
        <div className="flex-grow min-w-0 flex flex-col justify-between w-full">
          {/* Product Info Section */}
          <div>
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mr-2 truncate">{product.name}</h3>
            </div>
            <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary line-clamp-2 break-words mb-1">{product.description}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-2">
              <span>Price: <span className="font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{typeof product.price === 'number' && !isNaN(product.price) ? `$${product.price.toFixed(2)}` : 'N/A'}</span></span>
              {product.category && <span>Category: <span className="font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{product.category}</span></span>}
              {product.sku && <span>SKU: <span className="font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{product.sku}</span></span>}
              <span>Stock: <span className="font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{product.stockQuantity ?? 'N/A'}</span></span>
              {product.tags && product.tags.length > 0 && (
                <span className="truncate">Tags: <span className="font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{product.tags.join(', ')}</span></span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <ToggleSwitch
                id={`publish-toggle-${product.id}`}
                checked={product.isPublished || false}
                onChange={() => onTogglePublish(product.id)}
                label={product.isPublished ? "Published" : "Draft"}
                labelPosition="right"
                size="sm"
              />
              <ToggleSwitch
                id={`feature-toggle-${product.id}`}
                checked={product.isFeatured || false}
                onChange={() => onToggleFeature(product.id)}
                label={product.isFeatured ? "Featured" : "Not Featured"}
                labelPosition="right"
                size="sm"
              />
            </div>
          </div>

          {/* Action Buttons Section - Minimized and at bottom-right of this info container */}
          <div className="flex items-center space-x-0.5 self-end mt-3">
            <Button 
              variant="ghost" 
              onClick={() => onMove(product.id, 'up')} 
              disabled={isFirst} 
              aria-label="Move product up"
              className="p-1.5 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-gray-100 dark:hover:bg-replit-dark-border-muted"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onMove(product.id, 'down')} 
              disabled={isLast} 
              aria-label="Move product down"
              className="p-1.5 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-gray-100 dark:hover:bg-replit-dark-border-muted"
            >
              <ArrowDownIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onEdit(product)} 
              aria-label={`Edit ${product.name}`}
              className="p-1.5 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-gray-100 dark:hover:bg-replit-dark-border-muted ml-1" 
            >
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onDelete(product.id)} 
              className="p-1.5 text-ERROR_RED hover:bg-ERROR_RED/10 dark:text-replit-dark-red dark:hover:bg-replit-dark-red/20" 
              aria-label={`Delete ${product.name}`}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
// End of file
