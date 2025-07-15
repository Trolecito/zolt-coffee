import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductOption {
  value: string;
  label: string;
  price: number;
}

interface ProductOptionConfig {
  label: string;
  required: boolean;
  multiple?: boolean;
  options: ProductOption[];
}

interface ProductOptions {
  [key: string]: ProductOptionConfig;
}

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, options: any, quantity: number) => void;
  user?: any;
  onAuthRequired?: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  user,
  onAuthRequired
}) => {
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<Record<string, string | string[]>>({});
  const [basePrice, setBasePrice] = useState(0);

  React.useEffect(() => {
    if (product) {
      setBasePrice(product.price);
      setOptions({});
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const getProductOptions = (): ProductOptions => {
    switch (product.category) {
      case 'cafe':
      case 'frappes':
        return {
          size: {
            label: 'Tamaño *',
            required: true,
            options: [
              { value: 'small', label: 'Pequeño', price: 0 },
              { value: 'medium', label: 'Mediano', price: 10 },
              { value: 'large', label: 'Grande', price: 20 }
            ]
          },
          milk: {
            label: 'Tipo de Leche *',
            required: true,
            options: [
              { value: 'whole', label: 'Entera', price: 0 },
              { value: 'skim', label: 'Descremada', price: 0 },
              { value: 'lactose-free', label: 'Deslactosada', price: 5 },
              { value: 'almond', label: 'Almendra', price: 8 },
              { value: 'oat', label: 'Avena', price: 8 }
            ]
          },
          sweetener: {
            label: 'Endulzante',
            required: false,
            options: [
              { value: 'none', label: 'Sin endulzante', price: 0 },
              { value: 'sugar', label: 'Azúcar', price: 0 },
              { value: 'brown-sugar', label: 'Azúcar morena', price: 0 },
              { value: 'stevia', label: 'Stevia', price: 0 },
              { value: 'honey', label: 'Miel', price: 3 }
            ]
          },
          ...(product.category === 'cafe' && {
            temperature: {
              label: 'Temperatura',
              required: false,
              options: [
                { value: 'hot', label: 'Caliente', price: 0 },
                { value: 'cold', label: 'Frío', price: 5 }
              ]
            }
          }),
          extras: {
            label: 'Extras',
            required: false,
            multiple: true,
            options: [
              { value: 'extra-shot', label: 'Shot extra', price: 15 },
              { value: 'whipped-cream', label: 'Crema batida', price: 8 },
              { value: 'syrup', label: 'Jarabe de sabor', price: 5 },
              { value: 'cinnamon', label: 'Canela', price: 2 }
            ]
          }
        };
      case 'malteadas':
        return {
          size: {
            label: 'Tamaño *',
            required: true,
            options: [
              { value: 'regular', label: 'Regular', price: 0 },
              { value: 'large', label: 'Grande', price: 15 }
            ]
          },
          toppings: {
            label: 'Toppings',
            required: false,
            multiple: true,
            options: [
              { value: 'whipped-cream', label: 'Crema batida', price: 8 },
              { value: 'chocolate-chips', label: 'Chispas de chocolate', price: 10 },
              { value: 'caramel', label: 'Caramelo', price: 8 },
              { value: 'cherry', label: 'Cereza', price: 5 }
            ]
          }
        };
      case 'snacks':
        return {
          preparation: {
            label: 'Preparación',
            required: false,
            options: [
              { value: 'cold', label: 'Frío', price: 0 },
              { value: 'heated', label: 'Calentado', price: 0 }
            ]
          }
        };
      default:
        return {};
    }
  };

  const productOptions = getProductOptions();

  const calculateTotalPrice = () => {
    let total = basePrice;
    
    Object.entries(options).forEach(([key, value]: [string, string | string[]]) => {
      const optionConfig: ProductOptionConfig | undefined = productOptions[key];
      if (!optionConfig) return;

      if (optionConfig.multiple && Array.isArray(value)) {
        value.forEach((v: string) => {
          const option = optionConfig.options.find((opt: ProductOption) => opt.value === v);
          if (option) total += option.price;
        });
      } else if (typeof value === 'string') {
        const option = optionConfig.options.find((opt: ProductOption) => opt.value === value);
        if (option) total += option.price;
      }
    });

    return total * quantity;
  };

  const handleOptionChange = (key: string, value: string | string[]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleMultipleOptionChange = (key: string, value: string, checked: boolean) => {
    setOptions((prev: Record<string, string | string[]>) => {
      const currentValues = prev[key] || [];
      if (checked) {
        return { ...prev, [key]: [...(Array.isArray(currentValues) ? currentValues : []), value] };
      } else {
        return { ...prev, [key]: Array.isArray(currentValues) ? currentValues.filter((v: string) => v !== value) : [] };
      }
    });
  };

  const isFormValid = () => {
    return Object.entries(productOptions).every(([key, config]) => {
      if (!config.required) return true;
      const value = options[key];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }

    if (!isFormValid()) {
      alert('Por favor completa todos los campos requeridos (marcados con *)');
      return;
    }

    onAddToCart(product, options, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#5D3A1A]">Personalizar Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Product Info */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-[#5D3A1A] mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="bg-[#9C8355]/10 rounded-lg p-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Precio base:</span>
                <span className="text-[#9C8355]">${basePrice}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold mt-2">
                <span>Total:</span>
                <span className="text-[#5D3A1A]">${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Options */}
            {Object.entries(productOptions).map(([key, config]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {config.label}
                  {config.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {config.multiple ? (
                  <div className="space-y-2">
                    {config.options.map((option: ProductOption) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(options[key] || []).includes(option.value)}
                          onChange={(e) => handleMultipleOptionChange(key, option.value, e.target.checked)}
                          className="rounded border-gray-300 text-[#9C8355] focus:ring-[#9C8355]"
                        />
                        <span className="flex-1">{option.label}</span>
                        {option.price > 0 && (
                          <span className="text-[#9C8355] font-medium">+${option.price}</span>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {config.options.map((option: ProductOption) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={key}
                          value={option.value}
                          checked={options[key] === option.value}
                          onChange={(e) => handleOptionChange(key, e.target.value)}
                          className="text-[#9C8355] focus:ring-[#9C8355]"
                        />
                        <span className="flex-1">{option.label}</span>
                        {option.price > 0 && (
                          <span className="text-[#9C8355] font-medium">+${option.price}</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleAddToCart}
              disabled={!isFormValid()}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                isFormValid()
                  ? 'bg-[#9C8355] text-white hover:bg-[#5D3A1A]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>
                {user 
                  ? `Agregar al Carrito - $${calculateTotalPrice().toFixed(2)}`
                  : 'Iniciar Sesión para Comprar'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;