import React from 'react';
import { Coffee, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#5D3A1A] text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#9C8355] rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Zolt Coffee</span>
            </div>
            <p className="text-gray-300 text-sm">
              Disfruta del mejor café artesanal en un ambiente cálido y acogedor. 
              Cada taza cuenta una historia.
            </p>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9C8355]">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#9C8355]" />
                <span className="text-sm text-gray-300">Av. Principal 123, Ciudad</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#9C8355]" />
                <span className="text-sm text-gray-300">+52 555 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#9C8355]" />
                <span className="text-sm text-gray-300">info@zoltcoffee.com</span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9C8355]">Horarios</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Lunes - Viernes</span>
                <span>7:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado</span>
                <span>8:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span>8:00 - 21:00</span>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#9C8355]">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-[#9C8355] rounded-full flex items-center justify-center hover:bg-[#9C8355]/80 transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-[#9C8355] rounded-full flex items-center justify-center hover:bg-[#9C8355]/80 transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-[#9C8355] rounded-full flex items-center justify-center hover:bg-[#9C8355]/80 transition-colors">
                <Twitter className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Zolt Coffee. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;