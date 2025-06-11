import React, { useMemo } from 'react';
import { Product, AppearanceSettings } from '../../../types';
import { SORT_OPTIONS } from '../../../constants';
import ModernProductCard from './ModernProductCard';

interface ModernProductListProps {
  products?: Product[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  searchTerm: string;
  isSearchActive: boolean;
  appearance: AppearanceSettings;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => boolean;
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null;
}

// Brand logo data
const BRANDS = [
  { name: 'SONY', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sony_logo.svg' },
  { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/LG_logo_%282015%29.svg' },
  { name: 'JBL', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/JBL_logo.svg' },
  { name: 'WAikiki', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/LC_Waikiki_logo.svg' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
];

const ModernProductList: React.FC<ModernProductListProps> = ({
  products = [],
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  searchTerm,
  isSearchActive,
  appearance,
  onProductClick,
  onAddToCart,
  isElementSelectionActive = false,
  onElementSelected = () => {},
  activelySelectedPreviewElementId,
}) => {
  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let productsToDisplay = [...products];

    // Search filter
    if (searchTerm && isSearchActive) {
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      productsToDisplay = productsToDisplay.filter(product => 
        product.category === selectedCategory
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        productsToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        productsToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        productsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return productsToDisplay;
  }, [products, searchTerm, isSearchActive, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* 分类和排序工具栏 */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-6">
        {/* 分类选择 */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors border-2 ${
                selectedCategory === category
                  ? 'bg-[#D4FF00] text-black border-[#D4FF00]' : 'bg-[#222] text-[#D4FF00] border-[#D4FF00] hover:bg-[#D4FF00] hover:text-black'
              }`}
              style={{ minWidth: 48 }}
            >
              {category === 'All' ? 'All 🛍️' : category}
            </button>
          ))}
        </div>

        {/* 排序选择 */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl border-2 text-sm font-bold bg-[#222] text-[#D4FF00] border-[#D4FF00] focus:outline-none focus:ring-2"
          style={{ minWidth: 120 }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} style={{ color: '#222' }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 商品列表 */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ModernProductCard
              key={product.id}
              product={product}
              appearance={appearance}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              isElementSelectionActive={isElementSelectionActive}
              onElementSelected={onElementSelected}
              activelySelectedPreviewElementId={activelySelectedPreviewElementId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-14 w-14 text-[#FFD600]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-[#FFD600]">No products found 🧐</h3>
          <p className="mt-2 text-lg text-[#FFD600] opacity-80">
            Try another keyword or category!
          </p>
        </div>
      )}
      {/* 品牌横滑区 */}
      <div className="w-full mt-8">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-lg font-bold text-[#D4FF00]">Top Brands</span>
          <a href="#" className="text-[#D4FF00] text-sm opacity-80 hover:underline">See All</a>
        </div>
        <div className="w-full overflow-x-auto flex gap-4 pb-2 hide-scrollbar">
          {BRANDS.map(brand => (
            <div key={brand.name} className="flex flex-col items-center min-w-[64px]">
              <div className="rounded-full border-2 border-[#D4FF00] bg-black w-14 h-14 flex items-center justify-center shadow-md overflow-hidden">
                <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML += `<span style=\"color:#D4FF00;font-weight:bold;font-size:1.2rem;\">${brand.name[0]}</span>`; }} />
              </div>
              <span className="text-xs text-[#D4FF00] mt-1 font-bold">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernProductList; 