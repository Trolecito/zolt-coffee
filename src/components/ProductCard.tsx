import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  onAddToCart?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  user?: any;
  onAuthRequired?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  size = 'medium', 
  onAddToCart,
  onViewProduct,
  user,
  onAuthRequired
}) => {
  const sizeClasses = {
    small: 'w-64',
    medium: 'w-72',
    large: 'w-80'
  };

  const handleAddToCart = () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    // Abrir modal de producto para seleccionar opciones
    onViewProduct?.(product);
  };

  const handleViewProduct = () => {
    onViewProduct?.(product);
  };

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-[#9C8355] text-white px-2 py-1 rounded-full text-sm font-medium">
          ${product.price}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#5D3A1A] mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex space-x-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-[#9C8355] text-white py-2 rounded-lg font-medium hover:bg-[#5D3A1A] transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>{user ? 'Agregar' : 'Iniciar Sesión'}</span>
          </button>
          <button 
            onClick={handleViewProduct}
            className="px-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>Ver</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;