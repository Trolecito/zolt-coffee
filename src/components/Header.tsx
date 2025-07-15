import React from 'react';
import { User, LogIn, Gift, UserPlus, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user: any;
  onAuthAction: (action: 'login' | 'register' | 'profile') => void;
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  onPageChange, 
  user, 
  onAuthAction, 
  cartItemsCount, 
  onCartClick 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-[#5D3A1A] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onPageChange('home')}
          >
              <img 
              src="/logocoffee.png" 
              alt="Zolt Coffee" 
              className="w-22 h-20 object-contain"
            />
            
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onPageChange('home')}
              className={`text-lg font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-[#9C8355] border-b-2 border-[#9C8355]' 
                  : 'text-white hover:text-[#9C8355]'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onPageChange('menu')}
              className={`text-lg font-medium transition-colors ${
                currentPage === 'menu' 
                  ? 'text-[#9C8355] border-b-2 border-[#9C8355]' 
                  : 'text-white hover:text-[#9C8355]'
              }`}
            >
              Menú
            </button>
            <button
              onClick={() => onPageChange('gift-cards')}
              className={`text-lg font-medium transition-colors flex items-center space-x-1 ${
                currentPage === 'gift-cards' 
                  ? 'text-[#9C8355] border-b-2 border-[#9C8355]' 
                  : 'text-white hover:text-[#9C8355]'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span>Gift Cards</span>
            </button>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-3 text-white hover:text-[#9C8355] transition-all duration-300 cart-icon"
            >
              <div className="w-10 h-10 bg-[#9C8355] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">☕</span>
              </div>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold cart-badge animate-bounce shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {user ? (
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onAuthAction('profile')}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-[#9C8355]"
                />
                <span className="text-white font-medium">{user.name}</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button 
                  onClick={() => onAuthAction('login')}
                  className="flex items-center space-x-2 bg-[#9C8355] text-white px-4 py-2 rounded-lg hover:bg-[#9C8355]/80 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </button>
                <button 
                  onClick={() => onAuthAction('register')}
                  className="flex items-center space-x-2 border-2 border-[#9C8355] text-[#9C8355] px-4 py-2 rounded-lg hover:bg-[#9C8355] hover:text-white transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrarse</span>
                </button>
              </div>
            )}

            {/* Mobile menu button for non-authenticated users */}
            {!user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-[#9C8355] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex justify-around border-t pt-4">
          <button
            onClick={() => onPageChange('home')}
            className={`text-sm font-medium ${
              currentPage === 'home' ? 'text-[#9C8355]' : 'text-white'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onPageChange('menu')}
            className={`text-sm font-medium ${
              currentPage === 'menu' ? 'text-[#9C8355]' : 'text-white'
            }`}
          >
            Menú
          </button>
          <button
            onClick={() => onPageChange('gift-cards')}
            className={`text-sm font-medium ${
              currentPage === 'gift-cards' ? 'text-[#9C8355]' : 'text-white'
            }`}
          >
            Gift Cards
          </button>
        </div>

        {/* Mobile Auth Menu for non-authenticated users */}
        {!user && mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-2">
            <button 
              onClick={() => {
                onAuthAction('login');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-[#9C8355] text-white px-4 py-2 rounded-lg hover:bg-[#9C8355]/80 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
            <button 
              onClick={() => {
                onAuthAction('register');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 border-2 border-[#9C8355] text-[#9C8355] px-4 py-2 rounded-lg hover:bg-[#9C8355] hover:text-white transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrarse</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;