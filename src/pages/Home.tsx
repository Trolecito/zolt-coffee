import React from 'react';
import { Coffee, Coffee as CoffeeIcon, Zap, IceCream, Cookie } from 'lucide-react';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { featuredProducts } from '../data/products';
import { Product } from '../types';

interface HomeProps {
  onPageChange: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  user?: any;
  onAuthRequired?: () => void;
}

const Home: React.FC<HomeProps> = ({ onPageChange, onAddToCart, onViewProduct, user, onAuthRequired }) => {
  const categories = [
    {
      id: 'cafe',
      name: 'Café',
      icon: CoffeeIcon,
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'frappes',
      name: 'Frappes',
      icon: Zap,
      image: 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'malteadas',
      name: 'Malteadas',
      icon: IceCream,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'snacks',
      name: 'Snacks',
      icon: Cookie,
      image: 'https://images.pexels.com/photos/1003923/pexels-photo-1003923.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#5D3A1A] mb-4">
            Ofertas del Mes
          </h1>
          <p className="text-gray-600 text-lg">
            Descubre nuestras promociones especiales y disfruta del mejor café
          </p>
        </div>
        <Carousel />
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#5D3A1A] text-center mb-8">
          Nuestras Categorías
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => onPageChange('menu')}
            >
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <category.icon className="w-6 h-6" />
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <button className="w-full bg-[#9C8355] text-white py-2 rounded-lg font-medium hover:bg-[#5D3A1A] transition-colors">
                  Ver Productos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#5D3A1A] text-center mb-8">
          Más Vendidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {featuredProducts.map((product) => (
            <div key={product.id} data-product-id={product.id}>
              <ProductCard 
              product={product} 
              onAddToCart={onAddToCart}
              onViewProduct={onViewProduct}
              user={user}
              onAuthRequired={onAuthRequired}
              />
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#5D3A1A] mb-6">
                Sobre Zolt Coffee
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                En Zolt Coffee, nos apasiona crear experiencias únicas a través del café. 
                Seleccionamos los mejores granos de café de origen, tostados artesanalmente 
                para ofrecerte sabores excepcionales en cada taza.
              </p>
              <p className="text-gray-600 mb-6">
                Nuestro compromiso es brindar un ambiente cálido y acogedor donde puedas 
                disfrutar momentos especiales con amigos, familia o simplemente contigo mismo.
              </p>
              <button className="bg-[#9C8355] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors">
                Conoce Más
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Café ambiente"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#9C8355] rounded-full flex items-center justify-center">
                <Coffee className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;