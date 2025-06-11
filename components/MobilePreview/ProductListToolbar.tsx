import React from 'react';
import { AppearanceSettings } from '../../types';
import { SORT_OPTIONS } from '../../constants'; // Ensure this path is correct

interface ProductListToolbarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortByOptions: typeof SORT_OPTIONS;
  currentSortBy: string;
  onSortByChange: (sortBy: string) => void;
  appearance: AppearanceSettings;
}

const ProductListToolbar: React.FC<ProductListToolbarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortByOptions,
  currentSortBy,
  onSortByChange,
  appearance,
}) => {
  const selectBaseClasses = "text-xs px-2 py-1 rounded-md border focus:outline-none focus:ring-1";
  const selectThemeClasses = `
    bg-BACKGROUND_MAIN dark:bg-DARK_BACKGROUND_CONTENT 
    border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT 
    text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY 
    focus:ring-[${appearance.primaryColor}] focus:border-[${appearance.primaryColor}]
  `;

  // Note: The `top` value for sticky positioning is now dynamically calculated in MobilePreview.tsx
  // and applied via style prop to this component's wrapper if needed, or this component is placed
  // in the layout flow after the header. Here, we assume it's placed in flow.
  // If direct styling is needed here, headerHeight would be a prop.
  // For now, the parent MobilePreview.tsx handles the layout.
  return (
    <div className="product-list-toolbar" style={{ background: '#181818', borderRadius: '28px', padding: '16px', marginBottom: 24, color: '#fff', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div className="flex-1 min-w-0">
        <label htmlFor="category-filter" className="sr-only">Filter by category</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={`${selectBaseClasses} ${selectThemeClasses} w-full sm:w-auto`}
          style={{
            color: appearance.primaryColor,
            borderColor: `${appearance.primaryColor}60`, // Using primary color for border with opacity
          }}
          aria-label="Filter by category"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'All' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-0">
        <label htmlFor="sort-by" className="sr-only">Sort by</label>
        <select
          id="sort-by"
          value={currentSortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className={`${selectBaseClasses} ${selectThemeClasses} w-full sm:w-auto`}
           style={{
            color: appearance.primaryColor,
            borderColor: `${appearance.primaryColor}60`,
          }}
          aria-label="Sort products by"
        >
          {sortByOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductListToolbar;
