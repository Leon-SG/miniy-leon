import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../../types';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';
import DraftRestoreModal from '../common/DraftRestoreModal';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialProduct?: Product | null;
}

const DRAFT_KEY_NEW = 'miniy_draft_productForm_new';
const getDraftKeyEdit = (productId: string) => `miniy_draft_productForm_edit_${productId}`;

const emptyProduct: Omit<Product, 'id'> & { id?: string } = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: '',
  sku: '',
  stockQuantity: 0,
  tags: [],
  isFeatured: false,
  isPublished: true
};

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSubmit, initialProduct }) => {
  const [product, setProduct] = useState<Omit<Product, 'id'> & { id?: string }>(
    initialProduct || emptyProduct
  );
  const [tagsString, setTagsString] = useState('');
  const { showToast } = useToast();
  const [currentDraftKey, setCurrentDraftKey] = useState(DRAFT_KEY_NEW);
  const [draftActionTaken, setDraftActionTaken] = useState(false); 
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const resetFormAndDraft = useCallback((skipDraftClear = false) => {
    if (!skipDraftClear) {
      localStorage.removeItem(currentDraftKey);
    }
    const baseProduct = initialProduct || emptyProduct;
    setProduct(baseProduct);
    setTagsString(baseProduct.tags?.join(', ') || '');
    setCurrentDraftKey(initialProduct ? getDraftKeyEdit(initialProduct.id) : DRAFT_KEY_NEW);
  }, [currentDraftKey, initialProduct]);

  useEffect(() => {
    const draftKey = initialProduct ? getDraftKeyEdit(initialProduct.id) : DRAFT_KEY_NEW;
    setCurrentDraftKey(draftKey);

    if (isOpen) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setIsDraftModalOpen(true);
      } else {
        resetFormAndDraft(true);
        setDraftActionTaken(false);
      }
    } else {
      setDraftActionTaken(false);
    }
  }, [initialProduct, isOpen, resetFormAndDraft]);

  useEffect(() => {
    if (product.imageUrl && product.imageUrl.startsWith('blob:')) {
      setImagePreviewUrl(product.imageUrl);
    } else if (product.imageUrl) {
      setImagePreviewUrl(product.imageUrl);
    } else {
      setImagePreviewUrl('');
    }
  }, [product.imageUrl]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setProduct(prev => {
      const newProductData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'stockQuantity' ? parseFloat(value) || 0 : value),
      };
      localStorage.setItem(currentDraftKey, JSON.stringify({ productData: newProductData, tagsString }));
      setDraftActionTaken(false);
      return newProductData;
    });
  };
  
  const handleTagsStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTagsString = e.target.value;
    setTagsString(newTagsString);
    localStorage.setItem(currentDraftKey, JSON.stringify({ productData: product, tagsString: newTagsString }));
    setDraftActionTaken(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProduct(prev => ({ ...prev, imageUrl: url }));
      setImagePreviewUrl(url);
    }
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProduct(prev => ({ ...prev, imageUrl: url }));
      setImagePreviewUrl(url);
    }
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem(currentDraftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setProduct(parsedDraft.productData);
        setTagsString(parsedDraft.tagsString);
        showToast("Product draft restored.", "info");
        setDraftActionTaken(false);
      } catch (e) {
        console.error("Failed to parse product draft:", e);
        localStorage.removeItem(currentDraftKey); 
        resetFormAndDraft(true); 
      }
    }
    setIsDraftModalOpen(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(currentDraftKey); 
    resetFormAndDraft(true); 
    setDraftActionTaken(true);
    setIsDraftModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const finalProductSubmit: Product = {
      ...product,
      id: product.id || Date.now().toString(),
      price: Number(product.price) || 0,
      stockQuantity: Number(product.stockQuantity) || 0,
      tags: finalTags,
      isFeatured: !!product.isFeatured,
      isPublished: !!product.isPublished,
    };

    const originalProductState = initialProduct || emptyProduct;
    const originalTagsString = initialProduct?.tags?.join(', ') || '';

    if (draftActionTaken && 
        JSON.stringify(product) === JSON.stringify(originalProductState) && 
        tagsString === originalTagsString
    ) {
      showToast("No new changes to save.", "info");
      localStorage.removeItem(currentDraftKey);
      setDraftActionTaken(false);
      onClose();
      return;
    }
    
    onSubmit(finalProductSubmit);
    localStorage.removeItem(currentDraftKey); 
    setDraftActionTaken(false);
    onClose();
  };
  
  const handleCloseModal = () => {
    setDraftActionTaken(false); 
    onClose();
  };

  const hasUnsavedChanges = localStorage.getItem(currentDraftKey) !== null;

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title={initialProduct ? "Edit Product" : "Add New Product"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 图片预览和拖拽上传区 */}
        <div className="mb-4">
          <div
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-BORDER_DEFAULT rounded-lg p-4 bg-BACKGROUND_CONTENT hover:bg-BACKGROUND_MAIN transition cursor-pointer relative"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleImageDrop}
            onDragOver={handleImageDragOver}
            style={{ minHeight: 160 }}
          >
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="Product Preview" className="max-h-40 object-contain mb-2 rounded shadow" />
            ) : (
              <span className="text-TEXT_MUTED">Drag & drop an image here, or click to upload</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
          {/* Column 1: Basic Information */}
          <section className="space-y-4">
            <h4 className="text-md font-semibold text-TEXT_PRIMARY mb-3 border-b border-BORDER_DEFAULT pb-2">Basic Information</h4>
            <Input
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Price ($)"
              name="price"
              type="number"
              value={product.price.toString()}
              onChange={handleFormChange}
              required
              min="0"
              step="0.01"
            />
            <Textarea
              label="Description"
              name="description"
              value={product.description}
              onChange={handleFormChange}
              required
              rows={3}
            />
          </section>

          {/* Column 2: Inventory & Details */}
          <section className="space-y-4 mt-6 md:mt-0">
            <h4 className="text-md font-semibold text-TEXT_PRIMARY mb-3 border-b border-BORDER_DEFAULT pb-2">Inventory & Details</h4>
            <Input
              label="SKU (Stock Keeping Unit)"
              name="sku"
              value={product.sku || ''}
              onChange={handleFormChange}
            />
            <Input
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={(product.stockQuantity ?? '').toString()}
              onChange={handleFormChange}
              min="0"
            />
            <Input
              label="Category (Optional)"
              name="category"
              value={product.category || ''}
              onChange={handleFormChange}
            />
            <Input
              label="Tags (comma-separated)"
              name="tagsString" 
              value={tagsString}
              onChange={handleTagsStringChange} 
              placeholder="e.g. new, sale, eco-friendly"
            />
          </section>
        </div>

        <section className="mt-6 pt-4 border-t border-BORDER_DEFAULT">
          <h4 className="text-md font-semibold text-TEXT_PRIMARY mb-3 border-b border-BORDER_DEFAULT pb-2">Visibility & Status</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={product.isPublished}
                onChange={handleFormChange}
                className="h-4 w-4 text-PRIMARY_MAIN border-BORDER_DEFAULT rounded focus:ring-PRIMARY_MAIN"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-TEXT_SECONDARY">
                Published (Visible in store)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={product.isFeatured}
                onChange={handleFormChange}
                className="h-4 w-4 text-PRIMARY_MAIN border-BORDER_DEFAULT rounded focus:ring-PRIMARY_MAIN"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-TEXT_SECONDARY">
                Featured Product (Highlight in store)
              </label>
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center pt-4">
           <div className="flex-grow">
            {hasUnsavedChanges && (
                <Button type="button" variant="ghost" size="sm" onClick={handleDiscardDraft} className="text-ERROR_RED hover:bg-ERROR_RED/10">
                    Discard Unsaved Changes
                </Button>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="primary">{initialProduct ? "Save Changes" : "Add Product"}</Button>
          </div>
        </div>
      </form>

      <DraftRestoreModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
        title="Restore Product Draft"
      />
    </Modal>
  );
};

export default ProductForm;
// End of file
