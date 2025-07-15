import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'Combo Matutino',
    description: 'Café + Croissant por solo $75',
    image: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=800',
    discount: '25% OFF'
  },
  {
    id: '2',
    title: 'Frappe del Mes',
    description: 'Frappe Caramelo con descuento especial',
    image: 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800',
    discount: '20% OFF'
  },
  {
    id: '3',
    title: 'Hora Feliz',
    description: 'Todas las malteadas a precio especial de 3-5 PM',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
    discount: '30% OFF'
  }
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-lg">
      {offers.map((offer, index) => (
        <div
          key={offer.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
            <div className="absolute inset-0 flex items-center justify-start p-8">
              <div className="text-white max-w-md">
                <span className="inline-block bg-[#9C8355] text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {offer.discount}
                </span>
                <h3 className="text-4xl font-bold mb-4">{offer.title}</h3>
                <p className="text-xl mb-6 text-gray-200">{offer.description}</p>
                <button className="bg-[#9C8355] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors">
                  Ver Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;