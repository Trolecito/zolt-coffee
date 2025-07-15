import React, { useState } from 'react';
import { Coffee, Zap, IceCream, Cookie } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

interface MenuProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  user?: any;
  onAuthRequired?: () => void;
}

const Menu: React.FC<MenuProps> = ({ onAddToCart, onViewProduct, user, onAuthRequired }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('cafe');

  const categories = [
    { id: 'cafe', name: 'Café', icon: Coffee },
    { id: 'frappes', name: 'Frappes', icon: Zap },
    { id: 'malteadas', name: 'Malteadas', icon: IceCream },
    { id: 'snacks', name: 'Snacks', icon: Cookie }
  ];

  const filteredProducts = products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold text-[#5D3A1A] mb-6">Categorías</h2>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#9C8355] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#5D3A1A] mb-2">
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </h1>
              <p className="text-gray-600">
                Descubre nuestra selección de {categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} data-product-id={product.id}>
                  <ProductCard 
                  product={product} 
                  size="large" 
                  onAddToCart={onAddToCart}
                  onViewProduct={onViewProduct}
                  user={user}
                  onAuthRequired={onAuthRequired}
                  />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No hay productos disponibles en esta categoría
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;