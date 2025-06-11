import React from 'react';
import './FishboneSkeleton.css';

const FishboneSkeleton: React.FC = () => (
  <div className="fishbone-dark-bg">
    {/* 标题区域 */}
    <div className="skeleton-title-block">
      <div className="skeleton-title shimmer"></div>
      <div className="skeleton-subtitle shimmer"></div>
    </div>

    {/* 商品列表 */}
    <div className="skeleton-products">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div key={idx} className="skeleton-product-card">
          <div className="skeleton-product-image shimmer"></div>
          <div className="skeleton-product-info">
            <div className="skeleton-product-name shimmer"></div>
            <div className="skeleton-product-price shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FishboneSkeleton; 