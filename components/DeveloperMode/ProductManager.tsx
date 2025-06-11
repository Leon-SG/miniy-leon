

import React, { useState } from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import Button from '../common/Button';
import { AddCircleIcon, PackageIcon } from '../../constants'; // Changed from PlusIcon

interface ProductManagerProps {
  products: Product[];
  onUpdateProducts: (updatedProducts: Product[]) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, onUpdateProducts }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onUpdateProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleMoveProduct = (productId: string, direction: 'up' | 'down') => {
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return;

    const newProducts = [...products];
    const productToMove = newProducts[index];

    if (direction === 'up' && index > 0) {
      newProducts.splice(index, 1);
      newProducts.splice(index - 1, 0, productToMove);
      onUpdateProducts(newProducts);
    } else if (direction === 'down' && index < products.length - 1) {
      newProducts.splice(index, 1);
      newProducts.splice(index + 1, 0, productToMove);
      onUpdateProducts(newProducts);
    }
  };

  const handleToggleFeature = (productId: string) => {
    onUpdateProducts(
      products.map(p => p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p)
    );
  };

  const handleTogglePublish = (productId: string) => {
     onUpdateProducts(
      products.map(p => p.id === productId ? { ...p, isPublished: !p.isPublished } : p)
    );
  };

  const handleFormSubmit = (productData: Product) => {
    if (editingProduct) {
      onUpdateProducts(products.map(p => (p.id === productData.id ? productData : p)));
    } else {
      const newProductWithDefaults: Product = {
        id: productData.id || Date.now().toString(),
        ...productData,
        isFeatured: productData.isFeatured ?? false,
        isPublished: productData.isPublished ?? true,
        tags: productData.tags || [],
      };
      onUpdateProducts([...products, newProductWithDefaults]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-4">
        <h2 className="text-2xl font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">Manage Products</h2>
        <Button variant="primary" onClick={handleAddProduct} leftIcon={<AddCircleIcon className="w-5 h-5" />}>
          Add Product
        </Button>
      </div>
      {products.length > 0 ? (
        <div className="space-y-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onMove={handleMoveProduct}
              onToggleFeature={handleToggleFeature}
              onTogglePublish={handleTogglePublish}
              isFirst={index === 0}
              isLast={index === products.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-BORDER_DEFAULT dark:border-replit-dark-border rounded-lg">
          <PackageIcon className="w-12 h-12 mx-auto text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-2" />
          <p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary font-medium">No products yet.</p>
          <p className="text-sm text-TEXT_MUTED dark:text-replit-dark-text-disabled">Click "Add Product" to get started.</p>
        </div>
      )}
      {isFormOpen && (
        <ProductForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
          initialProduct={editingProduct}
        />
      )}
    </div>
  );
};

export default ProductManager;
// End of file
